import { SCALE_ORDER, SCALES } from "./items.js?v=20260917h";
import { band, bandLabel } from "./scoring.js?v=20260917h";

function scene(edition) {
  if (edition === "adult") {
    return { homework: "일", study: "일", task: "일", studyGa: "일이", nature: "일의 성격" };
  }
  if (edition === "school") {
    return { homework: "숙제·수행평가", study: "공부", task: "숙제", studyGa: "공부가", nature: "숙제 성격" };
  }
  return { homework: "과제", study: "학업", task: "과제", studyGa: "학업이", nature: "과제 성격" };
}

function eul(word) {
  const ch = word.charCodeAt(word.length - 1) - 0xac00;
  if (ch < 0 || ch > 11171) return `${word}를`;
  return `${word}${ch % 28 ? "을" : "를"}`;
}

function axisCopy(edition) {
  const s = scene(edition);
  return {
    ie: {
      high: `시작이 빠르고 추진력이 좋은 편입니다. 직관과 마감 압박을 동력으로 ${s.homework}에 바로 들어가는 모습이 두드러집니다. 이런 리듬은 속도를 만들지만, 장면에 따라서는 앞부분에 힘이 몰리는 느낌이 함께 나타날 수 있어요.`,
      mid: `돌입과 계획이 섞여 있습니다. ${s.nature}에 따라 즉흥과 절차를 오갑니다.`,
      low: `단계별 계획과 표준 절차로 ${eul(s.study)} 안정적으로 굴리는 편입니다. 실수를 줄이고 꾸준히 가는 힘이 큽니다. 한편 장면에 따라서는 시작을 오래 붙잡는 모습이 나타날 수도 있습니다.`,
    },
    sa: {
      high: `잘 되는 규칙(패턴)을 찾아 표·도식·체크리스트로 정리하는 쪽이 강하게 나타납니다. ${s.study}에서 “내 방식”을 만들 힘이 큽니다. 부담이 큰 날에는 규칙이 더 빡빡해지면서 시작이 늦어지는 모습이 함께 나타날 수도 있어요.`,
      mid: `상황에 따라 규칙을 세우기도 하고 풀기도 하는 편입니다. 복잡한 ${s.task}에서는 “잘 될 때의 조건(시간·장소·도구·순서)”을 한두 개만 고정해도 내 패턴이 빨리 잡힙니다.`,
      low: `규칙을 딱딱하게 세우기보다 맥락을 보고 유연하게 조절하는 쪽으로 나타납니다. 한편 구조가 필요한 ${s.task}에서는 “고정할 1개”가 없을 때 더 흔들리는 느낌이 들 수도 있어요. (예: 시작 시간, 장소, 첫 10분 할 일)`,
    },
    wd: {
      high: "부담을 빨리 감지하는 레이더가 예민한 편입니다. 분량·마감·피드백이 겹치면 마음이 얼어붙거나 ‘그냥 맡겨버리고 싶다’는 생각이 쉽게 올라올 수 있어요. 성격의 문제가 아니라, 지금 부담이 크다는 신호로 읽을 수 있습니다.",
      mid: "대체로는 괜찮지만, 특정 장면에서는 마음이 얼어붙거나 맡기고 싶어질 수 있습니다. (마감·피드백·분량이 겹칠 때 특히 그렇습니다.)",
      low: "부담이 와도 비교적 버티며 운영을 이어가는 편입니다. 다만 오래 달릴 때는 피로가 쌓이는 느낌이 함께 올 수도 있어요.",
    },
    io: {
      high: "사람·팀을 모아 일을 만들고 영향을 주고 싶은 방향이 비교적 뚜렷하게 나타납니다. 역할 지향입니다.",
      mid: "상황에 따라 협력·조율·리드를 오갑니다. 장면마다 다를 수 있습니다.",
      low: `조직을 움직이는 역할보다 깊이·실행·분석 쪽에 힘이 있을 수 있습니다. 그 방향도 ${s.study} 운영의 한 자리입니다.`,
    },
  };
}

export function interpretAxis(key, score, edition) {
  return axisCopy(edition)[key][band(score)];
}

export function comboNote(scores, edition) {
  const ie = band(scores.ie);
  const wd = band(scores.wd);
  const sa = band(scores.sa);
  const io = band(scores.io);
  const s = scene(edition);
  if (ie === "high" && wd === "high") {
    return "빨리 들어가다가 부담이 커질 때, 스스로를 몰아붙이거나 ‘그냥 맡겨버리고 싶다’는 생각이 올라올 수 있습니다. 이런 흐름은 마감·분량이 겹칠수록 더 강해질 수 있어요.";
  }
  if (ie === "low" && wd === "high") {
    return "절차를 붙드는 힘은 있지만, 비판·분량에서 자신감이 꺾이는 느낌이 함께 올 수 있습니다. 계획이 무너지는 장면과 부담이 커지는 장면이 같은 자리에서 나타날 때가 있습니다.";
  }
  if (sa === "high" && io === "high") {
    return `구조를 읽고 사람을 움직이는 쪽으로 ${s.studyGa} 배치될 수 있습니다.`;
  }
  if (ie === "high" && sa === "low") {
    return "돌입은 빠른데, 구조화는 상대적으로 약하게 느껴질 수 있습니다. 그래서 ‘하고 나서 정리하는’ 리듬으로 나타날 때가 있습니다.";
  }
  return null;
}

