# 연구용역 공고 보드 (MVP)

나라장터(용역) Open API에서 **학술·정책·조사·데이터·교육** 관련 연구용역만 골라, 요약과 **원문 아웃링크**로 보여주는 보드입니다.

- 민간 입찰 중개 사이트(하이브레인넷 등)는 수집하지 않습니다.
- 원문 파일은 저장·재배포하지 않습니다.
- 다음 단계: 산학협력단 등 기관 게시판 어댑터 추가.

## 로컬 실행

```bash
cd tenders
cp .env.example .env   # DATA_GO_KR_SERVICE_KEY(Decoding) 입력
npm install
npm run collect        # 실제 수집 (키 필요)
# 또는
npm run collect:fixture
npm run serve          # http://localhost:5173
```

## GitHub Actions 자동 수집

1. 저장소 **Settings → Secrets and variables → Actions**
2. Secret 이름: `DATA_GO_KR_SERVICE_KEY` (공공데이터포털 Decoding 키)
3. Actions 탭에서 `Collect research tenders (G2B)` → Run workflow  
   또는 매일 자동(UTC 01:00 / 한국 10:00) 실행

수집 결과는 `public/data/notices.json`에 커밋됩니다.

## 주제 카테고리

통계·조사 / 데이터·TM / 정책연구 / 실태·요구 / 교육·과정 / 평가·성과 / 기타

## 참고

- API: 조달청_나라장터 입찰공고정보서비스 (용역)
- 조회기간 API 제한(~7일) → 수집기가 구간을 나눠 호출합니다.
