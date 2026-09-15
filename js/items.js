export const CONSENT_VERSION = "2026-09-07-v2";
export const PUBLIC_CODE = "AOP-OPEN";
export const TEST_NAME = "학업·업무 방식검사";

export const LIKERT = [
  { value: 1, label: "전혀 그렇지 않다" },
  { value: 2, label: "그렇지 않다" },
  { value: 3, label: "대체로 그렇지 않다" },
  { value: 4, label: "대체로 그렇다" },
  { value: 5, label: "그렇다" },
  { value: 6, label: "매우 그렇다" },
];

export const GENDERS = ["여성", "남성", "기타 / 응답을 원치 않음"];
export const GRADES = ["1학년", "2학년", "3학년", "4학년(이상)", "대학원(석사 박사과정)", "기타"];
export const GRADES_SCHOOL = [
  "중학교 1학년",
  "중학교 2학년",
  "중학교 3학년",
  "고등학교 1학년",
  "고등학교 2학년",
  "고등학교 3학년",
  "기타",
];
export const MAJORS = [
  "인문 / 사회계열",
  "상경 / 경영계열",
  "사범 / 교육계열",
  "공학 / IT / 컴퓨터계열",
  "자연과학 / 의약보건계열",
  "예술 / 체육 / 디자인계열",
  "융합 / 자율전공 / 기타",
];
export const TRACKS_SCHOOL = [
  "국어·사회 쪽",
  "수학·과학 쪽",
  "영어·외국어 쪽",
  "예체능",
  "기술·컴퓨터",
  "아직 모름 / 여러 분야",
];
export const GRADES_ADULT = ["20대", "30대", "40대", "50대 이상", "기타"];
export const TRACKS_ADULT = [
  "사무·경영",
  "교육·공공",
  "기술·IT",
  "보건·복지",
  "예술·창작·서비스",
  "학생·구직 / 여러 분야",
];
export const REGIONS = [
  "서울",
  "경기 / 인천",
  "강원",
  "충청 / 대전 / 세종",
  "전라 / 광주",
  "경상 / 대구 / 부산 / 울산",
  "제주 / 기타",
];

