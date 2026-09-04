package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.Size;

/**
 * 추천 장비 한 줄 — 마스터 선택 또는 직접 입력.
 * {@code equipmentId}와 {@code customName} 중 하나만 보낸다.
 */
public record AttackMemberEquipmentRequest(
        Long equipmentId,

        @Size(max = 80, message = "장비 이름은 80자 이하여야 합니다.")
        String customName
) {
}
