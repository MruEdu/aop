import { DOCS } from "./docs.js?v=20260907e";
import { profileLines, resultPreface, summaryInterpret } from "./interpret.js?v=20260907e";
import {
  GENDERS,
  ITEMS,
  LIKERT,
  PUBLIC_CODE,
  REGIONS,
  SCALE_ORDER,
  SCALES,
  editionLabel,
  gradeLabel,
  gradesFor,
  itemsFor,
  nowHint,
  trackLabel,
  tracksFor,
} from "./items.js?v=20260907e";
import { store, usingCloud } from "./storage.js?v=20260907e";

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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

function layout(inner) {
  const r = route();
  const cloudNote = usingCloud()
    ? ""
    : " 현재는 이 브라우저에만 저장됩니다. 연구 보관은 Supabase 연결 후입니다.";
  return `
    <div class="shell">
      <header class="top">
        <a class="brand" href="#/" style="text-decoration:none;color:inherit">
          학업운영 양식검사
          <small>대학생용 · 중고등용 · 성인용 · 예비 척도</small>
        </a>
        <nav class="nav">
          ${navLink("#/take", "검사 하기", r)}
          ${navLink("#/lookup", "결과조회", r)}
          ${navLink("#/manual", "사용설명서", r)}
          ${navLink("#/guide", "해석요강", r)}
          ${navLink("#/expert", "전문가", r)}
          ${navLink("#/admin", "관리자", r)}
        </nav>
      </header>
      ${inner}
      <footer class="footer">
        <p>© 2026 바이브스타틱스(VibeStatics) · 개발 현용찬(교육학 박사). All rights reserved.</p>
        <p>대학생용·중고등용·성인용 학업운영 양식검사(예비). 문항·채점·해석의 무단 복제·배포를 금합니다.${cloudNote}</p>
      </footer>
    </div>`;
}

function options(list, selected) {
  return `<option value="">선택</option>` + list.map((o) =>
    `<option value="${esc(o)}" ${o === selected ? "selected" : ""}>${esc(o)}</option>`,
  ).join("");
}

