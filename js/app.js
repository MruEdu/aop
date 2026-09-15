import { DOCS } from "./docs.js?v=20260915m";
import { profileLines, resultPreface, summaryInterpret } from "./interpret.js?v=20260915m";
import {
  GENDERS,
  PUBLIC_CODE,
  REGIONS,
  SCALE_ORDER,
  SCALES,
  TEST_NAME,
  editionLabel,
  gradeLabel,
  gradesFor,
  itemsFor,
  likertFor,
  nowHint,
  trackLabel,
  tracksFor,
} from "./items.js?v=20260915m";
import { store, usingCloud } from "./storage.js?v=20260915m";

const TOTAL_ITEMS = itemsFor("univ").length;
const MAINTENANCE_MODE = false;

function devMode() {
  return new URLSearchParams(location.search).get("mode") === "dev";
}

function expertGateMode() {
  // Cloud(=Supabase 연결)에서는 연구자/전문가 계정 로그인으로 자료를 엽니다.
  // 로컬 모드에서는 기존 EXP- 코드로만 열 수 있습니다.
  return usingCloud() ? "auth" : "code";
}

const expertGate = {
  code: "",
  email: "",
  password: "",
  applyName: "",
  applyOrg: "",
  applyRole: "",
  applyEducation: "",
  applyMajor: "",
  applyExpertise: "",
  applyPhone: "",
  applyNote: "",
  err: "",
  next: "",
  busy: false,
};

function expertApplyFormHtml() {
  return `
      <div class="card" style="margin:16px 0">
        <h2 style="margin-top:0">전문가 회원가입 신청</h2>
        <p class="progress">기본정보를 작성한 뒤 <b>신청 메일 보내기</b>를 누르세요. 승인 후 계정을 발급합니다. (아이디=이메일)</p>
        <div class="grid two">
          <div class="row"><label for="apname">성명</label><input id="apname" value="${esc(expertGate.applyName)}" /></div>
          <div class="row"><label for="aporg">소속(기관/학교/조직)</label><input id="aporg" value="${esc(expertGate.applyOrg)}" /></div>
          <div class="row"><label for="aprole">역할(연구/상담/수업 등)</label><input id="aprole" value="${esc(expertGate.applyRole)}" /></div>
          <div class="row"><label for="apphone">연락처</label><input id="apphone" value="${esc(expertGate.applyPhone)}" placeholder="010-0000-0000" /></div>
          <div class="row"><label for="apemail">이메일(아이디)</label><input id="apemail" value="${esc(expertGate.email)}" placeholder="you@example.com" /></div>
          <div class="row"><label for="apedu">학력(최종학력/과정)</label><input id="apedu" value="${esc(expertGate.applyEducation)}" placeholder="예: 교육학 박사 / 석사 과정" /></div>
          <div class="row"><label for="apmajor">전공</label><input id="apmajor" value="${esc(expertGate.applyMajor)}" /></div>
          <div class="row"><label for="apexp">전문 분야/경험</label><input id="apexp" value="${esc(expertGate.applyExpertise)}" placeholder="예: 학습상담, 교수설계, 데이터 분석" /></div>
        </div>
        <div class="row"><label for="apnote">추가 메모(선택)</label><input id="apnote" value="${esc(expertGate.applyNote)}" /></div>
        ${expertGate.err ? `<p class="err">${esc(expertGate.err)}</p>` : ""}
        <div class="actions">
          <button class="btn" data-act="expert-apply" ${expertGate.busy ? "disabled" : ""}>신청 메일 보내기</button>
        </div>
      </div>
  `;
}

function expertGateView(mode) {
  const contact = `
    <p class="progress">신청 후 승인 방식으로 운영합니다. 필요하시면 바이브스타틱스로 연락해 주십시오.</p>
    <p style="margin:0 0 8px"><b>현용찬</b> 010-3105-6999</p>
    <p class="progress">신청 메일을 보낸 뒤, 전화로 한 번 더 연락해 주세요.</p>
  `;

  const body = mode === "auth"
    ? `
      <p class="lede">해석요강·전문가 학습자료·개발 배경은 공동 연구(또는 전문가) 계정으로 로그인한 분에게만 공유합니다.</p>
      ${contact}
      ${expertApplyFormHtml()}

      <p class="progress">이미 계정을 발급받으셨다면 아래로 로그인해 주세요.</p>
      <div class="row">
        <label for="expem">이메일</label>
        <input id="expem" value="${esc(expertGate.email)}" placeholder="you@example.com" />
      </div>
      <div class="row">
        <label for="exppw">비밀번호</label>
        <input id="exppw" type="password" value="${esc(expertGate.password)}" />
      </div>
      ${expertGate.err ? `<p class="err">${esc(expertGate.err)}</p>` : ""}
      <div class="actions">
        <button class="btn" data-act="expert-login" ${expertGate.busy ? "disabled" : ""}>${expertGate.busy ? "확인 중…" : "로그인"}</button>
        <button class="btn ghost" data-act="expert-logout">로그아웃</button>
        <a class="btn ghost" href="#/">홈으로</a>
      </div>
    `
    : `
      <p class="lede">해석요강·전문가 학습자료·개발 배경은 공동 연구(또는 전문가) EXP- 코드 보유자에게만 공유합니다.</p>
      ${contact}
      ${expertApplyFormHtml()}
      <p class="progress">이미 EXP- 코드를 받으셨다면 아래에 입력해 주세요.</p>
      <div class="row">
        <label for="expcode">EXP- 코드</label>
        <input id="expcode" value="${esc(expertGate.code)}" placeholder="EXP-XXXXXX" />
      </div>
      ${expertGate.err ? `<p class="err">${esc(expertGate.err)}</p>` : ""}
      <div class="actions">
        <button class="btn" data-act="expert-unlock" ${expertGate.busy ? "disabled" : ""}>${expertGate.busy ? "확인 중…" : "코드 확인"}</button>
        <a class="btn ghost" href="#/">홈으로</a>
      </div>
    `;

  return `<main>
    <h1>전문가 자료</h1>
    <div class="card">${body}</div>
  </main>`;
}

