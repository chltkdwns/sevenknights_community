package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 스킬 시퀀스 한 스텝. {@code skillId}는 마스터 {@code skills} 테이블 FK이며,
 * {@code stepOrder}만으로는 어떤 스킬인지 특정할 수 없어 id 기반 참조를 쓴다.
 */
public record SkillStepRequest(
        @NotNull(message = "스킬 순서를 입력해 주세요.")
        @Min(value = 1, message = "스킬 순서는 1 이상이어야 합니다.")
        Integer stepOrder,

        @NotNull(message = "스킬을 선택해 주세요.")
        Long skillId,

        @Size(max = 255, message = "스킬 스텝 메모는 255자 이하여야 합니다.")
        String note
) {
}
