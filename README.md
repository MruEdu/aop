# 학업운영 양식검사 플랫폼

폴더: `aop-platform`  
목표 주소: `https://aop.vibestatics.com` (가비아에서 `aop` CNAME → `mruedu.github.io.` 연결됨)

Node 설치 없이 동작하는 정적 사이트입니다. 대학생용·중고등용·성인용 응시, 즉시 결과, 해석요강, 사용설명서, 전문가 자료, 관리자(코드 발급·CSV)가 들어 있습니다.

중고등용·성인용은 같은 네 축·같은 문항입니다. 화면 번호는 1–28이고, 채점·연구 저장은 내부 원번호를 씁니다. 해석요강에는 화면 번호만 적습니다. 학교 장면 또는 업무 장면의 말만 바꿉니다. 연구 파일은 `edition`(univ / school / adult)으로 나눕니다.

## 지금 바로 보기

`index.html`을 브라우저로 열면 됩니다. 로컬 파일에서 모듈이 막히면, 폴더에서 간단한 서버를 켜십시오.

- 공개 코드: `AOP-OPEN`
- 관리자 비밀번호: `config.js`의 `adminPassword` (기본 `change-me`)
- 이 단계의 응답은 **그 브라우저에만** 남습니다.

## 데이터가 서버에 남게 하려면

1. supabase.com에서 프로젝트 생성  
2. `supabase/schema.sql` 실행 (이미 실행했다면 `supabase/patch-edition.sql`만 한 번 더)  
3. Authentication에서 관리자 이메일 1개 생성  
4. `config.js`에 `supabaseUrl`, `supabaseAnon` 입력  

응시·결과조회는 로그인 없이 저장됩니다. 코드 발급·전체 CSV는 관리자 로그인 후입니다.

## GitHub Pages

이 폴더를 새 저장소(예: `aop`)에 올린 뒤 Pages 소스 = 루트, Custom domain = `aop.vibestatics.com`. `CNAME` 파일이 이미 있습니다.

## 논문

플랫폼을 먼저 돌린 뒤 방법 절에 실시 URL, 22문항 4요인, 주의·허위, 문항평균, 예비 척도임을 적습니다.
