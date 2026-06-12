package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AttackTeamMemberRequest(
        @NotNull(message = "캐릭터를 선택해 주세요.")
        Long characterId,

        @NotNull(message = "슬롯 순서를 입력해 주세요.")
        @Min(value = 1, message = "슬롯 순서는 1 이상이어야 합니다.")
        @Max(value = 3, message = "슬롯 순서는 3 이하여야 합니다.")
        Integer slotOrder
) {
}
