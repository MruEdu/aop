import { assignTopics } from "./categories.js";
import type { Notice, TopicId } from "./types.js";

/** 학술·정책·조사·데이터·교육 연구용역 후보 */
const INCLUDE = [
  "연구용역",
  "학술연구",
  "정책연구",
  "정책 연구",
  "실태조사",
  "실태 조사",
  "요구조사",
  "요구분석",
  "요구 분석",
  "조사연구",
  "조사 연구",
  "기초연구",
  "연구용역",
  "연구 용역",
  "용역연구",
  "통계",
  "설문",
  "텍스트마이닝",
  "데이터 분석",
  "데이터분석",
  "빅데이터",
  "교육과정",
  "교육 과정",
  "프로그램 개발",
  "성과평가",
  "영향평가",
  "기본계획 수립",
  "기본계획수립",
  "발전방안",
  "제도개선",
  "제도 개선",
  "타당성",
  "용역(",
  "연구(",
  "분석 연구",
  "분석연구",
  "DB구축",
  "DB 구축",
  "데이터베이스",
  "학술",
  "R&D",
  "RnD",
];

/** 건설·물품·단순노무·시설 등 제외 */
const EXCLUDE = [
  "공사",
  "건축공사",
  "토목",
  "시설공사",
  "리모델링 공사",
  "청소",
  "경비",
  "보안관제",
  "시설관리",
  "유지보수",
  "유지관리",
  "위탁운영",
  "폐기물",
  "급식",
  "택배",
  "운송",
  "임대차",
  "물품구매",
  "물품 구매",
  "장비 구매",
  "기자재",
  "소프트웨어 라이선스",
  "SW라이선스",
  "라이선스 구매",
  "전산장비",
  "사무용가구",
  "인쇄물 제작",
  "현수막",
  "행사운영",
  "행사 대행",
  "영상 촬영",
  "홈페이지 유지",
  "시스템 유지보수",
  "서버 운영",
  "단순노무",
  "파견",
  "용역근로",
];

export function scoreTitle(title: string): number {
  const t = title.replace(/\s+/g, " ").trim();
  if (!t) return 0;
  if (EXCLUDE.some((k) => t.includes(k))) return 0;

  let score = 0;
  for (const k of INCLUDE) {
    if (t.includes(k)) score += k.length >= 4 ? 3 : 2;
  }
  // 용역만 있고 연구·조사 신호가 약하면 낮게
  if (score === 0 && /용역/.test(t) && /(연구|조사|분석|평가|계획|방안)/.test(t)) {
    score = 2;
  }
  return score;
}

export function isRelevant(title: string, minScore = 2): boolean {
  return scoreTitle(title) >= minScore;
}

export function enrichNotice(
  partial: Omit<Notice, "topics" | "relevanceScore" | "snippet"> & {
    topics?: TopicId[];
    relevanceScore?: number;
    snippet?: string;
  }
): Notice | null {
  const score = partial.relevanceScore ?? scoreTitle(partial.title);
  if (score < 2) return null;
  const topics = partial.topics ?? assignTopics(partial.title);
  const snippet =
    partial.snippet ??
    [partial.organization, partial.budget != null ? formatBudget(partial.budget) : null]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 160);
  return { ...partial, topics, relevanceScore: score, snippet };
}

export function formatBudget(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(n % 100_000_000 === 0 ? 0 : 1)}억`;
  if (n >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만`;
  return `${n.toLocaleString("ko-KR")}원`;
}
