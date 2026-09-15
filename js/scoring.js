import { ATTENTION_EXPECT, LIE_IDS, SCALE_ORDER, SCORING_EXCLUDED_IDS, SCALES } from "./items.js?v=20260915d";

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
  const attPairs = Object.entries(ATTENTION_EXPECT).map(([id, expect]) => [Number(id), expect]);
  const attPresent = attPairs.filter(([id]) => answers[id] != null);
  const attentionOk = attPresent.length === 0 ? true : attPresent.every(([id, expect]) => answers[id] === expect);

  const liePresent = LIE_IDS.filter((id) => answers[id] != null);
  const lieOk = liePresent.length === 0 ? true : !liePresent.some((id) => (answers[id] ?? 0) > 3);
  return { scores, attentionOk, lieOk, reliable: attentionOk && lieOk };
}

export function band(score) {
  if (score < 2.5) return "low";
  if (score <= 4) return "mid";
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
