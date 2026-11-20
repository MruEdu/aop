export type TopicId =
  | "stats"
  | "data"
  | "policy"
  | "needs"
  | "education"
  | "evaluation"
  | "other";

export interface Notice {
  id: string;
  source: "g2b";
  externalId: string;
  title: string;
  organization: string;
  demandOrg?: string;
  budget: number | null;
  postedAt: string | null;
  deadlineAt: string | null;
  url: string;
  method?: string;
  topics: TopicId[];
  relevanceScore: number;
  snippet: string;
}

export interface NoticesFile {
  generatedAt: string;
  source: string;
  lookbackDays: number;
  count: number;
  notices: Notice[];
}

export interface G2bServcItem {
  bidNtceNo?: string;
  bidNtceOrd?: string;
  bidNtceNm?: string;
  ntceInsttNm?: string;
  dminsttNm?: string;
  bidNtceDate?: string;
  bidNtceDt?: string;
  bidBeginDt?: string;
  bidClseDt?: string;
  bidClseDate?: string;
  opengDt?: string;
  presmptPrce?: string;
  asignBdgtAmt?: string;
  bidNtceDtlUrl?: string;
  bidNtceUrl?: string;
  bidMethdNm?: string;
  ntceSpecDocUrl1?: string;
  [key: string]: string | undefined;
}
