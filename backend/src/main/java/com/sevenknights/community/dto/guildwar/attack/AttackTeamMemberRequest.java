package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AttackTeamMemberRequest(
        @NotNull(message = "영웅을 선택해 주세요.")
        Long heroId,

        @NotNull(message = "슬롯 순서를 입력해 주세요.")
        @Min(value = 1, message = "슬롯 순서는 1 이상이어야 합니다.")
        @Max(value = 3, message = "슬롯 순서는 3 이하여야 합니다.")
        Integer slotOrder,

        /** 없으면 공개 UI에서 설명 영역을 숨긴다. */
        String description,

        /** 선택한 장비 마스터 ID 목록. 비어 있으면 장비 없음. */
        List<Long> equipmentIds,

        /** 반지 ID + 세공 문자열. 반지 이름/이미지는 보내지 않는다. */
        @Valid
        List<AttackMemberRingRequest> rings
) {
}
