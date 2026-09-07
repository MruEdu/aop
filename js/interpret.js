import { SCALE_ORDER, SCALES } from "./items.js?v=20260907c";
import { band, bandLabel } from "./scoring.js?v=20260907c";

const AXIS = {
  ie: {
    high: "계획·절차보다 직관과 마감 압박으로 과제에 바로 들어갑니다. 속도는 나지만, 사전 분배가 약해질 수 있습니다.",
    mid: "돌입과 계획이 섞여 있습니다. 과제 성격에 따라 즉흥과 절차를 오갑니다.",
    low: "단계별 계획과 표준 절차로 학업을 굴립니다. 실수는 줄지만, 시작이 늦어질 수 있습니다.",
  },
  sa: {
    high: "규칙, 데이터, 도식으로 내용을 구조화하는 쪽입니다. 분석에 힘이 있습니다.",
    mid: "체계화와 직관을 함께 씁니다. 자료가 복잡할 때 도식화가 도움이 됩니다.",
    low: "시스템·수치로 읽기보다 다른 경로로 이해합니다. 분석 과제에서는 의도적으로 구조를 그려 보는 연습이 필요합니다.",
  },
  wd: {
    high: "비판, 분량, 실패 앞에서 주체가 쉽게 접히고, 답을 AI에 넘기고 싶어집니다. 과부하 신호를 먼저 읽으십시오.",
    mid: "가끔 위축되거나 맡기고 싶어집니다. 마감과 피드백 장면을 점검하면 됩니다.",
    low: "과부하·비판 앞에서도 주체를 비교적 붙듭니다. 소진 여부는 면담에서 함께 보면 됩니다.",
  },
  io: {
    high: "사람·팀을 모아 일을 만들고 영향을 주고 싶은 방향이 분명합니다. 역할 지향입니다.",
    mid: "관계로 일을 만드는 역할에 어느 정도 끌립니다. 장면마다 다를 수 있습니다.",
    low: "조직을 움직이는 역할보다 깊이·실행·분석 쪽에 힘이 있을 수 있습니다. 그 방향도 학업 운영의 한 자리입니다.",
  },
};

export function interpretAxis(key, score) {
  return AXIS[key][band(score)];
}

export function comboNote(scores) {
  const ie = band(scores.ie);
  const wd = band(scores.wd);
  const sa = band(scores.sa);
  const io = band(scores.io);
  if (ie === "high" && wd === "high") {
    return "빨리 들어가다 과부하에서 자책하거나 AI로 넘기는 장면이 나올 수 있습니다. 면담에서 마감과 분량을 함께 보면 좋습니다.";
  }
  if (ie === "low" && wd === "high") {
    return "절차는 붙들지만 비판·분량에서 주체가 접힐 수 있습니다. 계획과 과부하를 한자리에 두고 보면 좋습니다.";
  }
  if (ie === "high" && sa === "high") {
    return "빨리 들어가면서도 구조를 잡는 자리입니다. 시작 전에 분량을 조금 나누면 분석의 힘이 실행을 더 받쳐 줍니다.";
  }
  if (sa === "high" && io === "high") {
    return "구조를 읽고 사람을 움직이는 쪽으로 학업·일이 배치될 수 있습니다.";
  }
  if (ie === "high" && sa === "low") {
    return "돌입은 빠른데 체계 분석은 낮습니다. 실행 뒤에 구조를 한 번 그려 보면 보완이 됩니다.";
  }
  return null;
}

const IE_PHRASE = {
  high: "직관과 마감으로 바로 들어가는 힘",
  mid: "돌입과 계획이 오가는 힘",
  low: "단계와 절차로 굴리는 힘",
};
const SA_PHRASE = {
  high: "규칙·데이터·도식으로 구조를 읽는 힘",
  mid: "체계화와 직관을 함께 쓰는 힘",
  low: "수치·시스템보다 다른 경로로 이해하는 힘",
};
const WD_LINE = {
  high: "위임·위축이 높아, 비판·분량·실패 앞에서 주체가 접히거나 답을 AI로 넘기고 싶어질 수 있습니다. 과부하 장면을 함께 보면 운영을 조율하기 좋습니다.",
  mid: "위임·위축은 보통입니다. 가끔 맡기고 싶어지나, 마감과 피드백만 살펴보면 됩니다.",
  low: "위임·위축은 낮아, 과부하 앞에서도 주체를 비교적 붙드는 편입니다.",
};
const IO_LINE = {
  high: "영향 지향이 높아, 사람·팀을 모아 일을 만들고 싶은 방향이 분명합니다.",
  mid: "영향 지향은 보통이라, 관계로 일을 만드는 역할에 장면마다 끌릴 수 있습니다.",
  low: "영향 지향은 낮아, 사람을 모아 조직을 움직이기보다 깊이·실행·분석 쪽에 힘이 가 있습니다.",
};

export function resultPreface(edition) {
  const when = edition === "adult" ? "지금 시기" : "지금 학기";
  return `${when}의 학업·업무 운영을 네 축으로 보여 드립니다. 맞다·틀리다가 없으며, 각 축을 따로 읽은 뒤 맨 아래 종합에서 한 장면으로 묶어 보시면 됩니다. 학기나 일이 바뀌면 다시 확인하실 수 있습니다.`;
}

export function summaryInterpret(scores, edition) {
  const ie = band(scores.ie);
  const sa = band(scores.sa);
  const wd = band(scores.wd);
  const io = band(scores.io);
  const fit = edition === "adult" ? "이번 일과 맞나" : "이번 학기와 맞나";
  const snap = SCALE_ORDER.map((k) => `${SCALES[k].name} ${bandLabel(scores[k])}`).join(" · ");
  const paragraphs = [
    `지금은 ${IE_PHRASE[ie]}이면서, ${SA_PHRASE[sa]}이 함께 있습니다.`,
    WD_LINE[wd],
    IO_LINE[io],
  ];
  const combo = comboNote(scores);
  if (combo) paragraphs.push(combo);
  paragraphs.push(`한 축씩 「${fit}」를 물으면 다음 운영이 분명해집니다.`);
  return { snap, paragraphs };
}

export function profileLines(scores) {
  return SCALE_ORDER.map((key) => ({
    key,
    name: SCALES[key].name,
    score: scores[key],
    band: bandLabel(scores[key]),
    text: interpretAxis(key, scores[key]),
  }));
}