const take = {
  step: 0,
  edition: "",
  code: "",
  codeKind: "",
  displayName: "",
  gender: "",
  grade: "",
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
      <p>무엇을 할지 분명할 때(<b>명확성</b>) 이 셋이 살아납니다. 분명한 내용을 효율적으로 익히는 일이 학습이며, 그것이 학습공학입니다.</p>
      <p>대학에서 수년간 강의해 온 현장과 학습상담 경험을 바탕으로, 지금 학업·업무 방식을 확인하고 이 방향으로 운영을 돕기 위해 이 예비 척도를 개발하였습니다.</p>
      <p class="dev-src">교육공학에서는 타일러의 목표 명확성, 가네의 학습 조건, 라이겔루스의 효과성·효율성·매력성을 이렇게 읽어 왔습니다. 네 축은 그 가치를 지금 학업·업무 운영으로 옮긴 프로파일입니다.</p>
      <div class="dev-who">
        <strong>현용찬</strong>
        <span>교육학 박사 · 제주대·남서울대 출강 · 바이브스타틱스 대표 · 전) 연우심리연구소 지부장</span>
      </div>
    </div>`;
}

function editionCards(longCopy) {
  return `<div class="grid three">
      <div class="card">
        <h2 style="margin-top:0">대학생용</h2>
        <p>${longCopy ? "대학 과제·팀·AI 장면의 말로 되어 있습니다. 닉네임과 간단한 배경 정보 뒤 28문항에 답합니다." : "대학 과제·팀·AI 장면."}</p>
        <a class="btn" href="#/take/univ">${longCopy ? "대학생용 검사 시작" : "대학생용 시작"}</a>
      </div>
      <div class="card">
        <h2 style="margin-top:0">중고등용</h2>
        <p>${longCopy ? "같은 네 축입니다. 숙제·수행평가·모둠 등 학교 장면에 맞게 단어를 바꾼 판입니다." : "숙제·수행평가·모둠 장면."}</p>
        <a class="btn" href="#/take/school">${longCopy ? "중고등용 검사 시작" : "중고등용 시작"}</a>
      </div>
      <div class="card">
        <h2 style="margin-top:0">성인용</h2>
        <p>${longCopy ? "같은 네 축입니다. 업무·보고·팀 등 일의 장면에 맞게 말을 바꾼 판입니다. 학습과 일의 운영은 같은 원리입니다." : "업무·보고·팀 장면."}</p>
        <a class="btn" href="#/take/adult">${longCopy ? "성인용 검사 시작" : "성인용 시작"}</a>
      </div>
    </div>`;
}

function home() {
  return `
    <main class="hero">
      <div class="credit">대학생용 · 중고등용 · 성인용 · 개발 현용찬 · 예비 척도</div>
      <h1>여러분의 학업·업무 방식을<br>확인해 보세요</h1>
      <p class="lede">
        공부든 일이든, 하려던 것에 닿고(효과성), 힘과 시간을 아끼며(효율성), 다음에 또 하고 싶어지는 것(매력성). 무엇을 할지 분명할 때 이 셋이 살아납니다.
        이 검사는 지금 방식을 확인하고, 그 방향으로 운영을 돕기 위한 예비 척도입니다.
      </p>
      <div class="banner note">
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
      <p class="lede">대학생·중고등학생·성인, 지금 해당하는 쪽을 고르면 됩니다. 결과는 같은 네 가지로 보며, 질문만 학교·대학·일의 말로 적혀 있습니다.</p>
      ${editionCards(false)}
      ${developerNote()}
    </main>`;
  }
  const who = editionLabel(ed);
  const itemList = itemsFor(ed);
  const grades = gradesFor(ed);
  const tracks = tracksFor(ed);
  const majorName = trackLabel(ed);
  const gLabel = gradeLabel(ed);
  const hint = nowHint(ed);
  const when = ed === "adult" ? "시기가 바뀌면" : "학기가 바뀌면";
  if (t.step === 0) {
    return `<main><h1>${who} 검사 시작</h1>${steps(0)}<div class="card">
      <p>교육학 박사 현용찬이 개발한 <strong>${who} 학업운영 양식검사</strong>입니다. 지금 방식을 확인하고, 더 효율적인 운영에 도움을 드리고자 하는 예비 척도입니다.</p>
      <p>공부든 일이든, 하려던 것에 닿고(효과성), 힘과 시간을 아끼며(효율성), 다음에 또 하고 싶어지는 것(매력성)이 좋습니다. 무엇을 할지 분명할 때 이 셋이 살아납니다. 결과는 네 축 프로파일로 바로 보여 드리며, ${when} 다시 확인하실 수 있습니다.</p>
      <p>학번·전화·이메일은 받지 않습니다. 문의할 때는 결과번호가 필요합니다. 응답은 연구·상담을 위한 예비 자료로 보관됩니다. 계속하면 이 안내에 동의하는 것입니다.</p>
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
        <div class="row"><label for="grade">${esc(gLabel)}</label><select id="grade">${options(grades, t.grade)}</select></div>
        <div class="row"><label for="major">${esc(majorName)}</label><select id="major">${options(tracks, t.major)}</select></div>
        <div class="row"><label for="region">주 생활 지역</label><select id="region">${options(REGIONS, t.region)}</select></div>
      </div>
      <div class="actions"><button class="btn" data-act="to-items">문항으로</button></div>
    </div></main>`;
  }
  const filled = itemList.filter((i) => t.answers[i.id] != null).length;
  const pct = Math.round((filled / itemList.length) * 100);
  const items = itemList.map((item, i) => `
    <div class="item">
      <div class="q"><span class="num">${i + 1}.</span>${esc(item.text)}</div>
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
    <p class="legend">1 전혀 그렇지 않다 · 6 매우 그렇다. 지시에 점수를 고르라는 문항이 섞여 있습니다.</p>
    ${items}
    ${t.err ? `<p class="err">${esc(t.err)}</p>` : ""}
    <div class="actions"><button class="btn" data-act="submit" ${t.busy ? "disabled" : ""}>${t.busy ? "저장 중…" : "제출하고 결과 보기"}</button></div>
  </main>`;
}

function resultHtml(session) {
  const lines = profileLines(session.scores, session.edition);
  const preface = resultPreface(session.edition);
  const summary = summaryInterpret(session.scores, session.edition);
  const pct = (n) => `${Math.max(0, Math.min(100, ((n - 1) / 5) * 100))}%`;
  const bars = SCALE_ORDER.map((k) => `
    <div class="bar-row">
      <div>${SCALES[k].name}</div>
      <div class="track"><div class="fill" style="width:${pct(session.scores[k])}"></div></div>
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
        <a class="btn ghost" href="#/guide">해석요강 보기</a>
      </div>
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
  let inner = "";
  if (r === "/" || r === "") inner = home();
  else if (r.startsWith("/take")) inner = takeView();
  else if (r.startsWith("/result/")) {
    const no = decodeURIComponent(r.slice(8));
    inner = `<main><h1>결과</h1><p>불러오는 중…</p></main>`;
    root.innerHTML = layout(inner);
    try {
      const s = await store.getByResultNo(no);
      inner = s
        ? `<main><h1>결과</h1>${resultHtml(s)}</main>`
        : `<main><h1>결과</h1><p>결과번호에 해당하는 기록이 없습니다.</p></main>`;
    } catch (e) {
      inner = `<main><h1>결과</h1><p class="err">${esc(e.message || e)}</p></main>`;
    }
    root.innerHTML = layout(inner);
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
  root.innerHTML = layout(inner);
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
  if (el.id === "elabel") admin.label = el.value;
  if (el.id === "q") {
    admin.q = el.value;
  }
}

function onChange(e) {
  const el = e.target;
  if (el.id === "gender") take.gender = el.value;
  if (el.id === "grade") take.grade = el.value;
  if (el.id === "major") take.major = el.value;
  if (el.id === "region") take.region = el.value;
}

async function onClick(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const act = btn.dataset.act;
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
    if (rg) take.region = rg.value;
    if (!take.displayName.trim() || !take.gender || !take.grade || !take.major || !take.region) {
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
    if (ITEMS.some((i) => take.answers[i.id] == null)) {
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
