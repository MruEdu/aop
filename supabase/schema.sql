-- 학업·업무 방식검사 · Supabase
-- 1) SQL Editor에서 실행
-- 2) Authentication에서 관리자 계정 1개 생성
-- 3) .env에 URL, anon key

create table if not exists public.access_codes (
  id uuid primary key,
  code text unique not null,
  kind text not null check (kind in ('public', 'expert')),
  label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key,
  access_code_id uuid not null references public.access_codes (id),
  result_no text unique not null,
  display_name text not null,
  gender text not null,
  grade text not null,
  major text not null,
  region text not null,
  edition text not null default 'univ' check (edition in ('univ', 'school', 'adult')),
  answers jsonb not null,
  scores jsonb not null,
  attention_ok boolean not null,
  lie_ok boolean not null,
  reliable boolean not null,
  consent_version text not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_code_idx on public.sessions (access_code_id);
create index if not exists sessions_created_idx on public.sessions (created_at desc);
create index if not exists sessions_edition_idx on public.sessions (edition);

alter table public.access_codes enable row level security;
alter table public.sessions enable row level security;

drop policy if exists "auth_all_codes" on public.access_codes;
create policy "auth_all_codes"
  on public.access_codes for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "auth_all_sessions" on public.sessions;
create policy "auth_all_sessions"
  on public.sessions for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.lookup_access_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare r public.access_codes%rowtype;
begin
  select * into r
  from public.access_codes
  where upper(code) = upper(trim(p_code)) and active
  limit 1;
  if not found then
    return null;
  end if;
  return jsonb_build_object(
    'id', r.id,
    'code', r.code,
    'kind', r.kind,
    'label', r.label,
    'active', r.active,
    'created_at', r.created_at
  );
end;
$$;

create or replace function public.submit_aop_session(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.access_codes%rowtype;
begin
  select * into c
  from public.access_codes
  where id = (p->>'access_code_id')::uuid and active
  limit 1;
  if not found then
    raise exception 'invalid code';
  end if;
  insert into public.sessions (
    id, access_code_id, result_no, display_name, gender, grade, major, region, edition,
    answers, scores, attention_ok, lie_ok, reliable, consent_version, created_at
  ) values (
    (p->>'id')::uuid,
    c.id,
    p->>'result_no',
    p->>'display_name',
    p->>'gender',
    p->>'grade',
    p->>'major',
    p->>'region',
    coalesce(nullif(p->>'edition', ''), 'univ'),
    p->'answers',
    p->'scores',
    (p->>'attention_ok')::boolean,
    (p->>'lie_ok')::boolean,
    (p->>'reliable')::boolean,
    p->>'consent_version',
    (p->>'created_at')::timestamptz
  );
  return p;
end;
$$;

create or replace function public.get_session_by_result(p_no text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare s public.sessions%rowtype;
declare c public.access_codes%rowtype;
begin
  select * into s from public.sessions
  where upper(result_no) = upper(trim(p_no))
  limit 1;
  if not found then
    return null;
  end if;
  select * into c from public.access_codes where id = s.access_code_id;
  return jsonb_build_object(
    'id', s.id,
    'access_code_id', s.access_code_id,
    'access_code', c.code,
    'code_kind', c.kind,
    'result_no', s.result_no,
    'display_name', s.display_name,
    'gender', s.gender,
    'grade', s.grade,
    'major', s.major,
    'region', s.region,
    'edition', s.edition,
    'answers', s.answers,
    'scores', s.scores,
    'attention_ok', s.attention_ok,
    'lie_ok', s.lie_ok,
    'reliable', s.reliable,
    'consent_version', s.consent_version,
    'created_at', s.created_at
  );
end;
$$;

grant execute on function public.lookup_access_code(text) to anon, authenticated;
grant execute on function public.submit_aop_session(jsonb) to anon, authenticated;
grant execute on function public.get_session_by_result(text) to anon, authenticated;

insert into public.access_codes (id, code, kind, label, active)
values (
  '00000000-0000-0000-0000-000000000001',
  'AOP-OPEN',
  'public',
  '공개 응시',
  true
)
on conflict (code) do nothing;
