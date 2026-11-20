import type { TopicId } from "./types.js";

export const TOPIC_META: Record<
  TopicId,
  { label: string; short: string; keywords: string[] }
> = {
  stats: {
    label: "통계·조사설계",
    short: "통계·조사",
    keywords: [
      "통계",
      "표본",
      "조사설계",
      "설문",
      "여론조사",
      "패널조사",
      "센서스",
      "지표 개발",
      "지표개발",
    ],
  },
  data: {
    label: "데이터·텍스트마이닝",
    short: "데이터·TM",
    keywords: [
      "텍스트마이닝",
      "텍스트 마이닝",
      "데이터 분석",
      "데이터분석",
      "빅데이터",
      "머신러닝",
      "인공지능",
      "자연어",
      "데이터베이스 구축",
      "DB 구축",
      "데이터 구축",
    ],
  },
  policy: {
    label: "정책·제도연구",
    short: "정책연구",
    keywords: [
      "정책연구",
      "정책 연구",
      "제도 개선",
      "제도개선",
      "법령",
      "중장기",
      "기본계획",
      "발전방안",
      "정책 방안",
      "정책방안",
    ],
  },
  needs: {
    label: "실태·요구분석",
    short: "실태·요구",
    keywords: [
      "실태조사",
      "실태 조사",
      "요구조사",
      "요구 분석",
      "요구분석",
      "인식조사",
      "만족도",
      "현황조사",
      "현황 조사",
      "기초조사",
    ],
  },
  education: {
    label: "교육·과정개발",
    short: "교육·과정",
    keywords: [
      "교육과정",
      "교육 과정",
      "커리큘럼",
      "교재 개발",
      "프로그램 개발",
      "연수 과정",
      "역량 교육",
      "교육콘텐츠",
      "교육 콘텐츠",
      "강의 개발",
    ],
  },
  evaluation: {
    label: "평가·성과분석",
    short: "평가·성과",
    keywords: [
      "성과평가",
      "성과 평가",
      "효과성",
      "영향평가",
      "사업평가",
      "컨설팅",
      "진단",
      "모니터링",
      "성과분석",
      "평가연구",
    ],
  },
  other: {
    label: "기타(검토)",
    short: "기타",
    keywords: [],
  },
};

export function assignTopics(title: string): TopicId[] {
  const hits: TopicId[] = [];
  for (const id of Object.keys(TOPIC_META) as TopicId[]) {
    if (id === "other") continue;
    if (TOPIC_META[id].keywords.some((k) => title.includes(k))) {
      hits.push(id);
    }
  }
  return hits.length ? hits.slice(0, 2) : ["other"];
}
