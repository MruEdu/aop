import { isRelevant, scoreTitle } from "./filter.js";
import { assignTopics } from "./categories.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(isRelevant("지역 청년 고용 실태조사 연구용역"), "실태조사 통과");
assert(isRelevant("교육과정 개발 용역"), "교육과정 통과");
assert(!isRelevant("본관 청소 용역"), "청소 제외");
assert(!isRelevant("도로 포장 공사"), "공사 제외");
assert(scoreTitle("텍스트마이닝 기반 정책연구 용역") >= 4, "복합 키워드 점수");
assert(assignTopics("실태조사 및 교육과정 개발").includes("needs"), "주제 needs");
assert(assignTopics("실태조사 및 교육과정 개발").includes("education"), "주제 education");

console.log("filter.test.ts OK");
