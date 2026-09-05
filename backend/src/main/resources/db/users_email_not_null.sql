-- users.email: 아이디/비밀번호 찾기를 위해 가입 시 이메일을 필수로 저장한다.
-- 기존 계정 email 값은 그대로 두고, 컬럼은 삭제하지 않는다.
-- Hibernate ddl-auto: update가 NOT NULL을 바로 반영하지 않으면 MySQL에서 한 번 실행한다.
ALTER TABLE users MODIFY email VARCHAR(100) NOT NULL;
