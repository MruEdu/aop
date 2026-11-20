import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAllServc, mapG2bItem } from "./g2b.js";
import type { Notice, NoticesFile } from "./types.js";
import { enrichNotice } from "./filter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "data", "notices.json");

const FIXTURE_RAW = [
  {
    id: "g2b:SAMPLE-001:00",
    source: "g2b" as const,
    externalId: "SAMPLE-001-00",
    title: "지역 청년 고용 실태조사 및 정책연구 용역",
    organization: "○○지방자치단체",
    budget: 45_000_000,
    postedAt: "2026-03-18T09:00:00+09:00",
    deadlineAt: "2026-03-28T18:00:00+09:00",
    url: "https://www.g2b.go.kr/",
    topics: ["needs", "policy"] as Notice["topics"],
    relevanceScore: 9,
    snippet: "○○지방자치단체 · 4,500만",
  },
  {
    id: "g2b:SAMPLE-002:00",
    source: "g2b" as const,
    externalId: "SAMPLE-002-00",
    title: "교육과정 개발 및 요구분석 연구용역",
    organization: "○○대학교 산학협력단",
    budget: 28_000_000,
    postedAt: "2026-03-17T10:00:00+09:00",
    deadlineAt: "2026-03-25T17:00:00+09:00",
    url: "https://www.g2b.go.kr/",
    topics: ["education", "needs"] as Notice["topics"],
    relevanceScore: 10,
    snippet: "○○대학교 산학협력단 · 2,800만",
  },
  {
    id: "g2b:SAMPLE-003:00",
    source: "g2b" as const,
    externalId: "SAMPLE-003-00",
    title: "공공갈등 관련 텍스트마이닝 기반 데이터 분석 용역",
    organization: "국책연구원(예시)",
    budget: 80_000_000,
    postedAt: "2026-03-16T11:00:00+09:00",
    deadlineAt: "2026-04-02T18:00:00+09:00",
    url: "https://www.g2b.go.kr/",
    topics: ["data"] as Notice["topics"],
    relevanceScore: 8,
    snippet: "국책연구원(예시) · 8,000만",
  },
];

const FIXTURE: Notice[] = FIXTURE_RAW.map((n) => enrichNotice(n)!);

function loadEnvFile(): void {
  try {
    const raw = readFileSync(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2] ?? "";
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  } catch {
    /* no .env */
  }
}

async function loadExisting(): Promise<Notice[]> {
  try {
    const raw = await readFile(OUT, "utf8");
    const parsed = JSON.parse(raw) as NoticesFile;
    return Array.isArray(parsed.notices) ? parsed.notices : [];
  } catch {
    return [];
  }
}

function mergeNotices(existing: Notice[], incoming: Notice[]): Notice[] {
  const map = new Map<string, Notice>();
  for (const n of existing) {
    if (!n.id.startsWith("g2b:SAMPLE-")) map.set(n.id, n);
  }
  for (const n of incoming) map.set(n.id, n);
  return [...map.values()].sort((a, b) => {
    const da = a.deadlineAt ?? "";
    const db = b.deadlineAt ?? "";
    return da.localeCompare(db);
  });
}

async function writeNotices(
  notices: Notice[],
  meta: { source: string; lookbackDays: number }
): Promise<void> {
  await mkdir(path.dirname(OUT), { recursive: true });
  const file: NoticesFile = {
    generatedAt: new Date().toISOString(),
    source: meta.source,
    lookbackDays: meta.lookbackDays,
    count: notices.length,
    notices,
  };
  await writeFile(OUT, JSON.stringify(file, null, 2) + "\n", "utf8");
  console.log(`Wrote ${notices.length} notices → ${OUT}`);
}

async function main(): Promise<void> {
  loadEnvFile();
  const useFixture = process.argv.includes("--fixture");
  const lookbackDays = Number(process.env.COLLECT_LOOKBACK_DAYS || 6);

  if (useFixture) {
    const existing = await loadExisting();
    const merged = mergeNotices(
      existing.filter((n) => n.id.startsWith("g2b:SAMPLE-")),
      FIXTURE
    );
    await writeNotices(merged.length ? merged : FIXTURE, {
      source: "fixture",
      lookbackDays,
    });
    return;
  }

  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY?.trim();
  if (!serviceKey) {
    console.warn(
      "DATA_GO_KR_SERVICE_KEY 없음 → fixture로 생성합니다. (실제 수집: 키 설정 후 npm run collect)"
    );
    await writeNotices(FIXTURE, { source: "fixture-fallback", lookbackDays });
    return;
  }

  console.log(`나라장터 용역 수집 시작 (lookback ${lookbackDays}일)`);
  const items = await fetchAllServc({
    serviceKey,
    baseUrl: process.env.DATA_GO_KR_BASE_URL,
    lookbackDays,
    onProgress: (m) => console.log(`  ${m}`),
  });
  console.log(`원본 용역 ${items.length}건 → 필터링`);

  const mapped: Notice[] = [];
  for (const item of items) {
    const n = mapG2bItem(item);
    if (n) mapped.push(n);
  }
  console.log(`연구·조사 관련 ${mapped.length}건`);

  const existing = await loadExisting();
  const merged = mergeNotices(existing, mapped);
  await writeNotices(merged, { source: "g2b-servc", lookbackDays });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
