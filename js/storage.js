import { CONSENT_VERSION, PUBLIC_CODE } from "./items.js?v=20260916k";
import { makeExpertCode, makeResultNo, scoreAnswers, uid } from "./scoring.js?v=20260916k";

const LS_CODES = "aop.codes.v1";
const LS_SESSIONS = "aop.sessions.v1";

function cfg() {
  return window.AOP_CONFIG || {};
}

export function usingCloud() {
  const c = cfg();
  return Boolean(c.supabaseUrl && c.supabaseAnon);
}

let sbClient = null;
async function supabase() {
  if (!usingCloud()) return null;
  if (sbClient) return sbClient;
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  sbClient = createClient(cfg().supabaseUrl, cfg().supabaseAnon);
  return sbClient;
}

function seedLocal() {
  if (localStorage.getItem(LS_CODES)) return;
  const now = new Date().toISOString();
  localStorage.setItem(
    LS_CODES,
    JSON.stringify([
      { id: uid(), code: PUBLIC_CODE, kind: "public", label: "공개 응시", active: true, createdAt: now },
    ]),
  );
  localStorage.setItem(LS_SESSIONS, JSON.stringify([]));
}

function readCodes() {
  seedLocal();
  return JSON.parse(localStorage.getItem(LS_CODES) || "[]");
}
function writeCodes(codes) {
  localStorage.setItem(LS_CODES, JSON.stringify(codes));
}
function readSessions() {
  seedLocal();
  return JSON.parse(localStorage.getItem(LS_SESSIONS) || "[]");
}
function writeSessions(rows) {
  localStorage.setItem(LS_SESSIONS, JSON.stringify(rows));
}

function buildSession(input, code) {
  const scored = scoreAnswers(input.answers);
  const edition = input.edition === "elementary" || input.edition === "school" || input.edition === "adult"
    ? input.edition
    : "univ";
  return {
    id: uid(),
    accessCodeId: code.id,
    accessCode: code.code,
    codeKind: code.kind,
    resultNo: makeResultNo(),
    edition,
    displayName: input.displayName.trim(),
    gender: input.gender,
    grade: input.grade,
    major: input.major,
    region: input.region,
    regionProvince: input.regionProvince || "",
    schoolLevel: input.schoolLevel || "",
    schoolYear: input.schoolYear || "",
    highSchoolType: input.highSchoolType || "",
    univLevel: input.univLevel || "",
    univYear: input.univYear || "",
    gradLevel: input.gradLevel || "",
    adultRoleType: input.adultRoleType || "",
    answers: input.answers,
    scores: scored.scores,
    attentionOk: scored.attentionOk,
    lieOk: scored.lieOk,
    reliable: scored.reliable,
    consentVersion: CONSENT_VERSION,
    createdAt: new Date().toISOString(),
  };
}