function maintenanceView() {
  return `<main>
    <h1>학업 방식 검사 v2.0 (AOP) 시스템 고도화 작업 안내</h1>
    <div class="card">
      <p class="lede">현재 스키마·문항 인덱스 튜닝 중입니다. 잠시 후 다시 시도해 주세요.</p>
      <p class="progress" style="margin-top:12px">개발: 바이브스타틱스 현용찬(교육학박사)</p>
    </div>
  </main>`;
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mailtoHref(to, subject, body) {
  const q = new URLSearchParams();
  if (subject) q.set("subject", subject);
  if (body) q.set("body", body);
  const qs = q.toString();
  return `mailto:${to}${qs ? `?${qs}` : ""}`;
}

function route() {
  const h = location.hash.replace(/^#/, "") || "/";
  return h.startsWith("/") ? h : "/" + h;
}

function navLink(href, label, r) {
  const key = href.slice(1) || "/";
  const on = r === key || (key !== "/" && r.startsWith(key));
  return `<a href="${href}" class="${on ? "active" : ""}">${label}</a>`;
}

function layout(inner, opts = {}) {
  const r = route();
  const cloudNote = usingCloud()
    ? ""
    : " 현재는 이 브라우저에만 저장됩니다. 연구 보관은 Supabase 연결 후입니다.";
  const subtitle = r.startsWith("/take/adult") ? "성인: 업무 방식 검사" : "초등용 · 중고등용 · 대학생용 · 성인용";
  const expertOk = Boolean(opts.expertOk);
  return `
    <div class="shell">
      <header class="top">
        <a class="brand" href="#/" style="text-decoration:none;color:inherit">
          ${TEST_NAME}
          <small>${subtitle}</small>
        </a>
        <nav class="nav">
          ${navLink("#/take", "검사 하기", r)}
          ${navLink("#/lookup", "결과조회", r)}
          ${navLink("#/manual", "사용설명서", r)}
          ${expertOk ? navLink("#/guide", "해석요강", r) : ""}
          ${navLink("#/expert", "전문가", r)}
          ${navLink("#/admin", "관리자", r)}
        </nav>
      </header>
      ${inner}
      <footer class="footer">
        <p>© 2026 바이브스타틱스(VibeStatics) · 개발 현용찬(교육학 박사). All rights reserved.</p>
        <p>개발: 바이브스타틱스 현용찬(교육학박사)</p>
        <p>초등용·중고등용·대학생용·성인용 ${TEST_NAME}. 문항·채점·해석의 무단 복제·배포를 금합니다.${cloudNote}</p>
      </footer>
    </div>`;
}

function options(list, selected) {
  return `<option value="">선택</option>` + list.map((o) =>
    `<option value="${esc(o)}" ${o === selected ? "selected" : ""}>${esc(o)}</option>`,
  ).join("");
}

const SCHOOL_LEVELS = ["중학교", "고등학교"];
const SCHOOL_YEARS = ["1학년", "2학년", "3학년"];
const HIGH_SCHOOL_TYPES = ["전문계고", "일반/인문계고", "특목·자사고"];
const UNIV_LEVELS = ["학부", "대학원"];
const UNIV_YEARS = ["1학년", "2학년", "3학년", "4학년"];
const GRAD_LEVELS = ["석사 과정", "박사 과정"];
const ADULT_ROLE_TYPES = ["일반", "전문직"];

function bucketRegion(province) {
  const p = String(province || "").trim();
  if (!p) return "";
  if (p === "서울") return "서울";
  if (p === "경기" || p === "인천") return "경기 / 인천";
  if (p === "강원") return "강원";
  if (p === "대전" || p === "충남" || p === "충북" || p === "세종") return "충청 / 대전 / 세종";
  if (p === "광주" || p === "전남" || p === "전북") return "전라 / 광주";
  if (p === "대구" || p === "부산" || p === "경북" || p === "경남" || p === "울산") return "경상 / 대구 / 부산 / 울산";
  if (p === "제주") return "제주 / 기타";
  // 방어: 값이 예상 밖이면 원값 보존
  return p;
}

function buildDisplayGrade(ed, t) {
  if (ed === "school") {
    if (t.schoolLevel === "중학교" && t.schoolYear) return `중학교 ${t.schoolYear}`;
    if (t.schoolLevel === "고등학교" && t.schoolYear && t.highSchoolType) {
      return `고등학교 ${t.schoolYear}(${t.highSchoolType})`;
    }
    return "";
  }
  if (ed === "univ") {
    if (t.univLevel === "학부" && t.univYear) return `대학(학부) ${t.univYear}`;
    if (t.univLevel === "대학원" && t.gradLevel) return `대학원 ${t.gradLevel}`;
    return "";
  }
  return String(t.grade || "");
}

const take = {
  step: 0,
  edition: "",
  code: "",
  codeKind: "",
  displayName: "",
  gender: "",
  grade: "",
  // v2.0 파일럿용 세분화 인구통계(분석용 전용 컬럼으로 저장)
  regionProvince: "",
  schoolLevel: "",
  schoolYear: "",
  highSchoolType: "",
  univLevel: "",
  univYear: "",
  gradLevel: "",
  adultRoleType: "일반",
  major: "",
  region: "",
  answers: {},
  err: "",
  busy: false,
};

function steps(n) {
  const names = ["안내", "코드", "정보", "문항"];
  return `<div class="steps">${names.map((name, i) => `<span class="${i === n ? "on" : ""}">${i + 1} ${name}</span>`).join("")}</div>`;
}

function developerNote() {
  return `<div class="card developer">
      <p class="dev-kicker">개발자 인사</p>
      <p>공부든 일이든, 이렇게 되면 좋습니다.</p>
      <ul class="dev-values">
        <li><b>효과성</b> 이번에 하려던 것에 실제로 닿았는가</li>
        <li><b>효율성</b> 시간·힘을 너무 쓰지 않고 해냈는가</li>
        <li><b>매력성</b> 그 과정이 끌려서, 다음에 또 하고 싶은가</li>
      </ul>
      <p class="progress">본 검사는 대학생용 파일럿을 바탕으로 신뢰도·타당도를 확보한 뒤, 초등(4학년 이상)부터 성인까지 확장한 검사입니다.</p>
      <p>무엇을 할지 분명할 때(<b>명확성</b>) 이 셋이 살아납니다. 분명한 내용을 효율적으로 익히는 일이 학습이며, 그것이 학습공학입니다.</p>
      <p>대학에서 수년간 강의해 온 현장과 학습상담 경험을 바탕으로, 지금 학업·업무 방식을 확인하고 이 방향으로 운영을 돕기 위해 이 검사를 개발하였습니다.</p>
      <p class="dev-src">개발 배경: 생성형 AI 보급과 비정형 과제가 늘어난 대학 환경에서 72문항 예비풀로 시작해 응답을 수집하고, 불성실·왜곡 응답을 정제한 뒤 탐색적 요인분석으로 4요인(IE/SA/WD/IO) 구조를 확인해 초기 타당화했습니다. 이를 바탕으로 v2.0은 33문항 고정 구조로 정리해 초등(4학년 이상)~성인 장면의 말로 확장했으며, 전국 규준은 후속 데이터로 보강합니다.</p>
      <p class="dev-src">교육공학에서는 타일러의 목표 명확성, 가네의 학습 조건, 라이겔루스의 효과성·효율성·매력성을 이렇게 읽어 왔습니다. 네 축은 그 가치를 지금 학업·업무 운영으로 옮긴 프로파일입니다.</p>
      <div class="dev-who">
        <strong>현용찬</strong>
        <span>교육학 박사 · 제주대·남서울대 출강 · 바이브스타틱스 대표</span>
        <span>저서: 기적의학습멘탈수업(2025), AI주니어 길들이기</span>
        <span>논문: 텍스트마이닝을 이용한 청소년의 학습상담 호소문제 분석(2022), 텍스트 마이닝 방법을 활용한 국내 학습 상담 연구 동향 분석(2022), U&I 학습성격 진단 도구의 통계적 타당성 검증 및 심리측정학적 적절성 검토(2026) 등 10여편</span>
      </div>
    </div>`;
}

function editionCards(longCopy) {
  return `
    <div class="grid three edition-cards">
      <div class="card">
        <h2 style="margin-top:0">초등용</h2>
        <p>${longCopy ? `초등학생 눈높이 문항으로 되어 있습니다. 초등학교 4학년 이상을 권합니다. 닉네임과 간단한 배경 정보 뒤 총 ${TOTAL_ITEMS}문항에 답합니다.` : "초등학생 문항."}</p>
        <a class="btn" href="#/take/elementary">${longCopy ? "초등용 검사 시작" : "초등용 시작"}</a>
      </div>
      <div class="card">
        <h2 style="margin-top:0">중고등용</h2>
        <p>${longCopy ? `숙제·수행평가·모둠 등 학교 장면의 말로 되어 있습니다. 닉네임과 간단한 배경 정보 뒤 총 ${TOTAL_ITEMS}문항에 답합니다.` : "숙제·수행평가·모둠 장면."}</p>
        <a class="btn" href="#/take/school">${longCopy ? "중고등용 검사 시작" : "중고등용 시작"}</a>
      </div>
      <div class="card">
        <h2 style="margin-top:0">대학생용</h2>
        <p>${longCopy ? `대학 과제·팀·AI 장면의 말로 되어 있습니다. 닉네임과 간단한 배경 정보 뒤 총 ${TOTAL_ITEMS}문항에 답합니다.` : "대학 과제·팀·AI 장면."}</p>
        <a class="btn" href="#/take/univ">${longCopy ? "대학생용 검사 시작" : "대학생용 시작"}</a>
      </div>
    </div>
    <div class="grid three edition-cards" style="margin-top:14px">
      <div class="card">
        <h2 style="margin-top:0">성인용</h2>
        <p>${longCopy ? `업무·보고·팀 등 일의 장면의 말로 되어 있습니다. 닉네임과 간단한 배경 정보 뒤 총 ${TOTAL_ITEMS}문항에 답합니다.` : "업무·보고·팀 장면."}</p>
        <a class="btn" href="#/take/adult">${longCopy ? "성인용 검사 시작" : "성인용 시작"}</a>
      </div>
    </div>`;
}

function home() {
  return `
    <main class="hero">
      <div class="credit">초등용 · 중고등용 · 대학생용 · 성인용 · 개발 현용찬</div>
      <h1>여러분의 학업·업무 방식을<br>확인해 보세요</h1>
      <p class="lede">
        공부든 일이든, 하려던 것에 닿고(효과성), 힘과 시간을 아끼며(효율성), 다음에 또 하고 싶어지는 것(매력성). 무엇을 할지 분명할 때 이 셋이 살아납니다.
        이 검사는 지금 방식을 확인하고, 그 방향으로 운영을 돕습니다.
      </p>
      <div class="banner note">
        지금은 누구나 바로 해 보실 수 있습니다. 이후 실시 방법이 바뀌면 다시 공지합니다.
        맞다·틀리다가 없습니다. 지금 시기에 가까운 쪽을 고르면 됩니다.
        결과는 즉흥 실행, 체계 분석, 위임·위축, 영향 지향 네 축으로 바로 보여 드립니다.
        약 10–15분, 공개 코드는 ${PUBLIC_CODE} 입니다. 문의할 때는 결과번호를 알려 주십시오.
      </div>
      ${editionCards(true)}
      <div class="card">
        <h2 style="margin-top:0">전문가</h2>
        <p>상담·수업용 EXP- 코드로 들어온 결과만 그 전문가 몫입니다. 실시 전에 자료를 읽으십시오.</p>
        <a class="btn ghost" href="#/expert">전문가 자료</a>
      </div>
    </main>`;
}

function takeEdition() {
  const r = route();
  if (r.startsWith("/take/elementary")) return "elementary";
  if (r.startsWith("/take/school")) return "school";
  if (r.startsWith("/take/adult")) return "adult";
  if (r.startsWith("/take/univ")) return "univ";
  return "";
}

let takeRouteEd = "";
function syncTakeEdition(ed) {
  if (ed === takeRouteEd) return;
  takeRouteEd = ed;
  take.edition = ed;
  take.step = 0;
  take.answers = {};
  take.err = "";
  take.displayName = "";
  take.gender = "";
  take.grade = "";
  take.regionProvince = "";
  take.schoolLevel = "";
  take.schoolYear = "";
  take.highSchoolType = "";
  take.univLevel = "";
  take.univYear = "";
  take.gradLevel = "";
  take.adultRoleType = "일반";
  take.major = "";
  take.region = "";
  take.busy = false;
}

function takeView() {
  const t = take;
  const ed = takeEdition();
  syncTakeEdition(ed);
  if (!ed) {
    return `<main><h1>검사 하기</h1>
      <p class="lede">초등학생·중고등학생·대학생·성인, 지금 해당하는 쪽을 고르면 됩니다.</p>
      ${editionCards(true)}
      ${developerNote()}
    </main>`;
  }
  const who = editionLabel(ed);
  const itemList = itemsFor(ed);
  const LIKERT = likertFor(ed);
  const grades = gradesFor(ed);
  const tracks = tracksFor(ed);
  const majorName = trackLabel(ed);
  const gLabel = gradeLabel(ed);
  const hint = nowHint(ed);
  const when = ed === "adult" ? "시기가 바뀌면" : ed === "elementary" ? "학년이 바뀌면" : "학기가 바뀌면";
  if (t.step === 0) {
    return `<main><h1>${who} 검사 시작</h1>${steps(0)}<div class="card">
      <p>교육학 박사 현용찬이 개발한 <strong>${who} ${TEST_NAME}</strong>입니다. 지금 방식을 확인하고, 더 효율적인 운영에 도움을 드리고자 합니다.</p>
      <p class="progress">이 검사는 대학생용 파일럿 데이터를 바탕으로 문항·축 구조를 정리하고, 표현을 판본별 장면(초등–성인)으로 확장한 버전입니다. 규준(전국 단위)과 일부 심화 검증은 후속 데이터로 계속 보강합니다.</p>
      <p>공부든 일이든, 하려던 것에 닿고(효과성), 힘과 시간을 아끼며(효율성), 다음에 또 하고 싶어지는 것(매력성)이 좋습니다. 무엇을 할지 분명할 때 이 셋이 살아납니다. 결과는 네 축 프로파일로 바로 보여 드리며, ${when} 다시 확인하실 수 있습니다.</p>
      <p>학번·전화·이메일은 받지 않습니다. 문의할 때는 결과번호가 필요합니다. 응답은 연구·상담을 위한 자료로 보관됩니다. 계속하면 이 안내에 동의하는 것입니다.</p>
      <div class="actions"><button class="btn" data-act="consent">동의하고 계속</button></div>
    </div></main>`;
  }
  if (t.step === 1) {
    return `<main><h1>${who} 검사 시작</h1>${steps(1)}<div class="card">
      <div class="row"><label for="code">입장 코드</label>
      <input id="code" value="${esc(t.code)}" placeholder="AOP-OPEN 또는 EXP-…" /></div>
      <p class="progress">혼자 하실 때는 ${PUBLIC_CODE} 를 넣으면 됩니다. 상담·수업에서는 전문가가 준 코드를 넣습니다.</p>
      ${t.err ? `<p class="err">${esc(t.err)}</p>` : ""}
      <div class="actions"><button class="btn" data-act="check-code">코드 확인</button></div>
    </div></main>`;
  }
  if (t.step === 2) {
    const nameLabel = t.codeKind === "expert" ? "표시 이름 (실명·이니셜 가능)" : "닉네임";
    return `<main><h1>${who} 검사 시작</h1>${steps(2)}<div class="card">
      <p class="progress">결과 화면과 문의 확인에 씁니다. 공개 검사에서는 닉네임이면 됩니다.</p>
      <div class="row"><label for="name">${nameLabel}</label>
      <input id="name" value="${esc(t.displayName)}" /></div>
      <div class="grid two">
        <div class="row"><label for="gender">성별</label><select id="gender">${options(GENDERS, t.gender)}</select></div>
        ${
          ed === "school"
            ? `<div class="row"><label for="schoolLevel">학교</label><select id="schoolLevel">${options(SCHOOL_LEVELS, t.schoolLevel)}</select></div>
               ${
                 t.schoolLevel
                   ? `<div class="row"><label for="schoolYear">학년</label><select id="schoolYear">${options(SCHOOL_YEARS, t.schoolYear)}</select></div>`
                   : ""
               }
               ${
                 t.schoolLevel === "고등학교"
                   ? `<div class="row"><label for="highSchoolType">구분</label><select id="highSchoolType">${options(HIGH_SCHOOL_TYPES, t.highSchoolType)}</select></div>`
                   : ""
               }`
            : ed === "univ"
              ? `<div class="row"><label for="univLevel">학력</label><select id="univLevel">${options(UNIV_LEVELS, t.univLevel)}</select></div>
                 ${
                   t.univLevel === "학부"
                     ? `<div class="row"><label for="univYear">학년</label><select id="univYear">${options(UNIV_YEARS, t.univYear)}</select></div>`
                     : t.univLevel === "대학원"
                       ? `<div class="row"><label for="gradLevel">과정</label><select id="gradLevel">${options(GRAD_LEVELS, t.gradLevel)}</select></div>`
                       : ""
                 }`
              : `<div class="row"><label for="grade">${esc(gLabel)}</label><select id="grade">${options(grades, t.grade)}</select></div>`
        }
        ${
          ed === "adult"
            ? `<div class="row"><label for="adultRoleType">직업 구분</label><select id="adultRoleType">${options(ADULT_ROLE_TYPES, t.adultRoleType)}</select></div>`
            : ""
        }
        <div class="row"><label for="major">${esc(majorName)}</label><select id="major">${options(tracks, t.major)}</select></div>
        <div class="row"><label for="region">주 생활 지역(시·도)</label><select id="region">${options(REGIONS, t.regionProvince)}</select></div>
      </div>
      <div class="actions"><button class="btn" data-act="to-items">문항으로</button></div>
    </div></main>`;
  }
  const filled = itemList.filter((i) => t.answers[i.id] != null).length;
  const pct = Math.round((filled / itemList.length) * 100);
  const items = itemList.map((item) => `
    <div class="item">
      <div class="q"><span class="num">${item.id}.</span>${esc(item.text)}</div>
      <div class="likert">
        ${LIKERT.map((opt) => `
          <button type="button" data-act="ans" data-id="${item.id}" data-v="${opt.value}" class="${t.answers[item.id] === opt.value ? "on" : ""}">
            <b>${opt.value}</b>${esc(opt.label)}
          </button>`).join("")}
      </div>
    </div>`).join("");
  return `<main><h1>${who} 검사 시작</h1>${steps(3)}
    <p class="progress">${filled} / ${itemList.length} · ${hint}</p>
    <div class="meter" aria-hidden="true"><i style="width:${pct}%"></i></div>
    <p class="legend">${ed === "elementary" ? "1 전혀 아니다 · 6 정말 그렇다" : "1 전혀 그렇지 않다 · 6 매우 그렇다"}</p>
    ${items}
    ${t.err ? `<p class="err">${esc(t.err)}</p>` : ""}
    <div class="actions"><button class="btn" data-act="submit" ${t.busy ? "disabled" : ""}>${t.busy ? "저장 중…" : "제출하고 결과 보기"}</button></div>
  </main>`;
}

function resultHtml(session, opts = {}) {
  const expertOk = Boolean(opts.expertOk);
  const lines = profileLines(session.scores, session.edition);
  const preface = resultPreface(session.edition);
  const summary = summaryInterpret(session.scores, session.edition);
  const pct = (n) => `${Math.max(0, Math.min(100, ((n - 1) / 5) * 100))}%`;
  const bars = SCALE_ORDER.map((k) => `
    <div class="bar-row">
      <div>${SCALES[k].name}</div>
      <div class="bar-mid">
        <div class="track"><div class="fill" style="width:${pct(session.scores[k])}"></div></div>
        <div class="spectrum">
          <span class="low">${esc(SCALES[k].spectrum?.low || "")}</span>
          <span class="mid">${esc(SCALES[k].spectrum?.mid || "")}</span>
          <span class="high">${esc(SCALES[k].spectrum?.high || "")}</span>
        </div>
      </div>
      <div class="score">${session.scores[k].toFixed(2)}</div>
    </div>`).join("");
  const cards = lines.map((line) => `
    <div class="card"><h2 style="margin-top:0">${esc(line.name)} · ${esc(line.band)} (${line.score.toFixed(2)})</h2>
    <p>${esc(line.text)}</p></div>`).join("");
  const warn = session.reliable
    ? ""
    : `<div class="banner warn">주의·허위 문항에 걸린 결과입니다. 아래 해석은 그대로 보여 드리며, 한 번 더 실시하시면 상담·연구에 쓰기 좋습니다.</div>`;
  const summaryBody = summary.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("");
  return `
    ${warn}
    <p>${esc(session.displayName)} · ${esc(editionLabel(session.edition))} · ${esc(session.grade)} · ${esc(session.major)}</p>
    <div class="card">
      <h2 style="margin-top:0">이 결과의 읽기</h2>
      <p>${esc(preface)}</p>
    </div>
    <div class="card"><div class="bars">${bars}</div>
      <p class="progress" style="margin-top:12px">문항평균(1–6점). 막대는 비교용이며, 네 축을 따로 읽습니다.</p>
    </div>
    ${cards}
    <div class="card">
      <h2 style="margin-top:0">종합 해석</h2>
      <p class="progress">${esc(summary.snap)}</p>
      ${summaryBody}
    </div>
    <div class="card">
      <p>문의·재열람용 결과번호</p>
      <div class="result-no">${esc(session.resultNo)}</div>
      <p class="progress">이 번호를 알려 주시면 기록을 찾을 수 있습니다. 이메일은 보내지 않습니다.</p>
      <div class="actions">
        <button class="btn ghost" data-act="copy-no" data-no="${esc(session.resultNo)}">번호 복사</button>
        <button class="btn ghost" data-act="print">인쇄</button>
        ${expertOk ? `<a class="btn ghost" href="#/guide">해석요강 보기</a>` : `<a class="btn ghost" href="#/expert">전문가 자료(신청/로그인)</a>`}
      </div>
      <p class="progress" style="margin-top:12px">개발: 바이브스타틱스 현용찬(교육학박사)</p>
    </div>`;
}

function docView(page) {
  return `<main class="doc"><h1>${esc(page.title)}</h1><p class="lede">${esc(page.subtitle)}</p>
    ${page.sections.map((s) => `<section><h2>${esc(s.heading)}</h2>${s.body.map((p) => `<p>${esc(p)}</p>`).join("")}</section>`).join("")}
  </main>`;
}

const admin = {
  authed: false,
  err: "",
  codes: [],
  rows: [],
  q: "",
  label: "",
};

async function render() {
  const root = document.getElementById("root");
  const r = route();
  let expertOk = devMode();
  if (!expertOk) {
    const mode = expertGateMode();
    if (mode === "auth") expertOk = Boolean(await store.cloudSession());
    else expertOk = sessionStorage.getItem("aop.expert") === "1";
  }
  if (MAINTENANCE_MODE && !devMode() && !r.startsWith("/admin")) {
    root.innerHTML = layout(maintenanceView(), { expertOk });
    return;
  }
  if (r.startsWith("/guide") || r.startsWith("/expert")) {
    if (!expertOk) {
      const mode = expertGateMode();
      expertGate.next = r;
      root.innerHTML = layout(expertGateView(mode), { expertOk });
      return;
    }
  }
  let inner = "";
  if (r === "/" || r === "") inner = home();
  else if (r.startsWith("/take")) inner = takeView();
  else if (r.startsWith("/result/")) {
    const no = decodeURIComponent(r.slice(8));
    inner = `<main><h1>결과</h1><p>불러오는 중…</p></main>`;
    root.innerHTML = layout(inner, { expertOk });
    try {
      const s = await store.getByResultNo(no);
      inner = s
        ? `<main><h1>결과</h1>${resultHtml(s, { expertOk })}</main>`
        : `<main><h1>결과</h1><p>결과번호에 해당하는 기록이 없습니다.</p></main>`;
    } catch (e) {
      inner = `<main><h1>결과</h1><p class="err">${esc(e.message || e)}</p></main>`;
    }
    root.innerHTML = layout(inner, { expertOk });
    return;
  } else if (r.startsWith("/lookup")) {
    inner = `<main><h1>결과 조회</h1><div class="card">
      <div class="row"><label for="no">결과번호</label><input id="no" placeholder="AOP-XXXX" /></div>
      <button class="btn" data-act="lookup">보기</button>
    </div></main>`;
  } else if (r.startsWith("/admin")) {
    inner = await adminView();
  } else {
    const page = DOCS.find((d) => r === "/" + d.id);
    inner = page ? docView(page) : home();
  }
  root.innerHTML = layout(inner, { expertOk });
}

async function adminView() {
  const cloud = usingCloud();
  if (!admin.authed && !cloud && sessionStorage.getItem("aop.admin") === "1") admin.authed = true;
  if (!admin.authed) {
    return `<main><h1>관리자</h1><form class="card" data-act="login">
      ${cloud ? `<div class="row"><label for="em">이메일</label><input id="em" /></div>` : ""}
      <div class="row"><label for="pw">비밀번호</label><input id="pw" type="password" /></div>
      ${admin.err ? `<p class="err">${esc(admin.err)}</p>` : ""}
      <button class="btn" type="submit">들어가기</button>
    </form></main>`;
  }
  try {
    admin.codes = await store.listCodes();
    admin.rows = await store.listSessions();
  } catch (e) {
    admin.err = e.message || String(e);
  }
  const k = admin.q.trim().toUpperCase();
  const filtered = !k
    ? admin.rows
    : admin.rows.filter(
        (row) =>
          row.resultNo.includes(k) ||
          row.displayName.toUpperCase().includes(k) ||
          row.accessCode.toUpperCase().includes(k),
      );
  const codeRows = admin.codes.map((c) => `<tr>
    <td>${esc(c.code)}</td><td>${c.kind === "public" ? "공개" : "전문가"}</td>
    <td>${esc(c.label)}</td><td>${c.active ? "활성" : "정지"}</td>
    <td>${c.kind === "expert" ? `<button class="btn ghost small" data-act="toggle-code" data-id="${c.id}" data-on="${c.active ? "1" : "0"}">${c.active ? "정지" : "재활성"}</button>` : ""}</td>
  </tr>`).join("");
  const sessRows = filtered.map((s) => `<tr>
    <td><a href="#/result/${esc(s.resultNo)}">${esc(s.resultNo)}</a></td>
    <td>${esc(s.displayName)}</td><td>${esc(editionLabel(s.edition))}</td><td>${esc(s.accessCode)}</td>
    <td><span class="${s.reliable ? "pill" : "pill bad"}">${s.reliable ? "양호" : "신뢰 불가"}</span></td>
    <td>${esc(String(s.createdAt).replace("T", " ").slice(0, 16))}</td>
  </tr>`).join("");
  return `<main><h1>관리자</h1>
    ${admin.err ? `<p class="err">${esc(admin.err)}</p>` : ""}
    <div class="card"><h2 style="margin-top:0">입장 코드</h2>
      <div class="actions">
        <input id="elabel" value="${esc(admin.label)}" placeholder="전문가 이름·기관" style="max-width:240px" />
        <button class="btn" data-act="issue">전문가 코드 발급</button>
      </div>
      <table class="table"><thead><tr><th>코드</th><th>종류</th><th>메모</th><th>상태</th><th></th></tr></thead>
      <tbody>${codeRows}</tbody></table>
    </div>
    <div class="card"><h2 style="margin-top:0">세션</h2>
      <div class="actions">
        <input id="q" value="${esc(admin.q)}" placeholder="결과번호·이름·코드" style="max-width:240px" />
        <button class="btn ghost" data-act="csv-r">연구 CSV (이름 제외)</button>
        <button class="btn ghost" data-act="csv-c">상담 CSV (이름 포함)</button>
      </div>
      <table class="table"><thead><tr><th>결과번호</th><th>이름</th><th>판</th><th>코드</th><th>신뢰</th><th>시각</th></tr></thead>
      <tbody>${sessRows}</tbody></table>
    </div>
  </main>`;
}

let bound = false;
function ensureBound() {
  if (bound) return;
  bound = true;
  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", onInput);
  document.addEventListener("change", onChange);
}

function onInput(e) {
  const el = e.target;
  if (el.id === "code") take.code = el.value;
  if (el.id === "name") take.displayName = el.value;
  if (el.id === "expcode") expertGate.code = el.value;
  if (el.id === "expem") expertGate.email = el.value;
  if (el.id === "exppw") expertGate.password = el.value;
  if (el.id === "apname") expertGate.applyName = el.value;
  if (el.id === "aporg") expertGate.applyOrg = el.value;
  if (el.id === "aprole") expertGate.applyRole = el.value;
  if (el.id === "apphone") expertGate.applyPhone = el.value;
  if (el.id === "apemail") expertGate.email = el.value;
  if (el.id === "apedu") expertGate.applyEducation = el.value;
  if (el.id === "apmajor") expertGate.applyMajor = el.value;
  if (el.id === "apexp") expertGate.applyExpertise = el.value;
  if (el.id === "apnote") expertGate.applyNote = el.value;
  if (el.id === "elabel") admin.label = el.value;
  if (el.id === "q") {
    admin.q = el.value;
  }
}

function onChange(e) {
  const el = e.target;
  if (el.id === "gender") take.gender = el.value;
  if (el.id === "grade") take.grade = el.value;
  if (el.id === "schoolLevel") {
    take.schoolLevel = el.value;
    take.schoolYear = "";
    take.highSchoolType = "";
  }
  if (el.id === "schoolYear") take.schoolYear = el.value;
  if (el.id === "highSchoolType") take.highSchoolType = el.value;
  if (el.id === "univLevel") {
    take.univLevel = el.value;
    take.univYear = "";
    take.gradLevel = "";
  }
  if (el.id === "univYear") take.univYear = el.value;
  if (el.id === "gradLevel") take.gradLevel = el.value;
  if (el.id === "adultRoleType") take.adultRoleType = el.value;
  if (el.id === "major") take.major = el.value;
  if (el.id === "region") {
    take.regionProvince = el.value;
    take.region = bucketRegion(take.regionProvince);
  }
}

async function onClick(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const act = btn.dataset.act;
  if (act === "expert-apply") {
    const name = (document.getElementById("apname")?.value || expertGate.applyName || "").trim();
    const org = (document.getElementById("aporg")?.value || expertGate.applyOrg || "").trim();
    const role = (document.getElementById("aprole")?.value || expertGate.applyRole || "").trim();
    const phone = (document.getElementById("apphone")?.value || expertGate.applyPhone || "").trim();
    const email = (document.getElementById("apemail")?.value || expertGate.email || "").trim();
    const edu = (document.getElementById("apedu")?.value || expertGate.applyEducation || "").trim();
    const major = (document.getElementById("apmajor")?.value || expertGate.applyMajor || "").trim();
    const exp = (document.getElementById("apexp")?.value || expertGate.applyExpertise || "").trim();
    const note = (document.getElementById("apnote")?.value || expertGate.applyNote || "").trim();

    expertGate.applyName = name;
    expertGate.applyOrg = org;
    expertGate.applyRole = role;
    expertGate.applyPhone = phone;
    expertGate.email = email;
    expertGate.applyEducation = edu;
    expertGate.applyMajor = major;
    expertGate.applyExpertise = exp;
    expertGate.applyNote = note;

    if (!email) {
      expertGate.err = "이메일(아이디)을 입력해 주세요.";
      await render();
      return;
    }
    if (!name) {
      expertGate.err = "성명을 입력해 주세요.";
      await render();
      return;
    }

    expertGate.err = "";
    await render();

    const subject = "[AOP] 연구자/전문가 계정 신청";
    const body = [
      "안녕하세요. AOP v2.0 전문가 자료(해석요강/학습자료/개발 배경) 접근 계정을 신청합니다.",
      "",
      "- 성명: " + (name || ""),
      "- 이메일(아이디): " + (email || ""),
      "- 연락처: " + (phone || ""),
      "- 소속: " + (org || ""),
      "- 역할(연구/상담/수업 등): " + (role || ""),
      "- 학력(최종학력/과정): " + (edu || ""),
      "- 전공: " + (major || ""),
      "- 전문 분야/경험: " + (exp || ""),
      "- 추가 메모: " + (note || ""),
      "",
      "메일을 보낸 뒤 010-3105-6999로 전화드리겠습니다.",
    ].join("\n");

    location.href = mailtoHref("hyc6999@gmail.com", subject, body);
    return;
  }
  if (act === "expert-login") {
    const em = document.getElementById("expem");
    const pw = document.getElementById("exppw");
    if (em) expertGate.email = em.value;
    if (pw) expertGate.password = pw.value;
    expertGate.err = "";
    expertGate.busy = true;
    await render();
    try {
      await store.cloudSignIn(expertGate.email, expertGate.password);
      expertGate.busy = false;
      const next = expertGate.next || "/expert";
      expertGate.next = "";
      location.hash = `#${next}`;
      return;
    } catch (err) {
      expertGate.err = err.message || "로그인에 실패했습니다.";
    }
    expertGate.busy = false;
    await render();
    return;
  }
  if (act === "expert-logout") {
    expertGate.err = "";
    try {
      await store.cloudSignOut();
      sessionStorage.removeItem("aop.expert");
    } catch (err) {
      expertGate.err = err.message || "로그아웃에 실패했습니다.";
    }
    await render();
    return;
  }
  if (act === "expert-unlock") {
    const exp = document.getElementById("expcode");
    if (exp) expertGate.code = exp.value;
    expertGate.err = "";
    expertGate.busy = true;
    await render();
    try {
      const found = await store.findActiveCode(expertGate.code);
      if (!found) expertGate.err = "코드가 없거나 정지되었습니다.";
      else if (found.kind !== "expert") expertGate.err = "EXP- 코드만 사용할 수 있습니다.";
      else {
        sessionStorage.setItem("aop.expert", "1");
        expertGate.busy = false;
        const next = expertGate.next || "/expert";
        expertGate.next = "";
        location.hash = `#${next}`;
        return;
      }
    } catch (err) {
      expertGate.err = err.message || "코드를 확인하지 못했습니다.";
    }
    expertGate.busy = false;
    await render();
    return;
  }
  if (act === "consent") {
    take.step = 1;
    await render();
  }
  if (act === "check-code") {
    const codeEl = document.getElementById("code");
    if (codeEl) take.code = codeEl.value;
    take.err = "";
    try {
      const found = await store.findActiveCode(take.code);
      if (!found) take.err = "입장 코드가 없거나 정지되었습니다.";
      else {
        take.codeKind = found.kind;
        take.step = 2;
      }
    } catch (err) {
      take.err = err.message || "코드를 확인하지 못했습니다.";
    }
    await render();
  }
  if (act === "to-items") {
    const nameEl = document.getElementById("name");
    if (nameEl) take.displayName = nameEl.value;
    const g = document.getElementById("gender");
    const gr = document.getElementById("grade");
    const m = document.getElementById("major");
    const rg = document.getElementById("region");
    if (g) take.gender = g.value;
    if (gr) take.grade = gr.value;
    if (m) take.major = m.value;
    if (rg) take.regionProvince = rg.value;
    take.region = bucketRegion(take.regionProvince);

    const ed = take.edition || takeEdition() || "univ";
    const displayGrade = buildDisplayGrade(ed, take);
    if (displayGrade) take.grade = displayGrade;

    const missing = !take.displayName.trim() || !take.gender || !take.grade || !take.major || !take.region;
    if (missing) {
      take.err = "표시 이름과 인구통계를 모두 입력해 주십시오.";
    } else {
      take.err = "";
      take.step = 3;
    }
    await render();
  }
  if (act === "ans") {
    take.answers[Number(btn.dataset.id)] = Number(btn.dataset.v);
    await render();
  }
  if (act === "submit") {
    const ed = take.edition || takeEdition() || "univ";
    const itemList = itemsFor(ed);
    if (itemList.some((i) => take.answers[i.id] == null)) {
      take.err = "모든 문항에 답해 주십시오.";
      await render();
      return;
    }
    take.busy = true;
    await render();
    try {
      const session = await store.submit({
        edition: take.edition || takeEdition() || "univ",
        accessCode: take.code,
        displayName: take.displayName,
        gender: take.gender,
        grade: take.grade,
        major: take.major,
        region: take.region,
        regionProvince: take.regionProvince,
        schoolLevel: take.schoolLevel,
        schoolYear: take.schoolYear,
        highSchoolType: take.highSchoolType,
        univLevel: take.univLevel,
        univYear: take.univYear,
        gradLevel: take.gradLevel,
        adultRoleType: take.adultRoleType,
        answers: take.answers,
      });
      take.busy = false;
      location.hash = `#/result/${session.resultNo}`;
    } catch (err) {
      take.busy = false;
      take.err = err.message || "저장에 실패했습니다.";
      await render();
    }
  }
  if (act === "lookup") {
    const no = document.getElementById("no").value.trim().toUpperCase();
    location.hash = `#/result/${no}`;
  }
  if (act === "copy-no") {
    void navigator.clipboard.writeText(btn.dataset.no);
  }
  if (act === "print") window.print();
  if (act === "issue") {
    await store.createExpertCode(admin.label);
    admin.label = "";
    await render();
  }
  if (act === "toggle-code") {
    await store.setCodeActive(btn.dataset.id, btn.dataset.on !== "1");
    await render();
  }
  if (act === "csv-r" || act === "csv-c") {
    const k = admin.q.trim().toUpperCase();
    const filtered = !k
      ? admin.rows
      : admin.rows.filter(
          (row) =>
            row.resultNo.includes(k) ||
            row.displayName.toUpperCase().includes(k) ||
            row.accessCode.toUpperCase().includes(k),
        );
    const csv = store.sessionsToCsv(filtered, act === "csv-c");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = act === "csv-c" ? "aop-counseling.csv" : "aop-research.csv";
    a.click();
  }
}

async function onSubmit(e) {
  const form = e.target.closest("[data-act=login]");
  if (!form) return;
  e.preventDefault();
  admin.err = "";
  const password = document.getElementById("pw").value;
  try {
    if (usingCloud()) {
      const email = document.getElementById("em").value;
      await store.cloudSignIn(email, password);
    } else if (!store.checkLocalAdmin(password)) {
      admin.err = "비밀번호가 다릅니다.";
      await render();
      return;
    } else {
      sessionStorage.setItem("aop.admin", "1");
    }
    admin.authed = true;
    await render();
  } catch (err) {
    admin.err = err.message || "로그인 실패";
    await render();
  }
}

window.addEventListener("hashchange", () => {
  if (!route().startsWith("/take")) takeRouteEd = "";
  void render();
});
ensureBound();
void render();
