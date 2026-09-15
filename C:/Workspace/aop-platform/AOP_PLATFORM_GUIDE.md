# AOP v2.0 플랫폼 운영 가이드

- **플랫폼 개요**: 학업 방식 검사 v2.0 (AOP: Academic Operation Profile)
- **개발**: 바이브스타틱스 현용찬(교육학박사)

---

## 1) 문항/판본 구조

- **전 판본 동일 구조**: 총 **33문항(1~33)**, 표시 순서 고정(셔플 없음)
- **판본(edition)**: `elementary`(초등), `school`(중고등), `univ`(대학생), `adult`(성인)
- **채점 포함**: 1~28번
- **채점 제외(연구용 저장만)**: 29~33번(쿤 패러다임 5문항)
- **리커트(6점)**:
  - `elementary`: 1 전혀 아니다 … 6 정말 그렇다
  - 그 외: 1 전혀 그렇지 않다 … 6 매우 그렇다

---

## 2) 채점 알고리즘(4대 축)

### 2.1 축 정의(문항 번호)

- **IE(즉흥 실행)**: 1~7
- **SA(체계 분석)**: 8~14
- **WD(위임·위축)**: 15~21
- **IO(영향 지향)**: 22~28

### 2.2 점수 산출 공식

각 축 점수는 해당 문항들의 **문항평균(1~6)** 입니다.

\[
\text{score(axis)} = \frac{1}{n}\sum_{i \in \text{axis\_items}} a_i
\]

- \(a_i\): i번 문항 응답(1~6)
- \(n\): 축별 문항 수(현재 7)
- 산출 후 소수 둘째 자리로 반올림(예: 4.285 → 4.29)

### 2.3 채점 제외 규칙

- `SCORING_EXCLUDED_IDS = [29,30,31,32,33]`
- 29~33번은 **점수/차트/해석에 반영하지 않고**, 원점수로만 저장합니다.

---

## 3) 신뢰도/검증 알고리즘(v2.0)

v2.0은 33문항(q1~q33) 구조로 전환되면서, 과거(1판) 방식의 주의·허위 문항 번호(37/65/77/78, 52/76)를 그대로 쓰면 **영원히 통과**하는 문제가 생깁니다.  
현재 v2.0은 **33문항 체계 안에서 실제로 동작하는 검증**으로 재매핑되어 있습니다.

### 3.1 일관성 검증(Consistency → attention_ok)

- `CONSISTENCY_PAIRS`로 지정된 문항쌍의 점수 차이가 너무 크면 비일관으로 봅니다.
- 판정:
  - \(|a-b| \ge 2\) 이면 `attention_ok = false`
  - 모든 쌍이 통과하면 `attention_ok = true`

현재 설정(예시):

- (2, 4) / (8, 11) / (15, 16) / (22, 25)
- `CONSISTENCY_DIFF_THRESHOLD = 2`

### 3.2 극단반응 검증(Extreme responding → lie_ok)

- 1~28번 응답에서 **1 또는 6이 지나치게 많이 반복**되면 비정상 응답으로 봅니다.
- 판정:
  - 1점 개수 ≥ 24 **또는** 6점 개수 ≥ 24 이면 `lie_ok = false`
  - 그렇지 않으면 `lie_ok = true`

현재 설정:

- `EXTREME_RESPONSE_COUNT_THRESHOLD = 24`

### 3.3 최종 신뢰도(reliable)

- `reliable = attention_ok && lie_ok`

---

## 4) DB(Supabase) & CSV 스키마

### 4.1 Supabase 테이블 구조(핵심)

#### `access_codes`
- `id` (uuid, PK)
- `code` (text, unique) — 예: `AOP-OPEN`, `EXP-XXXXXX`
- `kind` (text) — `public` / `expert`
- `label` (text) — 기관/전문가 메모
- `active` (boolean)
- `created_at` (timestamptz)

#### `sessions`
- `id` (uuid, PK)
- `access_code_id` (uuid, FK → access_codes.id)
- `result_no` (text, unique) — 결과번호 `AOP-XXXX`
- `display_name` (text)
- `gender` (text)
- `grade` (text)
- `major` (text)
- `region` (text)
- `edition` (text) — `univ` / `school` / `adult` / `elementary`
- `answers` (jsonb) — q1~q33 원점수 저장
- `scores` (jsonb) — ie/sa/wd/io 축 점수
- `attention_ok` (boolean)
- `lie_ok` (boolean)
- `reliable` (boolean)
- `consent_version` (text)
- `created_at` (timestamptz)

### 4.2 CSV 내보내기(관리자)

관리자 화면에서 CSV를 내려받을 때 헤더는 아래 순서로 생성됩니다.

- `result_no`, `created_at`, `edition`, `access_code`, `code_kind`
- (상담용 CSV만) `display_name`
- `gender`, `grade`, `major`, `region`
- `attention_ok`, `lie_ok`, `reliable`
- `ie`, `sa`, `wd`, `io`
- `q1` … `q33`

---

## 5) 전문가/기관 추천인 코드 체계(EXP-)

플랫폼은 “전문가/기관 그룹”을 **코드 기반(access_codes)**으로 분리합니다.

- **공개 응시**: `AOP-OPEN` (kind=`public`)
- **전문가/기관**: `EXP-XXXXXX` (kind=`expert`)

### 운영 방식

- 수검자는 입장 코드로 진입합니다.
- 세션은 `sessions.access_code_id`로 **어떤 코드(그룹)로 들어왔는지**가 고정 연결됩니다.
- 관리자는 전문가 코드를 발급하고(라벨에 기관명/상담자명 기록), 필요 시 비활성화할 수 있습니다.
- CSV 내려받기 시에도 `access_code` / `code_kind`가 함께 포함되어, 기관별/전문가별 데이터 묶음이 가능합니다.

---

## 6) 유지보수(Maintenance) 모드

스키마·문항 인덱스 튜닝 기간에는 일반 수검자 진입을 차단할 수 있습니다.

- **기본 차단**: 점검 안내 카드 표시 후 `/take`, `/result`, `/` 등 일반 접근 차단
- **우회 허용**:
  - `?mode=dev` (내부 테스트)
  - `#/admin` (관리자)

운영 중에는 `MAINTENANCE_MODE` 토글로 제어합니다.