// 배열 순서가 화면 1–28번. id는 연구·채점용 원번호.
export const ITEMS = [
  { id: 15, kind: "scale", text: "여러 이론이나 데이터 사이의 숨겨진 규칙과 논리적 구조를 찾아내는 것을 즐긴다." },
  { id: 17, kind: "scale", text: "시스템이나 알고리즘처럼 작동하는 메커니즘을 뜯어보고 분석하는 것을 좋아한다." },
  { id: 19, kind: "scale", text: "다이어그램, 도표, 순서도 형태로 지식을 체계화하여 정리할 때 가장 편안하다." },
  { id: 21, kind: "scale", text: "데이터와 수치적 근거를 바탕으로 현상을 논리적으로 증명하는 과정을 선호한다." },
  { id: 25, kind: "scale", text: "긴 설명을 읽는 것보다 일단 직접 부딪쳐 문제를 해결하고 실행하면서 배우는 편이다." },
  { id: 26, kind: "scale", text: "실수를 줄이기 위해 명확한 지침과 표준 절차를 꼼꼼하게 지키며 공부한다." },
  { id: 27, kind: "scale", text: "완성도가 다소 부족하더라도 일단 빠르게 시도하고 결과를 확인하는 것을 선호한다." },
  { id: 29, kind: "scale", text: "계획을 세우는 데 시간을 쓰기보다 직관적 영감에 따라 즉각적으로 과제에 돌입한다." },
  { id: 30, kind: "scale", text: "예상치 못한 돌발 상황을 피하기 위해 학습 단계별로 철저한 계획을 세운다." },
  { id: 33, kind: "scale", text: "기존의 방식이나 관례를 깨고 새로운 방식으로 문제를 풀어보는 것을 좋아한다." },
  { id: 35, kind: "scale", text: "과제 마감 직전의 압박감이 있어야 집중력이 폭발적으로 올라간다." },
  { id: 36, kind: "scale", text: "미리미리 분량을 나누어 일정에 맞게 꾸준히 해치워야 마음이 편하다." },
  { id: 37, kind: "attention", text: "이 문항은 설문 확인용입니다. '전혀 그렇지 않다(1점)'를 선택해 주세요." },
  { id: 43, kind: "scale", text: "AI가 요약해 준 내용만 대충 훑어보고 원래 자료나 책은 찾아보지 않는 편이다." },
  { id: 45, kind: "scale", text: "과제 제출 기한이 촉박하면 AI의 답변을 거의 수정 없이 그대로 복사해 사용하고 싶어진다." },
  { id: 49, kind: "scale", text: "AI가 즉각적으로 답을 주지 않으면 검색이나 독서로 답을 찾는 과정이 지루하게 느껴진다." },
  { id: 52, kind: "lie", text: "나는 일 년 365일 내내 단 1분도 쉬지 않고 공부한다." },
  { id: 54, kind: "scale", text: "다양한 사람들과 협력하고 팀을 이끌며 조직과 사회에 영향력을 발휘하고 싶다." },
  { id: 56, kind: "scale", text: "내 아이디어나 기획으로 많은 사람들의 인식이나 행동에 긍정적인 변화를 만들고 싶다." },
  { id: 58, kind: "scale", text: "사람들의 마음을 움직이고 소통하며 관계를 조율하는 역할에 큰 매력을 느낀다." },
  { id: 60, kind: "scale", text: "프로젝트를 총괄하고 사람들을 모아 목표를 향해 실행해 나가는 역할을 지향한다." },
  { id: 62, kind: "scale", text: "비판적인 피드백을 받으면 쉽게 위축되거나 학습 의욕이 크게 꺾인다." },
  { id: 65, kind: "attention", text: "이 문항은 성실도 확인용입니다. '매우 그렇다(6점)'를 선택해 주세요." },
  { id: 67, kind: "scale", text: "공부할 분량이 너무 많아지면 압도당해 어디서부터 손대야 할지 몰라 무기력해진다." },
  { id: 69, kind: "scale", text: "실수를 하거나 성적이 떨어지면 내 능력 자체에 대한 의심과 자책에 오래 빠진다." },
  { id: 76, kind: "lie", text: "나는 지금까지 살아오면서 단 한 번도 후회를 해본 적이 없다." },
  { id: 77, kind: "attention", text: "이 문항은 점검용입니다. '대체로 그렇지 않다(3점)'를 선택해 주세요." },
  { id: 78, kind: "attention", text: "이 문항은 확인용입니다. '대체로 그렇다(4점)'를 선택해 주세요." },
];