const IE_PHRASE = {
  high: "직관과 마감으로 바로 들어가는 힘",
  mid: "돌입과 계획이 오가는 힘",
  low: "단계와 절차로 굴리는 힘",
};
const SA_PHRASE = {
  high: "잘 되는 규칙(패턴)을 찾아 구조로 만드는 힘",
  mid: "필요할 때 규칙을 세우고 풀 줄 아는 힘",
  low: "맥락을 보고 유연하게 조절하는 힘",
};
const WD_LINE = {
  high: "WD(부담 신호)가 높은 편입니다. 분량·마감·피드백이 겹치면 마음이 얼어붙거나 ‘그냥 맡겨버리고 싶다’는 생각이 쉽게 올라올 수 있어요. 이건 나약함이 아니라, 지금 부담이 크다는 신호로 이해할 수 있습니다.",
  mid: "WD(부담 신호)는 보통 범위에 있습니다. 장면에 따라 마음이 얼어붙거나 맡기고 싶어질 수 있습니다(특히 마감·피드백 장면).",
  low: "WD(부담 신호)는 낮은 편입니다. 부담이 와도 비교적 버티며 운영을 이어갈 가능성이 큽니다. 다만 높은 주체적 통제감으로 피로를 견디고 있는 상태일 수 있으니, 의도적인 ‘강제 멈춤/휴식 루틴’을 함께 두어야 장기 완주가 가능합니다.",
};
const IO_PHRASE = {
  high: "사람·팀 쪽(관계·영향)으로",
  mid: "상황에 따라 협력과 독립을 오가며",
  low: "과업의 깊이·몰입 쪽으로",
};
const IO_LINE = {
  high: "영향 지향이 높아, 사람·팀을 모아 일을 만들고 싶은 방향이 분명합니다.",
  mid: "영향 지향은 보통이라, 장면에 따라 협력·조율·리드를 오갈 수 있습니다.",
  low: "영향 지향은 낮아, 사람을 모아 이끄는 자리보다 내면 몰입·과업의 깊이·분석 쪽에 힘이 가 있습니다.",
};

export function resultPreface(edition) {
  const when = edition === "adult" ? "지금 시기" : "지금 학기";
  return `사람의 운영 방식은 상황에 따라 달라질 수 있어요—이 결과는 ‘평가’가 아니라 ${when}의 나를 이해하고 조정점을 찾는 지도입니다. 맞다·틀리다가 없으며, 저점도 결함이 아니라 다른 강점의 형태일 수 있습니다. 각 축을 따로 읽은 뒤 맨 아래 종합에서 한 장면으로 묶어 보시면 됩니다. 학기나 일이 바뀌면 다시 확인하실 수 있습니다.`;
}