function csvCell(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export const store = {
  usingCloud,

  async findActiveCode(raw) {
    const code = raw.trim().toUpperCase();
    const sb = await supabase();
    if (sb) {
      const { data, error } = await sb.rpc("lookup_access_code", { p_code: code });
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        code: data.code,
        kind: data.kind,
        label: data.label ?? "",
        active: data.active,
        createdAt: data.created_at,
      };
    }
    return readCodes().find((c) => c.code.toUpperCase() === code && c.active) ?? null;
  },

  async submit(input) {
    const code = await this.findActiveCode(input.accessCode);
    if (!code) throw new Error("입장 코드가 없거나 정지되었습니다.");
    const session = buildSession(input, code);
    const sb = await supabase();
    if (sb) {
      const { error } = await sb.rpc("submit_aop_session", {
        p: {
          id: session.id,
          access_code_id: session.accessCodeId,
          result_no: session.resultNo,
          edition: session.edition,
          display_name: session.displayName,
          gender: session.gender,
          grade: session.grade,
          major: session.major,
          region: session.region,
          region_province: session.regionProvince || null,
          school_level: session.schoolLevel || null,
          school_year: session.schoolYear || null,
          high_school_type: session.highSchoolType || null,
          univ_level: session.univLevel || null,
          univ_year: session.univYear || null,
          grad_level: session.gradLevel || null,
          adult_role_type: session.adultRoleType || null,
          answers: session.answers,
          scores: session.scores,
          attention_ok: session.attentionOk,
          lie_ok: session.lieOk,
          reliable: session.reliable,
          consent_version: session.consentVersion,
          created_at: session.createdAt,
        },
      });
      if (error) throw error;
      return session;
    }
    const rows = readSessions();
    rows.push(session);
    writeSessions(rows);
    return session;
  },

  async getByResultNo(resultNo) {
    const no = resultNo.trim().toUpperCase();
    const sb = await supabase();
    if (sb) {
      const { data, error } = await sb.rpc("get_session_by_result", { p_no: no });
      if (error) throw error;
      if (!data) return null;
      return {
        id: data.id,
        accessCodeId: data.access_code_id,
        accessCode: data.access_code,
        codeKind: data.code_kind,
        resultNo: data.result_no,
        edition: data.edition || "univ",
        displayName: data.display_name,
        gender: data.gender,
        grade: data.grade,
        major: data.major,
        region: data.region,
        regionProvince: data.region_province ?? "",
        schoolLevel: data.school_level ?? "",
        schoolYear: data.school_year ?? "",
        highSchoolType: data.high_school_type ?? "",
        univLevel: data.univ_level ?? "",
        univYear: data.univ_year ?? "",
        gradLevel: data.grad_level ?? "",
        adultRoleType: data.adult_role_type ?? "",
        answers: data.answers,
        scores: data.scores,
        attentionOk: data.attention_ok,
        lieOk: data.lie_ok,
        reliable: data.reliable,
        consentVersion: data.consent_version,
        createdAt: data.created_at,
      };
    }
    return readSessions().find((s) => s.resultNo.toUpperCase() === no) ?? null;
  },

  async listSessions() {
    const sb = await supabase();
    if (sb) {
      const { data, error } = await sb
        .from("sessions")
        .select("*, access_codes(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        id: row.id,
        accessCodeId: row.access_code_id,
        accessCode: row.access_codes.code,
        codeKind: row.access_codes.kind,
        resultNo: row.result_no,
        edition: row.edition || "univ",
        displayName: row.display_name,
        gender: row.gender,
        grade: row.grade,
        major: row.major,
        region: row.region,
        regionProvince: row.region_province ?? "",
        schoolLevel: row.school_level ?? "",
        schoolYear: row.school_year ?? "",
        highSchoolType: row.high_school_type ?? "",
        univLevel: row.univ_level ?? "",
        univYear: row.univ_year ?? "",
        gradLevel: row.grad_level ?? "",
        adultRoleType: row.adult_role_type ?? "",
        answers: row.answers,
        scores: row.scores,
        attentionOk: row.attention_ok,
        lieOk: row.lie_ok,
        reliable: row.reliable,
        consentVersion: row.consent_version,
        createdAt: row.created_at,
      }));
    }
    return [...readSessions()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async listCodes() {
    const sb = await supabase();
    if (sb) {
      const { data, error } = await sb.from("access_codes").select("*").order("created_at");
      if (error) throw error;
      return (data ?? []).map((d) => ({
        id: d.id,
        code: d.code,
        kind: d.kind,
        label: d.label ?? "",
        active: d.active,
        createdAt: d.created_at,
      }));
    }
    return readCodes();
  },

  async createExpertCode(label) {
    const row = {
      id: uid(),
      code: makeExpertCode(),
      kind: "expert",
      label: (label || "").trim() || "전문가",
      active: true,
      createdAt: new Date().toISOString(),
    };
    const sb = await supabase();
    if (sb) {
      const { error } = await sb.from("access_codes").insert({
        id: row.id,
        code: row.code,
        kind: row.kind,
        label: row.label,
        active: true,
        created_at: row.createdAt,
      });
      if (error) throw error;
      return row;
    }
    const codes = readCodes();
    codes.push(row);
    writeCodes(codes);
    return row;
  },

  async setCodeActive(id, active) {
    const sb = await supabase();
    if (sb) {
      const { error } = await sb.from("access_codes").update({ active }).eq("id", id);
      if (error) throw error;
      return;
    }
    writeCodes(readCodes().map((c) => (c.id === id ? { ...c, active } : c)));
  },

  checkLocalAdmin(password) {
    return password === (cfg().adminPassword || "change-me");
  },

  async cloudSignIn(email, password) {
    const sb = await supabase();
    if (!sb) throw new Error("클라우드가 연결되지 않았습니다.");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async cloudSignOut() {
    const sb = await supabase();
    if (!sb) return;
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  },

  async cloudSession() {
    const sb = await supabase();
    if (!sb) return null;
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    return data?.session ?? null;
  },

  sessionsToCsv(rows, includeName) {
    const maxId = rows.reduce((acc, s) => {
      const a = s.answers || {};
      for (const k of Object.keys(a)) {
        const n = Number(k);
        if (Number.isFinite(n) && n > acc) acc = n;
      }
      return acc;
    }, 0);
    const n = Math.max(33, maxId || 0);
    const ids = Array.from({ length: n }, (_, i) => i + 1);
    const itemCols = ids.map((id) => `q${id}`);
    const header = [
      "result_no",
      "created_at",
      "edition",
      "access_code",
      "code_kind",
      ...(includeName ? ["display_name"] : []),
      "gender",
      "grade",
      "major",
      "region",
      "region_province",
      "school_level",
      "school_year",
      "high_school_type",
      "univ_level",
      "univ_year",
      "grad_level",
      "adult_role_type",
      "attention_ok",
      "lie_ok",
      "reliable",
      "ie",
      "sa",
      "wd",
      "io",
      ...itemCols,
    ];
    const lines = [header.join(",")];
    for (const s of rows) {
      const a = s.answers || {};
      const cells = [
        s.resultNo,
        s.createdAt,
        s.edition || "univ",
        s.accessCode,
        s.codeKind,
        ...(includeName ? [csvCell(s.displayName)] : []),
        csvCell(s.gender),
        csvCell(s.grade),
        csvCell(s.major),
        csvCell(s.region),
        csvCell(s.regionProvince),
        csvCell(s.schoolLevel),
        csvCell(s.schoolYear),
        csvCell(s.highSchoolType),
        csvCell(s.univLevel),
        csvCell(s.univYear),
        csvCell(s.gradLevel),
        csvCell(s.adultRoleType),
        String(s.attentionOk),
        String(s.lieOk),
        String(s.reliable),
        s.scores.ie,
        s.scores.sa,
        s.scores.wd,
        s.scores.io,
        ...ids.map((id) => {
          const v = a[id] ?? a[String(id)];
          return v == null ? "" : String(v);
        }),
      ];
      lines.push(cells.join(","));
    }
    return "\uFEFF" + lines.join("\n");
  },
};
