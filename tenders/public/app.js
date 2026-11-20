const TOPICS = {
  all: "전체",
  stats: "통계·조사",
  data: "데이터·TM",
  policy: "정책연구",
  needs: "실태·요구",
  education: "교육·과정",
  evaluation: "평가·성과",
  other: "기타",
};

const state = {
  notices: [],
  topic: "all",
  meta: null,
};

const $ = (id) => document.getElementById(id);

function formatBudget(n) {
  if (n == null) return "예산 미상";
  if (n >= 100_000_000) {
    const v = n / 100_000_000;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}억`;
  }
  if (n >= 10_000) return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만`;
  return `${n.toLocaleString("ko-KR")}원`;
}

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function ddayInfo(deadlineAt) {
  if (!deadlineAt) return { label: "마감 미상", cls: "" };
  const end = new Date(deadlineAt).getTime();
  if (Number.isNaN(end)) return { label: "마감 미상", cls: "" };
  const now = Date.now();
  const diff = Math.ceil((end - now) / 86_400_000);
  if (diff < 0) return { label: "마감", cls: "closed" };
  if (diff === 0) return { label: "D-Day", cls: "soon" };
  if (diff <= 3) return { label: `D-${diff}`, cls: "soon" };
  return { label: `D-${diff}`, cls: "" };
}

function renderChips() {
  const box = $("topicChips");
  box.innerHTML = "";
  for (const [id, label] of Object.entries(TOPICS)) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = label;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", state.topic === id ? "true" : "false");
    btn.addEventListener("click", () => {
      state.topic = id;
      renderChips();
      renderList();
    });
    box.appendChild(btn);
  }
}

function filtered() {
  const q = $("q").value.trim().toLowerCase();
  const openOnly = $("openOnly").checked;
  const sort = $("sort").value;
  const now = Date.now();

  let rows = state.notices.filter((n) => {
    if (state.topic !== "all" && !(n.topics || []).includes(state.topic)) return false;
    if (openOnly && n.deadlineAt && new Date(n.deadlineAt).getTime() < now) return false;
    if (!q) return true;
    const hay = `${n.title} ${n.organization}`.toLowerCase();
    return hay.includes(q);
  });

  rows.sort((a, b) => {
    if (sort === "budget") return (b.budget || 0) - (a.budget || 0);
    if (sort === "newest") {
      return String(b.postedAt || "").localeCompare(String(a.postedAt || ""));
    }
    return String(a.deadlineAt || "9999").localeCompare(String(b.deadlineAt || "9999"));
  });
  return rows;
}

function renderList() {
  const rows = filtered();
  const list = $("list");
  $("status").textContent = `${rows.length}건 표시`;
  list.innerHTML = "";

  if (!rows.length) {
    list.innerHTML = `<li class="empty">조건에 맞는 공고가 없습니다.</li>`;
    return;
  }

  const frag = document.createDocumentFragment();
  rows.forEach((n, i) => {
    const li = document.createElement("li");
    li.className = "card";
    li.style.animationDelay = `${Math.min(i, 12) * 30}ms`;
    const dd = ddayInfo(n.deadlineAt);
    const tags = (n.topics || [])
      .map((t) => `<span class="tag">${TOPICS[t] || t}</span>`)
      .join("");
    li.innerHTML = `
      <div class="card-top">
        <span class="dday ${dd.cls}">${dd.label}</span>
        <div class="actions"><a href="${n.url}" target="_blank" rel="noopener noreferrer">원문 보기 →</a></div>
      </div>
      <h2><a href="${n.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(n.title)}</a></h2>
      <p class="facts">
        <span>${escapeHtml(n.organization)}</span>
        <span>${formatBudget(n.budget)}</span>
        <span>마감 ${formatDate(n.deadlineAt)}</span>
      </p>
      <div class="topics">${tags}</div>
    `;
    frag.appendChild(li);
  });
  list.appendChild(frag);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderMeta() {
  const g = state.meta?.generatedAt;
  $("generatedAt").textContent = g
    ? new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(g))
    : "—";
  $("count").textContent = String(state.meta?.count ?? state.notices.length);
  $("source").textContent = state.meta?.source === "g2b-servc" ? "나라장터" : state.meta?.source || "—";
}

async function boot() {
  renderChips();
  try {
    const res = await fetch(`./data/notices.json?ts=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.meta = data;
    state.notices = Array.isArray(data.notices) ? data.notices : [];
    renderMeta();
    renderList();
  } catch (err) {
    $("status").textContent = `데이터 로드 실패: ${err.message}`;
  }

  for (const id of ["q", "sort", "openOnly"]) {
    $(id).addEventListener("input", renderList);
    $(id).addEventListener("change", renderList);
  }
}

boot();