// 개인 패러다임(쿤) 연구 문항: 해석·채점은 기존 네 축만 사용하며, 이 문항들은 CSV/answers에만 저장됩니다.
export const RESEARCH_ITEMS = [
  { id: 201, kind: "research", text: "새로운 정보가 내가 믿어온 생각과 충돌하면, 우선은 내 생각을 지키는 쪽으로 해석하려 한다." },
  { id: 202, kind: "research", text: "잘 설명되지 않는 예외 사례가 반복되면, 내 관점을 바꿔야 할 신호라고 느낀다." },
  { id: 203, kind: "research", text: "어떤 문제를 볼 때, 내가 당연하다고 믿는 전제를 먼저 점검하려 한다." },
  { id: 204, kind: "research", text: "나와 관점이 다른 사람을 만나면, 같은 말을 해도 서로 다르게 이해하는 느낌이 든다." },
  { id: 205, kind: "research", text: "확신이 흔들릴 때, 기존 방식보다 완전히 다른 접근을 시도해 보고 싶어진다." },
  { id: 206, kind: "research", text: "작은 의문이 쌓이다가 어느 순간 생각이 크게 바뀐 경험이 있다." },
  { id: 207, kind: "research", text: "내가 속한 사람들(친구·팀·커뮤니티)의 분위기와 기준이 내 관점에 큰 영향을 준다." },
  { id: 208, kind: "research", text: "어떤 설명이 잘 맞아떨어지면, 다른 설명은 잘 보지 않게 된다." },
  { id: 209, kind: "research", text: "내가 세상을 보는 틀(패러다임)을 바꾸는 일은, 이전의 나를 부정하는 것처럼 느껴져 어렵다." },
  { id: 210, kind: "research", text: "모순이나 실패를 '예외'로 넘기기보다, 관점을 점검할 단서로 보려 한다." },
  { id: 211, kind: "research", text: "같은 경험도 내가 가진 관점에 따라 완전히 다르게 보일 수 있다고 느낀다." },
  { id: 212, kind: "research", text: "정답을 찾는 것보다, 지금의 관점이 무엇을 놓치게 하는지에 더 관심이 간다." },
  { id: 213, kind: "research", text: "새로운 관점을 받아들이면, 과거 경험을 다시 해석하게 된다." },
  { id: 214, kind: "research", text: "처음엔 낯설던 관점이 시간이 지나면 오히려 더 자연스러운 기준이 된다." },
  { id: 215, kind: "research", text: "내 생각이 바뀌는 과정은 대개 천천히보다는 어느 순간 급격하게 일어난다." },
  { id: 216, kind: "research", text: "내 관점이 잘 작동할 때는, 그 관점 자체를 의식하지 못한다." },
  { id: 217, kind: "research", text: "논쟁에서 상대를 설득하기보다, 서로의 전제가 무엇인지 확인하려 한다." },
  { id: 218, kind: "research", text: "내 관점이 바뀌면, 무엇이 중요한지(우선순위)도 함께 바뀐다." },
  { id: 219, kind: "research", text: "주변에서 인정받는 관점이면, 나도 더 쉽게 받아들인다." },
  { id: 220, kind: "research", text: "익숙한 관점을 버릴 때, 불안이나 혼란 같은 '위기'를 먼저 겪는 편이다." },
  { id: 221, kind: "research", text: "내 관점이 바뀌면, 실제 행동 습관도 함께 바뀐다." },
  { id: 222, kind: "research", text: "어떤 설명을 이해할 때, 그 설명이 전제하는 '세계관'까지 함께 받아들이는 느낌이 든다." },
  { id: 223, kind: "research", text: "나는 내 관점을 뒷받침하는 사례를 더 쉽게 떠올리고 모으는 편이다." },
  { id: 224, kind: "research", text: "나는 내 관점을 반박하는 사례를 일부러 찾아보려 한다." },
  { id: 225, kind: "research", text: "새로운 집단을 만나거나 환경이 바뀌면, 내 관점도 크게 바뀌는 편이다." },
];

export const CSV_ITEMS = [...ITEMS, ...RESEARCH_ITEMS];

export const ATTENTION_EXPECT = { 37: 1, 65: 6, 77: 3, 78: 4 };
export const LIE_IDS = [52, 76];

export const SCALES = {
  ie: { key: "ie", name: "즉흥 실행", items: [29, 35, 25, 27, 30, 36, 26], reverse: [30, 36, 26] },
  sa: { key: "sa", name: "체계 분석", items: [17, 15, 21, 19, 33], reverse: [] },
  wd: { key: "wd", name: "위임·위축", items: [62, 43, 45, 69, 67, 49], reverse: [] },
  io: { key: "io", name: "영향 지향", items: [54, 58, 60, 56], reverse: [] },
};

export const SCALE_ORDER = ["ie", "sa", "wd", "io"];

export function displayNo(id) {
  const i = ITEMS.findIndex((it) => it.id === id);
  if (i < 0) throw new Error("unknown item " + id);
  return i + 1;
}

export function displayList(ids) {
  return [...ids]
    .map(displayNo)
    .sort((a, b) => a - b)
    .join("·");
}

