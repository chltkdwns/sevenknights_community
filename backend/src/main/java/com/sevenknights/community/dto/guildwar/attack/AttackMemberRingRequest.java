package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AttackMemberRingRequest(
        @NotNull(message = "반지를 선택해 주세요.")
        Long ringId,

        /** 세공 추천 문구. 마스터 옵션이 아니라 공격팀별로 직접 입력한 문자열. */
        @Size(max = 255, message = "반지 세공은 255자 이하여야 합니다.")
        String enchantment
) {
}
