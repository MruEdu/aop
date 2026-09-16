import {
  ATTENTION_EXPECT,
  CONSISTENCY_DIFF_THRESHOLD,
  CONSISTENCY_PAIRS,
  EXTREME_RESPONSE_COUNT_THRESHOLD,
  LIE_HIGH_THRESHOLD,
  LIE_IDS,
  SCALE_ORDER,
  SCORING_EXCLUDED_IDS,
  SCALES,
} from "./items.js?v=20260916r";

function mean(xs) {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function scoreAnswers(answers) {
  const scores = {};
  for (const key of SCALE_ORDER) {
    const spec = SCALES[key];
    const ids = spec.items.filter((id) => !SCORING_EXCLUDED_IDS.includes(id));
    const vals = ids.map((id) => {
      const v = answers[id];
      if (v == null) throw new Error("missing item " + id);
      return v;
    });
    scores[key] = Math.round(mean(vals) * 100) / 100;
  }
  // v2.0+ 검증: 1) 일관성(28문항 내) + 2) 점검 문항(주의/허위) + 3) 극단반응
  const answeredScored = Array.from({ length: 28 }, (_, i) => i + 1)
    .map((id) => answers[id])
    .filter((v) => v != null);

  const consistencyOk = CONSISTENCY_PAIRS.every(([a, b]) => {
    const va = answers[a];
    const vb = answers[b];
    if (va == null || vb == null) return true;
    return Math.abs(va - vb) <= CONSISTENCY_DIFF_THRESHOLD;
  });

  let attentionAnswered = 0;
  let attentionItemsOk = true;
  for (const [rawId, expect] of Object.entries(ATTENTION_EXPECT)) {
    const id = Number(rawId);
    const v = answers[id];
    if (v == null) continue; // 레거시(33문항) 데이터는 점검 문항이 없을 수 있음
    attentionAnswered += 1;
    if (v !== expect) attentionItemsOk = false;
  }
  // 점검 문항이 존재하지 않는 레거시 세션은 이 스크린을 '미적용'으로 처리
  const attentionItemsApplied = attentionAnswered > 0;
  // 점검 문항(지정 응답)과 일관성은 분리해서 보되, 연구 초기에는 지나치게 엄격한 컷오프를 피하기 위해
  // 최종 reliable은 '3가지 스크린 중 2개 이상 통과'로 판단합니다.
  const attentionOk = consistencyOk;

  const ones = answeredScored.filter((v) => v === 1).length;
  const sixes = answeredScored.filter((v) => v === 6).length;
  const tooExtreme = ones >= EXTREME_RESPONSE_COUNT_THRESHOLD || sixes >= EXTREME_RESPONSE_COUNT_THRESHOLD;
  const lieItemsOk = LIE_IDS.every((id) => {
    const v = answers[id];
    if (v == null) return true;
    return v < LIE_HIGH_THRESHOLD;
  });
  const lieOk = !tooExtreme && lieItemsOk;
  const screens = [
    { applied: true, ok: consistencyOk },
    { applied: attentionItemsApplied, ok: attentionItemsOk },
    { applied: true, ok: lieOk },
  ];
  const applied = screens.filter((s) => s.applied);
  const screensPassed = applied.filter((s) => s.ok).length;
  // 원칙: 3개 중 2개 통과. 단, 레거시처럼 적용 가능한 스크린이 2개면 2개 모두 통과.
  const reliable = screensPassed >= Math.min(2, applied.length);
  return { scores, attentionOk, lieOk, reliable };
}

export function band(score) {
  if (score < 2.5) return "low";
  if (score < 4) return "mid";
  return "high";
}

export function bandLabel(score) {
  const b = band(score);
  if (b === "low") return "낮음";
  if (b === "mid") return "보통";
  return "높음";
}

const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeResultNo() {
  let s = "AOP-";
  const buf = new Uint8Array(4);
  crypto.getRandomValues(buf);
  for (const n of buf) s += ALPH[n % ALPH.length];
  return s;
}

export function makeExpertCode() {
  let s = "EXP-";
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  for (const n of buf) s += ALPH[n % ALPH.length];
  return s;
}

export function uid() {
  return crypto.randomUUID();
}
