import {
  ATTENTION_EXPECT,
  EXTREME_RESPONSE_COUNT_THRESHOLD,
  LIE_HIGH_THRESHOLD,
  LIE_IDS,
  SCALE_ORDER,
  SCORING_EXCLUDED_IDS,
  SCALES,
} from "./items.js?v=20260916x";

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
  // v2.0+ 검증: 점검 문항(주의/허위) + 극단반응(1/6 반복)
  const answeredScored = Array.from({ length: 28 }, (_, i) => i + 1)
    .map((id) => answers[id])
    .filter((v) => v != null);

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
  // attention_ok는 '지정 응답 점검' 스크린의 통과 여부를 의미합니다.
  const attentionOk = attentionItemsApplied ? attentionItemsOk : true;

  const ones = answeredScored.filter((v) => v === 1).length;
  const sixes = answeredScored.filter((v) => v === 6).length;
  const tooExtreme = ones >= EXTREME_RESPONSE_COUNT_THRESHOLD || sixes >= EXTREME_RESPONSE_COUNT_THRESHOLD;
  const lieItemsOk = LIE_IDS.every((id) => {
    const v = answers[id];
    if (v == null) return true;
    return v < LIE_HIGH_THRESHOLD;
  });
  const lieOk = !tooExtreme && lieItemsOk;
  // 신뢰도(reliable)는 '점검(주의/허위/극단반응) 문항'만으로 판단합니다.
  // 레거시 데이터처럼 점검 문항이 없으면 해당 스크린은 미적용(통과)으로 처리합니다.
  const reliable = (attentionItemsApplied ? attentionItemsOk : true) && lieOk;
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
