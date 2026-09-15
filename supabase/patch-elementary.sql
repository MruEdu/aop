-- AOP v2.0: elementary edition 허용 마이그레이션
-- 기존 프로젝트에서 sessions.edition 체크 제약을 elementary 포함으로 갱신합니다.

ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_edition_check;
ALTER TABLE public.sessions ADD CONSTRAINT sessions_edition_check
CHECK (edition IN ('univ', 'school', 'adult', 'elementary'));

