import type { G2bServcItem, Notice } from "./types.js";
import { enrichNotice } from "./filter.js";

const DEFAULT_BASE = "https://apis.data.go.kr/1230000/ad/BidPublicInfoService";
/** 구형 경로 (일부 키/문서에서 아직 사용) */
const LEGACY_BASE = "https://apis.data.go.kr/1230000/BidPublicInfoService";
const SERVIC_LIST_OP = "getBidPblancListInfoServc";

/** Encoding 키를 붙여넣어도 Decoding으로 맞춤. 키 값은 로그에 남기지 말 것. */
export function normalizeServiceKey(raw: string): string {
  let key = raw.trim().replace(/^["']|["']$/g, "");
  // BOM / 제로폭 문자 제거
  key = key.replace(/^\uFEFF/, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
  if (/%[0-9A-Fa-f]{2}/.test(key)) {
    try {
      key = decodeURIComponent(key);
    } catch {
      /* keep original */
    }
  }
  return key.trim();
}

export function describeKey(key: string): string {
  return `len=${key.length} pct=${/%/.test(key)} endsEq=${/=+$/.test(key)}`;
}

export interface FetchWindow {
  begin: string; // yyyyMMddHHmm
  end: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Asia/Seoul 벽시계 기준 yyyyMMddHHmm (서버가 UTC여도 오프셋 +9 적용) */
export function formatSeoulStamp(d: Date): string {
  const seoul = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = seoul.getUTCFullYear();
  const m = pad(seoul.getUTCMonth() + 1);
  const day = pad(seoul.getUTCDate());
  const h = pad(seoul.getUTCHours());
  const min = pad(seoul.getUTCMinutes());
  return `${y}${m}${day}${h}${min}`;
}

export function buildLookbackWindows(
  lookbackDays: number,
  chunkDays = 6
): FetchWindow[] {
  const now = new Date();
  const windows: FetchWindow[] = [];
  let remaining = Math.max(1, lookbackDays);
  let end = now;

  while (remaining > 0) {
    const span = Math.min(chunkDays, remaining);
    const begin = new Date(end.getTime() - span * 24 * 60 * 60 * 1000);
    windows.push({
      begin: formatSeoulStamp(begin),
      end: formatSeoulStamp(end),
    });
    end = begin;
    remaining -= span;
  }
  return windows.reverse();
}

function parseAmount(raw?: string): number | null {
  if (!raw) return null;
  const n = Number(String(raw).replace(/,/g, "").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseG2bDate(raw?: string): string | null {
  if (!raw) return null;
  const s = raw.trim();
  // 2026-03-20 14:00:00 | 202603201400 | 2026/03/20
  const digits = s.replace(/\D/g, "");
  if (digits.length >= 12) {
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    const h = digits.slice(8, 10);
    const min = digits.slice(10, 12);
    return `${y}-${m}-${d}T${h}:${min}:00+09:00`;
  }
  if (digits.length >= 8) {
    const y = digits.slice(0, 4);
    const m = digits.slice(4, 6);
    const d = digits.slice(6, 8);
    return `${y}-${m}-${d}T00:00:00+09:00`;
  }
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

export function mapG2bItem(item: G2bServcItem): Notice | null {
  const no = item.bidNtceNo?.trim();
  const ord = (item.bidNtceOrd ?? "00").trim();
  const title = (item.bidNtceNm ?? "").trim();
  if (!no || !title) return null;

  const url =
    (item.bidNtceDtlUrl || item.bidNtceUrl || "").trim() ||
    `https://www.g2b.go.kr/link/PNPE027_01/bidNtceNo/${encodeURIComponent(no)}`;

  return enrichNotice({
    id: `g2b:${no}:${ord}`,
    source: "g2b",
    externalId: `${no}-${ord}`,
    title,
    organization: (item.ntceInsttNm || item.dminsttNm || "미상").trim(),
    demandOrg: item.dminsttNm?.trim(),
    budget: parseAmount(item.presmptPrce) ?? parseAmount(item.asignBdgtAmt),
    postedAt: parseG2bDate(item.bidNtceDt || item.bidNtceDate),
    deadlineAt: parseG2bDate(item.bidClseDt || item.bidClseDate || item.opengDt),
    url,
    method: item.bidMethdNm?.trim(),
  });
}

interface G2bResponse {
  response?: {
    header?: { resultCode?: string; resultMsg?: string };
    body?: {
      items?: G2bServcItem[] | { item?: G2bServcItem | G2bServcItem[] };
      totalCount?: number | string;
      pageNo?: number | string;
      numOfRows?: number | string;
    };
  };
}

function unwrapItems(body: G2bResponse["response"]): G2bServcItem[] {
  const raw = body?.body?.items;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  const item = raw.item;
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

async function fetchServcPageOnce(opts: {
  serviceKey: string;
  baseUrl: string;
  begin: string;
  end: string;
  pageNo: number;
  numOfRows: number;
}): Promise<{ items: G2bServcItem[]; totalCount: number; baseUrl: string }> {
  const base = opts.baseUrl.replace(/\/$/, "");
  const params = new URLSearchParams({
    pageNo: String(opts.pageNo),
    numOfRows: String(opts.numOfRows),
    inqryDiv: "1",
    inqryBgnDt: opts.begin,
    inqryEndDt: opts.end,
    type: "json",
  });
  // Decoding 키는 한 번만 인코딩
  const url = `${base}/${SERVIC_LIST_OP}?${params.toString()}&serviceKey=${encodeURIComponent(opts.serviceKey)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(45_000),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`G2B HTTP ${res.status} (${base}): ${text.slice(0, 240)}`);
  }

  let data: G2bResponse;
  try {
    data = JSON.parse(text) as G2bResponse;
  } catch {
    // 게이트웨이가 XML/JSON 혼용으로 오류를 줄 때
    if (/SERVICE_KEY_IS_NOT_REGISTERED|등록되지 않은 서비스키|returnReasonCode["\s:>]*30/.test(text)) {
      throw new Error(
        `G2B 인증 실패(코드 30, ${base}): 서비스키가 이 API에 등록되지 않았거나 Encoding 키/오타입니다. 공공데이터포털에서 '조달청_나라장터 입찰공고정보서비스' 승인 + Decoding 키를 확인하세요.`
      );
    }
    throw new Error(`G2B JSON 파싱 실패 (${base}): ${text.slice(0, 180)}`);
  }

  const code = data.response?.header?.resultCode;
  const msg = data.response?.header?.resultMsg ?? "";
  // 00 / 0 / 03(데이터 없음) 허용
  if (code && code !== "00" && code !== "0" && code !== "03") {
    throw new Error(`G2B API 오류 ${code} (${base}): ${msg}`);
  }

  const items = unwrapItems(data.response);
  const totalCount = Number(data.response?.body?.totalCount ?? items.length) || 0;
  return { items, totalCount, baseUrl: base };
}

export async function fetchServcPage(opts: {
  serviceKey: string;
  baseUrl?: string;
  begin: string;
  end: string;
  pageNo: number;
  numOfRows?: number;
}): Promise<{ items: G2bServcItem[]; totalCount: number }> {
  const key = normalizeServiceKey(opts.serviceKey);
  const numOfRows = opts.numOfRows ?? 100;
  const bases = opts.baseUrl
    ? [opts.baseUrl]
    : [DEFAULT_BASE, LEGACY_BASE];

  let lastErr: unknown;
  for (const baseUrl of bases) {
    try {
      const result = await fetchServcPageOnce({
        serviceKey: key,
        baseUrl,
        begin: opts.begin,
        end: opts.end,
        pageNo: opts.pageNo,
        numOfRows,
      });
      return result;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      // 키/인증 오류면 다른 base도 시도
      if (!/403|등록되지 않은|SERVICE_KEY|코드 30|인증 실패/.test(msg)) {
        throw err;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function fetchAllServc(opts: {
  serviceKey: string;
  baseUrl?: string;
  lookbackDays: number;
  delayMs?: number;
  onProgress?: (msg: string) => void;
}): Promise<G2bServcItem[]> {
  const delayMs = opts.delayMs ?? 350;
  const windows = buildLookbackWindows(opts.lookbackDays, 6);
  const all: G2bServcItem[] = [];

  for (const w of windows) {
    let pageNo = 1;
    let totalCount = Infinity;
    while ((pageNo - 1) * 100 < totalCount) {
      opts.onProgress?.(
        `용역 ${w.begin}~${w.end} page ${pageNo}`
      );
      const { items, totalCount: total } = await fetchServcPage({
        serviceKey: opts.serviceKey,
        baseUrl: opts.baseUrl,
        begin: w.begin,
        end: w.end,
        pageNo,
      });
      totalCount = total;
      all.push(...items);
      if (items.length === 0) break;
      pageNo += 1;
      if (pageNo > 50) break; // 안전장치
      await sleep(delayMs);
    }
  }
  return all;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