export function scoringManualLines() {
  const att = Object.entries(ATTENTION_EXPECT)
    .map(([id, expect]) => ({ no: displayNo(Number(id)), expect }))
    .sort((a, b) => a.no - b.no)
    .map((x) => `${x.no}번=${x.expect}`)
    .join(", ");
  const lie = LIE_IDS.map(displayNo)
    .sort((a, b) => a - b)
    .map((n) => `${n}번`)
    .join(" 또는 ");
  return {
    means: `각 척도는 화면 번호(1–28) 기준 문항평균(1–6점)입니다. 즉흥 실행만 계획 문항(${displayList(SCALES.ie.reverse)})을 역채점합니다. 고점이 즉흥·돌입 쪽입니다.`,
    keys: `즉흥 실행 ${displayList(SCALES.ie.items)}, 체계 분석 ${displayList(SCALES.sa.items)}, 위임·위축 ${displayList(SCALES.wd.items)}, 영향 지향 ${displayList(SCALES.io.items)}.`,
    bands: "대략 2.5 미만 낮음, 2.5–4.0 보통, 4.0 초과 높음입니다. 이 구간은 참고용이며, 규준은 후속입니다.",
    saNote: `${displayNo(33)}번(관례를 깨기)이 약간 벗어나 있으므로, 요인 이름은 체계 분석으로 둡니다.`,
    flags: `주의 문항(${att}) 또는 허위(${lie}이 4점 이상)에 걸리면 표시가 붙습니다.`,
  };
}

const SCHOOL_TEXT = {
  15: "여러 내용이나 자료 사이의 숨겨진 규칙과 논리적 구조를 찾아내는 것을 즐긴다.",
  17: "원리나 규칙처럼 돌아가는 구조를 뜯어보고 분석하는 것을 좋아한다.",
  19: "그림, 표, 순서도 형태로 배운 내용을 정리할 때 가장 편하다.",
  21: "숫자나 근거를 바탕으로 현상을 논리적으로 설명하는 과정을 선호한다.",
  25: "긴 설명을 읽는 것보다 일단 직접 부딪쳐 문제를 풀면서 배우는 편이다.",
  26: "실수를 줄이기 위해 명확한 안내와 순서를 꼼꼼하게 지키며 공부한다.",
  27: "완성도가 조금 부족하더라도 일단 빠르게 시도하고 결과를 확인하는 것을 선호한다.",
  29: "계획을 세우는 데 시간을 쓰기보다 떠오르는 대로 바로 숙제나 문제에 들어간다.",
  30: "예상치 못한 일을 피하기 위해 공부 단계별로 철저한 계획을 세운다.",
  33: "늘 하던 방식이나 관례를 깨고 새로운 방식으로 문제를 풀어보는 것을 좋아한다.",
  35: "숙제나 수행평가 마감 직전의 압박감이 있어야 집중력이 확 올라간다.",
  36: "미리미리 분량을 나누어 일정에 맞게 꾸준히 해야 마음이 편하다.",
  43: "AI가 요약해 준 내용만 대충 훑어보고 원래 자료나 책은 찾아보지 않는 편이다.",
  45: "숙제 제출이 촉박하면 AI의 답을 거의 고치지 않고 그대로 쓰고 싶어진다.",
  49: "AI가 바로 답을 주지 않으면 찾아보거나 책을 읽는 과정이 지루하게 느껴진다.",
  54: "여러 친구와 협력하고 모둠을 이끌며 학급이나 동아리에 영향을 주고 싶다.",
  56: "내 아이디어로 많은 친구들의 생각이나 행동에 좋은 변화를 만들고 싶다.",
  58: "사람들의 마음을 움직이고 소통하며 사이를 조율하는 역할에 큰 매력을 느낀다.",
  60: "모둠 활동이나 발표를 이끌고 사람들을 모아 목표를 향해 실행해 나가는 역할을 하고 싶다.",
  62: "지적이나 피드백을 받으면 쉽게 위축되거나 공부할 마음이 크게 꺾인다.",
  67: "공부할 양이 너무 많아지면 압도당해 어디서부터 손대야 할지 몰라 무기력해진다.",
  69: "실수를 하거나 점수가 떨어지면 내 능력 자체에 대한 의심과 자책에 오래 빠진다.",
};

