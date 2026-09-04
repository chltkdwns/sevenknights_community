package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.Size;

public record AttackMemberRingRequest(
        /** 마스터 선택 시 사용. 직접 입력이면 null. */
        Long ringId,

        /** 드롭다운에 없는 반지명. ringId가 있으면 무시한다. */
        @Size(max = 80, message = "반지 이름은 80자 이하여야 합니다.")
        String customName,

        /** 세공 추천 문구. 마스터 옵션이 아니라 공격팀별로 직접 입력한 문자열. */
        @Size(max = 255, message = "반지 세공은 255자 이하여야 합니다.")
        String enchantment
) {
}
