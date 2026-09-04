-- gw_attack_member_equipments: 마스터 FK 또는 custom_name 직접 입력
ALTER TABLE gw_attack_member_equipments MODIFY equipment_id BIGINT NULL;
ALTER TABLE gw_attack_member_equipments ADD COLUMN custom_name VARCHAR(80) NULL;