const ADULT_TEXT = {
  15: "여러 자료나 데이터 사이의 숨겨진 규칙과 논리적 구조를 찾아내는 것을 즐긴다.",
  17: "시스템이나 절차처럼 돌아가는 일의 구조를 뜯어보고 분석하는 것을 좋아한다.",
  19: "다이어그램, 도표, 순서도 형태로 정보와 업무를 체계화하여 정리할 때 가장 편안하다.",
  21: "데이터와 수치적 근거를 바탕으로 현상을 논리적으로 설명하는 과정을 선호한다.",
  25: "긴 설명을 읽는 것보다 일단 직접 부딪쳐 문제를 해결하고 실행하면서 배우는 편이다.",
  26: "실수를 줄이기 위해 명확한 지침과 표준 절차를 꼼꼼하게 지키며 일한다.",
  27: "완성도가 다소 부족하더라도 일단 빠르게 시도하고 결과를 확인하는 것을 선호한다.",
  29: "계획을 세우는 데 시간을 쓰기보다 직관에 따라 즉각적으로 일에 돌입한다.",
  30: "예상치 못한 돌발 상황을 피하기 위해 업무 단계별로 철저한 계획을 세운다.",
  33: "기존의 방식이나 관례를 깨고 새로운 방식으로 문제를 풀어보는 것을 좋아한다.",
  35: "업무 마감 직전의 압박감이 있어야 집중력이 폭발적으로 올라간다.",
  36: "미리미리 분량을 나누어 일정에 맞게 꾸준히 처리해야 마음이 편하다.",
  43: "AI가 요약해 준 내용만 대충 훑어보고 원래 자료나 문서는 찾아보지 않는 편이다.",
  45: "제출·보고 기한이 촉박하면 AI의 답변을 거의 수정 없이 그대로 쓰고 싶어진다.",
  49: "AI가 즉각적으로 답을 주지 않으면 검색이나 자료로 답을 찾는 과정이 지루하게 느껴진다.",
  52: "나는 일 년 365일 내내 단 1분도 쉬지 않고 일한다.",
  54: "다양한 사람들과 협력하고 팀을 이끌며 조직과 사회에 영향력을 발휘하고 싶다.",
  56: "내 아이디어나 기획으로 많은 사람들의 인식이나 행동에 긍정적인 변화를 만들고 싶다.",
  58: "사람들의 마음을 움직이고 소통하며 관계를 조율하는 역할에 큰 매력을 느낀다.",
  60: "프로젝트를 총괄하고 사람들을 모아 목표를 향해 실행해 나가는 역할을 지향한다.",
  62: "비판적인 피드백을 받으면 쉽게 위축되거나 일하려는 마음이 크게 꺾인다.",
  67: "처리할 일이 너무 많아지면 압도당해 어디서부터 손대야 할지 몰라 무기력해진다.",
  69: "실수를 하거나 평가가 나빠지면 내 능력 자체에 대한 의심과 자책에 오래 빠진다.",
};

export function itemsFor(edition) {
  const map = edition === "school" ? SCHOOL_TEXT : edition === "adult" ? ADULT_TEXT : null;
  if (!map) return ITEMS;
  return ITEMS.map((it) => (map[it.id] ? { ...it, text: map[it.id] } : it));
}

export function testItemsFor(edition) {
  return [...itemsFor(edition), ...RESEARCH_ITEMS];
}

export function gradesFor(edition) {
  if (edition === "school") return GRADES_SCHOOL;
  if (edition === "adult") return GRADES_ADULT;
  return GRADES;
}

export function tracksFor(edition) {
  if (edition === "school") return TRACKS_SCHOOL;
  if (edition === "adult") return TRACKS_ADULT;
  return MAJORS;
}

export function gradeLabel(edition) {
  return edition === "adult" ? "연령대" : "학년";
}

export function trackLabel(edition) {
  if (edition === "school") return "관심 있는 공부 분야";
  if (edition === "adult") return "주로 하는 일";
  return "전공 계열";
}

export function editionLabel(edition) {
  if (edition === "school") return "중고등용";
  if (edition === "adult") return "성인용";
  return "대학생용";
}

export function nowHint(edition) {
  return edition === "adult"
    ? "요즘 일·학습에 가까운 쪽을 고르면 됩니다."
    : "지금 학기에 가까운 쪽을 고르면 됩니다.";
}
