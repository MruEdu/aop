-- 이미 schema.sql을 실행한 프로젝트에만 한 번 더 실행하십시오.
-- 대학생용 / 중고등용 / 성인용 판 구분(edition)

alter table public.sessions
  add column if not exists edition text not null default 'univ';

alter table public.sessions
  drop constraint if exists sessions_edition_check;

alter table public.sessions
  add constraint sessions_edition_check check (edition in ('univ', 'school', 'adult'));

create index if not exists sessions_edition_idx on public.sessions (edition);

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
