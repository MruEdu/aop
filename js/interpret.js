import { SCALE_ORDER, SCALES } from "./items.js";
import { band, bandLabel } from "./scoring.js";

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
    mid: "가끔 위축되거나 맡기고 싶어지나, 전면적 붕괴는 아닙니다. 마감과 피드백 장면을 점검하면 됩니다.",
    low: "과부하·비판 앞에서도 주체를 비교적 붙듭니다. 그렇다고 소진이 없다는 뜻은 아닙니다.",
  },
  io: {
    high: "사람·팀을 모아 일을 만들고 영향을 주고 싶은 방향이 분명합니다. 현재 리더십이 아니라 지향입니다.",
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
    return "즉흥 실행과 위임·위축이 함께 높습니다. 빨리 들어가다 과부하에서 자책하거나 AI에 넘기는 패턴을 면담에서 확인하십시오.";
  }
  if (ie === "low" && wd === "high") {
    return "계획은 붙들지만 위축이 높습니다. 절차는 있으나 비판·분량에서 주체가 접힐 수 있습니다.";
  }
  if (sa === "high" && io === "high") {
    return "체계 분석과 영향 지향이 함께 높습니다. 구조를 읽고 사람을 움직이는 쪽으로 학업이 배치될 수 있습니다.";
  }
  if (ie === "high" && sa === "low") {
    return "돌입은 빠른데 체계 분석은 낮습니다. 실행 후에 구조를 회고하는 습관이 보완점이 됩니다.";
  }
  return null;
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
