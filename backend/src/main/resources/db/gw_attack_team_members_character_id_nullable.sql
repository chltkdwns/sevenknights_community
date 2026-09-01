-- gw_attack_team_members.character_id: 신규 추천 공격팀은 hero_id만 저장하고 character_id는 NULL.
-- Hibernate ddl-auto가 기존 NOT NULL을 자동으로 풀지 않는 환경에서는 이 스크립트를 한 번 실행한다.
ALTER TABLE gw_attack_team_members MODIFY character_id BIGINT NULL;
