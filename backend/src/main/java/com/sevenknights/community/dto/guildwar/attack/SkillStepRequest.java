package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 스킬 시퀀스 한 스텝. {@code skillId}가 있으면 skills 마스터 FK로 저장한다.
 * null이면 "스킬 사용 X"로 해석하며, 해당 스텝과 이후는 DB에 저장하지 않는다.
 */
public record SkillStepRequest(
        @NotNull(message = "스킬 순서를 입력해 주세요.")
        @Min(value = 1, message = "스킬 순서는 1 이상이어야 합니다.")
        @Max(value = 3, message = "스킬 순서는 3 이하여야 합니다.")
        Integer stepOrder,

        Long skillId,

        @Size(max = 255, message = "스킬 스텝 메모는 255자 이하여야 합니다.")
        String note
) {
}
