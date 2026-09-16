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
} from "./items.js?v=20260916i";

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
    return Math.abs(va - vb) < CONSISTENCY_DIFF_THRESHOLD;
  });

  const attentionItemsOk = Object.entries(ATTENTION_EXPECT).every(([rawId, expect]) => {
    const id = Number(rawId);
    const v = answers[id];
    return v === expect;
  });
  const attentionOk = consistencyOk && attentionItemsOk;

  const ones = answeredScored.filter((v) => v === 1).length;
  const sixes = answeredScored.filter((v) => v === 6).length;
  const tooExtreme = ones >= EXTREME_RESPONSE_COUNT_THRESHOLD || sixes >= EXTREME_RESPONSE_COUNT_THRESHOLD;
  const lieItemsOk = LIE_IDS.every((id) => {
    const v = answers[id];
    if (v == null) return true;
    return v < LIE_HIGH_THRESHOLD;
  });
  const lieOk = !tooExtreme && lieItemsOk;
  return { scores, attentionOk, lieOk, reliable: attentionOk && lieOk };
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
