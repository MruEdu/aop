-- AOP v2.0: 인구통계(세분화) 전용 컬럼 추가 + 지역(시·도) 정규화 컬럼
-- 이미 schema.sql을 실행한 프로젝트(운영 DB)에 적용하는 패치입니다.

alter table public.sessions
  add column if not exists region_province text,
  add column if not exists school_level text,
  add column if not exists school_year text,
  add column if not exists high_school_type text,
  add column if not exists univ_level text,
  add column if not exists univ_year text,
  add column if not exists grad_level text,
  add column if not exists adult_role_type text;

-- 기존 데이터 region이 이미 단일 시·도인 경우에만 자동 백필(복합 표기는 판단 불가이므로 NULL 유지)
update public.sessions
set region_province = region
where region_province is null
  and region in (
    '서울','경기','인천','대전','충남','충북','광주','전남','전북',
    '대구','부산','경북','경남','울산','강원','제주','세종'
  );

-- RPC 함수가 새 컬럼까지 저장/반환하도록 갱신
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
    id, access_code_id, result_no, display_name, gender, grade, major, region,
    region_province, school_level, school_year, high_school_type, univ_level, univ_year, grad_level, adult_role_type,
    edition,
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
    nullif(p->>'region_province', ''),
    nullif(p->>'school_level', ''),
    nullif(p->>'school_year', ''),
    nullif(p->>'high_school_type', ''),
    nullif(p->>'univ_level', ''),
    nullif(p->>'univ_year', ''),
    nullif(p->>'grad_level', ''),
    nullif(p->>'adult_role_type', ''),
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
    'region_province', s.region_province,
    'school_level', s.school_level,
    'school_year', s.school_year,
    'high_school_type', s.high_school_type,
    'univ_level', s.univ_level,
    'univ_year', s.univ_year,
    'grad_level', s.grad_level,
    'adult_role_type', s.adult_role_type,
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

