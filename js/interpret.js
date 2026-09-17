import { SCALE_ORDER, SCALES } from "./items.js?v=20260917u";
import { band, bandLabel } from "./scoring.js?v=20260917u";

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

function spec(key) {
  return SCALES[key]?.spectrum || { low: "", mid: "", high: "" };
}

function axisCopy(edition) {
  const s = scene(edition);
  const ieS = spec("ie");
  const saS = spec("sa");
  const ioS = spec("io");
  const wdS = spec("wd");
  return {
    ie: {
      high: `${ieS.high} 쪽이 비교적 잘 살아나는 편입니다. 필요가 보이면 생각을 오래 끌기보다 ${s.homework}에 먼저 들어가 보며 방향을 잡는 쪽이 자연스러울 수 있어요.`,
      mid: `${ieS.low}과(와) ${ieS.high}을(를) 상황에 맞게 오갈 수 있습니다. ${s.nature}에 따라 빠르게 들어갈 때도 있고, 절차를 세울 때도 있습니다.`,
      low: `${ieS.low} 쪽이 비교적 잘 살아나는 편입니다. 단계별 계획과 표준 절차로 ${eul(s.study)} 안정적으로 이어가는 힘이 큽니다.`,
    },
    sa: {
      high: `${saS.high} 쪽이 비교적 잘 살아나는 편입니다. 표·도식·체크리스트처럼 기준이 보일 때 ${s.study} 흐름이 안정되고, “내 방식”을 만들어 가는 힘이 큽니다.`,
      mid: `${saS.low}과(와) ${saS.high}을(를) 상황에 맞게 오갈 수 있습니다. 복잡한 ${s.task}에서는 “잘 될 때의 조건(시간·장소·도구·순서)”을 한두 개만 고정해도 도움이 됩니다.`,
      low: `${saS.low} 쪽이 비교적 잘 살아나는 편입니다. 규칙을 딱딱하게 세우기보다 맥락을 보고 조절하는 힘이 있어요. 다만 구조가 필요한 ${s.task}에서는 “기준 1개”를 잡아두면 도움이 될 때가 많습니다.`,
    },
    wd: {
      high: `${wdS.high} 쪽 반응이 먼저 올라올 수 있습니다. 분량·마감·피드백이 겹치면 마음의 여유가 줄어들어 막막해지거나 맡기고 싶어질 수 있어요.`,
      mid: `대체로는 괜찮지만, 장면에 따라 ${wdS.low}과(와) ${wdS.high}을(를) 오갈 수 있습니다. (특히 마감·피드백·분량이 겹칠 때)`,
      low: `${wdS.low} 쪽이 비교적 잘 유지되는 편입니다. 할 일이 많아도 주도적으로 정리하고 해쳐 나가며, 상황이 바뀌어도 자기 페이스를 다시 잡는 힘이 있을 수 있어요.`,
    },
    io: {
      high: `${ioS.high} 쪽이 비교적 잘 살아나는 편입니다. 사람들과 함께할 때 에너지가 붙고, 의견을 모으거나 방향을 제시하는 역할에서 보람을 느낄 수 있어요.`,
      mid: `${ioS.low}과(와) ${ioS.high}을(를) 상황에 따라 오갈 수 있습니다. 협력·조율·독립이 장면마다 달라질 수 있어요.`,
      low: `${ioS.low} 쪽이 비교적 잘 살아나는 편입니다. 대인 조율보다 ${s.study}의 깊이·집중·탐구 쪽에서 힘이 날 수 있어요.`,
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
  const ieS = spec("ie");
  const saS = spec("sa");
  const ioS = spec("io");
  const wdS = spec("wd");
  if (ie === "high" && wd === "high") {
    return `${ieS.high} 쪽으로 빠르게 들어가다가, ${wdS.high} 쪽 반응이 올라오는 장면이 있을 수 있습니다. 이런 흐름은 마감·분량이 겹칠수록 더 강해질 수 있어요.`;
  }
  if (ie === "low" && wd === "high") {
    return `${ieS.low} 쪽 장점이 있지만, 비판·분량에서 ${wdS.high} 쪽 반응이 올라오는 장면이 함께 있을 수 있습니다.`;
  }
  if (sa === "high" && io === "high") {
    return `${saS.high}과(와) ${ioS.high}이(가) 함께 나타나면, 구조를 잡고 사람을 모아 진행하는 역할로 ${s.studyGa} 배치될 수 있습니다.`;
  }
  if (ie === "high" && sa === "low") {
    return `${ieS.high} 쪽은 빠른데 ${saS.low} 쪽이라, “하고 나서 정리하는” 리듬으로 나타날 때가 있습니다.`;
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
  high: "요즘은 분량·마감·피드백이 겹치면 마음의 여유가 줄어들어, 막막해지거나 ‘그냥 맡기고 싶다’는 생각이 올라올 수 있습니다.",
  mid: "요즘은 대체로 괜찮지만, 장면에 따라 마음의 여유가 줄어들 수 있습니다(특히 마감·피드백 장면).",
  low: "요즘은 할 일이 많아도 주도적으로 정리하고 해쳐 나가는 편입니다. 다만 장기전에서는 회복 시간을 확보해 두면 흐름이 더 안정될 수 있어요.",
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

function userSummaryInterpret(scores, edition) {
  const ieB = band(scores.ie);
  const saB = band(scores.sa);
  const wdB = band(scores.wd);
  const snap = SCALE_ORDER.map((k) => `${SCALES[k].name} ${bandLabel(scores[k])}`).join(" · ");
  const isSchoolish = edition === "elementary" || edition === "school";
  const fit = edition === "adult" ? "이번 일" : (edition === "univ" ? "이번 과제·학기" : "이번 학기");
  const s = scene(edition);

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
    if (ieH && ioH) return "빠르게 시작하고, 함께할 때 힘이 나는 편";
    if (ieH && ioL) return "혼자 몰입하면 속도가 잘 나는 편";
    if (saH && ioH) return "흐름을 정리하고, 역할을 나누며 이끄는 편";
    if (saH && ioL) return "깊게 파고들어 구조를 만드는 편";
    if (centralEngines && ioH) return "상황에 맞게 조절하며, 사람 사이를 연결하는 편";
    if (centralEngines && ioL) return "상황에 맞게 바꾸며, 자기 페이스로 가는 편";
    return "상황에 따라 방식과 페이스를 조절하는 편";
  })();

  const wdBadge = (() => {
    if (wdB === "low") return "여유·자신감이 비교적 안정적인 편";
    if (wdB === "mid") return "여유·자신감은 보통(장면에 따라 달라질 수 있음)";
    return "여유·자신감이 줄어드는 장면이 있을 수 있음";
  })();

  const opener = "이 결과는 성적표가 아니라, 요즘의 흐름을 정리하기 위한 참고입니다. 좋고 나쁨을 가르기보다, 잘 되는 조건과 흔들리는 장면을 찾는 데 도움이 됩니다.";
  const how = [];
  if (scores.ie >= 4) how.push(`필요가 보이면 생각을 오래 끌기보다 ${s.task}에 먼저 들어가 보며 방향을 잡는 편입니다.`);
  else if (scores.ie < 2.5) how.push(`단계와 절차가 잡혀 있으면 ${s.task}를 안정적으로 이어가는 편입니다.`);
  else how.push(`${s.task}의 성격에 따라, 빠르게 들어갈 때도 있고 계획을 세울 때도 있습니다.`);

  if (scores.sa >= 4) how.push(`정리·체계가 잡힐수록 마음이 편해지고, 내 방식을 만들어 가는 힘이 큽니다.`);
  else if (scores.sa < 2.5) how.push(`규칙을 딱딱하게 세우기보다 맥락을 보고 유연하게 조절하는 쪽으로 나타날 수 있습니다.`);
  else how.push(`필요할 때 규칙을 세우고 풀 줄 아는 편이라, 상황에 맞춘 조절이 가능합니다.`);

  if (scores.io >= 4) how.push("혼자보다 함께할 때 에너지가 더 잘 붙고, 의견을 모으거나 방향을 제시하는 역할에서 보람을 느낄 수 있습니다.");
  else if (scores.io < 2.5) how.push(`대인 조율보다 ${s.study}의 깊이·집중 쪽에서 힘이 나는 편일 수 있습니다.`);
  else how.push("상황에 따라 협력·조율·독립을 오갈 수 있습니다.");

  if (wdB === "high") how.push("분량·마감·피드백이 겹칠 때는 마음의 여유가 줄어들어 막막해지거나 맡기고 싶어질 수 있습니다.");
  else if (wdB === "mid") how.push("대체로는 괜찮지만, 마감·피드백 장면에서는 부담이 커질 수 있습니다.");
  else how.push("할 일이 많아도 주도적으로 정리하고 해쳐 나가는 편입니다.");

  const tips = [];
  tips.push(`큰 계획을 한 번에 완성하기보다, ${s.task}를 “지금 바로 할 수 있는 크기”로 나눠 보면 도움이 될 때가 많습니다. (예: 목차 3줄, 문제 1개, 첫 문단)`);
  tips.push("중간에 한 번 점검할 시점을 잡아두면 부담이 줄어들 수 있습니다. (예: 언제까지 무엇을 어디까지 공유할지)");
  if (isSchoolish) {
    tips.push("주변에서는 결과를 ‘평가’로 쓰기보다, 다시 붙을 수 있는 조건(시간·장소·도구·순서)을 같이 정리해 주는 방식이 도움이 됩니다.");
  }
  const closing = `네 축을 한 줄씩 읽어본 뒤, "${fit}에서 무엇이 잘 맞고 무엇이 힘든지"를 한두 장면으로만 묶어 보면 다음 선택이 훨씬 쉬워질 수 있어요.`;

  const paragraphs = [
    opener,
    `요약: ${headline} · ${wdBadge}`,
    ...how,
    "이렇게 해보면 좋아요:",
    ...tips.slice(0, isSchoolish ? 3 : 2).map((t) => `- ${t}`),
    closing,
  ];
  return { snap, paragraphs };
}

function expertDetailedReport(scores, edition, ctx = {}) {
  const s = scene(edition);
  const snap = `IE ${scores.ie.toFixed(2)} / SA ${scores.sa.toFixed(2)} / WD ${scores.wd.toFixed(2)} / IO ${scores.io.toFixed(2)}`;
  const reliability = ctx.reliability || null;
  const relLine = reliability
    ? `신뢰도: reliable=${String(reliability.reliable)}, attention_ok=${String(reliability.attentionOk)}, lie_ok=${String(reliability.lieOk)}`
    : "신뢰도: (표시 정보 없음)";

  const sections = [
    {
      heading: "1) 기본 지표",
      body: [
        "본 결과는 학업·과제(성인 판본은 일/업무) 장면에서 나타나는 운영 방식의 경향을 요약합니다.",
        snap,
        relLine,
      ],
    },
    {
      heading: "2) 과제 인지 및 정보 처리 양식",
      body: [
        scores.sa >= 4
          ? `표·도식·체크리스트처럼 구조가 보일 때 통제감이 올라가고, ${s.task}를 체계적으로 정리해 가는 강점이 두드러질 수 있습니다.`
          : scores.sa < 2.5
            ? `규칙을 고정하기보다 맥락을 보며 유연하게 조절하는 경향이 나타날 수 있습니다. 구조가 필요한 ${s.task}에서는 “기준 1개”를 잡아두면 도움이 될 때가 많습니다.`
            : `필요할 때 규칙을 세우고 풀 줄 아는 편이라, ${s.task}의 성격에 맞춰 조절이 가능합니다.`,
        scores.ie >= 4
          ? `착수는 빠른 편이며, 해보면서 방향을 잡는 리듬이 강점으로 나타날 수 있습니다.`
          : scores.ie < 2.5
            ? `착수는 신중한 편이며, 단계와 절차가 잡힐수록 안정적으로 이어가는 경향이 나타날 수 있습니다.`
            : `상황에 따라 빠른 착수와 계획을 오갈 수 있습니다.`,
      ],
    },
    {
      heading: "3) 심리적 부하 및 과업 통제성(WD)",
      body: [
        band(scores.wd) === "high"
          ? "분량·마감·피드백이 겹치면 마음의 여유가 줄어들어 막막함이나 자신감 저하가 먼저 올라올 수 있습니다."
          : band(scores.wd) === "low"
            ? "할 일이 많아도 주도적으로 정리하고 해쳐 나가는 편입니다. 장기전에서는 회복 시간을 확보해 두면 흐름이 더 안정될 수 있습니다."
            : "대체로는 괜찮지만, 특정 장면(마감·피드백 등)에서는 여유가 줄어들 수 있습니다.",
      ],
    },
    {
      heading: "4) 대인관계 및 역할 지향(IO)",
      body: [
        scores.io >= 4
          ? "사람과 함께할 때 에너지가 붙고, 의견을 모으거나 방향을 제시하는 역할에서 보람을 느낄 수 있습니다."
          : scores.io < 2.5
            ? `대인 조율보다 ${s.study}의 깊이·집중 쪽에서 힘이 나는 편일 수 있습니다. 이 방향도 충분히 기능적인 운영 방식입니다.`
            : "상황에 따라 협력·조율·독립을 오갈 수 있습니다.",
      ],
    },
    {
      heading: "5) 종합적 역동과 장면 시사점",
      body: [
        "이 결과는 ‘좋고 나쁨’이 아니라, 지금 시기 어떤 조건에서 강점이 살아나고 어떤 장면에서 부담이 커지는지에 대한 힌트로 활용하는 것이 적절합니다.",
        "특히 팀 과제/프로젝트에서는 역할과 기준을 명확히 나누면 강점이 더 안정적으로 이어질 수 있습니다.",
      ],
    },
    {
      heading: "6) 운영 제언(부드러운 제안)",
      body: [
        `착수 전 “전체 완성”을 요구하기보다, ${s.task}의 뼈대를 먼저 잡고(초안/목차/요점) 진행 과정에서 정리 수준을 올리는 방식이 도움이 될 수 있습니다.`,
        "중간 점검 시점을 잡아두면, 부담이 커지는 장면을 줄이고 결과의 품질도 안정될 수 있습니다.",
      ],
    },
  ];

  return { snap, sections };
}

export function summaryInterpret(scores, edition, opts = {}) {
  const audience = opts.audience || "user";
  if (audience === "expert") return expertDetailedReport(scores, edition, opts);
  return userSummaryInterpret(scores, edition);
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
