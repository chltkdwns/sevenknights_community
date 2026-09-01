-- gw_skill_steps.skill_id: 스킬 카탈로그 FK. NULL 허용 케이스:
--   1) 스킬 사용 X — 행 자체를 저장하지 않음 (카탈로그 모드)
--   2) 수동 입력 — skill_id=NULL, note=입력 텍스트 (임시 관리자 UI)
-- Hibernate ddl-auto: update는 기존 NOT NULL을 자동으로 풀지 않으므로 MySQL에서 한 번 실행한다.
ALTER TABLE gw_skill_steps MODIFY skill_id BIGINT NULL;