export function summaryInterpret(scores, edition) {
  const ieB = band(scores.ie);
  const saB = band(scores.sa);
  const wdB = band(scores.wd);
  const ioB = band(scores.io);
  const snap = SCALE_ORDER.map((k) => `${SCALES[k].name} ${bandLabel(scores[k])}`).join(" · ");

  const isSchoolish = edition === "elementary" || edition === "school";
  const fit = edition === "adult" ? "이번 일" : (edition === "univ" ? "이번 과제·학기" : "이번 학기");

  const headline = (() => {
    const ieH = scores.ie >= 4;
    const saH = scores.sa >= 4;
    const ioH = scores.io >= 4;
    const ioL = scores.io < 2.5;
    const centralIE = scores.ie >= 2.5 && scores.ie < 4;
    const centralSA = scores.sa >= 2.5 && scores.sa < 4;
    const centralEngines = centralIE && centralSA;

    if (ieH && saH && ioH) return "기획과 실행을 함께 챙기며, 함께 이끄는 편";
    if (ieH && saH && ioL) return "해보면서 정리해 ‘내 방식’을 만드는 편";
    if (ieH && ioH) return "빠르게 시작하고, 사람과 함께 힘이 나는 편";
    if (ieH && ioL) return "혼자 몰입하면 속도가 잘 나는 편";
    if (saH && ioH) return "흐름을 정리하고, 역할을 나누며 이끄는 편";
    if (saH && ioL) return "깊게 파고들어 구조를 만드는 편";
    if (centralEngines && ioH) return "상황에 맞게 조절하며, 사람 사이를 연결하는 편";
    if (centralEngines && ioL) return "상황에 맞게 바꾸며, 자기 페이스로 가는 편";
    return "상황에 따라 방식과 페이스를 조절하는 편";
  })();

  const wdBadge = (() => {
    if (wdB === "low") return "부담 신호는 낮은 편(대체로 버티며 이어갈 수 있음)";
    if (wdB === "mid") return "부담 신호는 보통(장면에 따라 흔들릴 수 있음)";
    return "부담 신호가 높은 편(부담이 커질 때 막막해질 수 있음)";
  })();

  const opener = "이 결과는 성적표가 아니라, 요즘 내 흐름을 정리하기 위한 참고입니다. 좋고 나쁨을 가르기보다, 잘 되는 조건과 흔들리는 장면을 찾는 데 도움이 됩니다.";

  const howItShows = (() => {
    const s = scene(edition);
    const lines = [];
    if (scores.ie >= 4) lines.push(`필요가 보이면 생각을 오래 끌기보다 ${s.task}에 먼저 들어가 보며 방향을 잡는 편입니다.`);
    else if (scores.ie < 2.5) lines.push(`단계와 절차를 잡아두면 ${s.task}를 안정적으로 이어가는 편입니다.`);
    else lines.push(`${s.task}의 성격에 따라, 빠르게 들어갈 때도 있고 계획을 세울 때도 있습니다.`);

    if (scores.sa >= 4) lines.push(`정리·체계가 잡힐수록 마음이 편해지고, 내 방식을 만들어 가는 힘이 큽니다.`);
    else if (scores.sa < 2.5) lines.push(`규칙을 딱딱하게 세우기보다 맥락을 보고 유연하게 조절하는 쪽으로 나타날 수 있습니다.`);
    else lines.push(`필요할 때 규칙을 세우고 풀 줄 아는 편이라, 상황에 맞춘 조절이 가능합니다.`);

    if (scores.io >= 4) lines.push("혼자보다 함께할 때 에너지가 더 잘 붙고, 의견을 모으거나 방향을 제시하는 역할에서 보람을 느낄 수 있습니다.");
    else if (scores.io < 2.5) lines.push(`대인 조율보다 ${s.study}의 깊이·집중 쪽에서 힘이 나는 편일 수 있습니다.`);
    else lines.push("상황에 따라 협력·조율·독립을 오갈 수 있습니다.");

    if (wdB === "high") lines.push("분량·마감·피드백이 겹칠 때는 마음이 얼어붙거나 ‘그냥 맡기고 싶다’는 생각이 올라올 수 있는데, 성격이 아니라 부담이 커졌다는 신호로 볼 수 있습니다.");
    else if (wdB === "mid") lines.push("대체로는 괜찮지만, 마감·피드백 장면에서는 부담이 커질 수 있습니다.");
    else lines.push("부담이 와도 비교적 버티는 편이지만, 오래 달릴수록 피로가 쌓이지 않는지 한 번씩 점검해 보는 게 좋습니다.");

    return lines;
  })();

  const tips = (() => {
    const s = scene(edition);
    const ts = [];
    ts.push(`큰 계획을 한 번에 완성하기보다, ${s.task}를 “지금 바로 할 수 있는 크기”로 나눠 보면 도움이 될 때가 많습니다. (예: 목차 3줄, 문제 1개, 첫 문단)`);
    ts.push("중간에 한 번 점검할 시점을 잡아두면 부담이 줄어들 수 있습니다. (예: 언제까지 무엇을 어디까지 공유할지)");
    if (isSchoolish) {
      ts.push("주변에서는 결과를 ‘평가’로 쓰기보다, 아이가 다시 붙을 수 있는 조건(시간·장소·도구·순서)을 같이 정리해 주는 방식이 도움이 됩니다.");
    }
    return ts.slice(0, isSchoolish ? 3 : 2);
  })();

  const closing = `네 축을 한 줄씩 읽어본 뒤, "${fit}에서 무엇이 잘 맞고 무엇이 힘든지"를 한두 장면으로만 묶어 보면 다음 선택이 훨씬 쉬워질 수 있어요.`;

  const paragraphs = [
    opener,
    `요약: ${headline} · ${wdBadge}`,
    ...howItShows,
    "이렇게 해보면 좋아요:",
    ...tips.map((t) => `- ${t}`),
    closing,
  ];

  return { snap, paragraphs };
}

export function profileLines(scores, edition) {
  return SCALE_ORDER.map((key) => ({
    key,
    name: SCALES[key].name,
    score: scores[key],
    band: bandLabel(scores[key]),
    text: interpretAxis(key, scores[key], edition),
  }));
}
