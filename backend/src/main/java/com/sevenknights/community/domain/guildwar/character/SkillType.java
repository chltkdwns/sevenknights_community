package com.sevenknights.community.domain.guildwar.character;

/**
 * 세븐나이츠 캐릭터의 고정 스킬 슬롯.
 * 문자열 자유 입력 대신 enum을 쓰면 UI·검증·유니크 제약이 한 가지 규칙으로 맞춰진다.
 */
public enum SkillType {
    SKILL_1,
    SKILL_2,
    SKILL_3,
    AWAKENING,
    PASSIVE
}
