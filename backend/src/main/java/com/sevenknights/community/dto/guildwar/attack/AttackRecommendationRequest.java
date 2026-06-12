package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** 상대팀 카드 안의 추천 공격안 하나 — 공격 3인 + 스킬 순서를 한 묶음으로 받는다. */
public record AttackRecommendationRequest(
        @Size(max = 100, message = "추천 제목은 100자 이하여야 합니다.")
        String title,

        String description,

        @NotNull(message = "추천 순서를 입력해 주세요.")
        @Min(value = 0, message = "추천 순서는 0 이상이어야 합니다.")
        Integer sortOrder,

        @Size(max = 50, message = "펫 이름은 50자 이하여야 합니다.")
        String petName,

        @Size(max = 500, message = "펫 이미지 URL은 500자 이하여야 합니다.")
        String petImageUrl,

        @NotEmpty(message = "추천 공격팀 캐릭터를 1명 이상 등록해 주세요.")
        @Size(max = 3, message = "추천 공격팀 캐릭터는 최대 3명까지 등록할 수 있습니다.")
        @Valid
        List<AttackTeamMemberRequest> attackTeamMembers,

        @NotNull(message = "스킬 순서 목록이 필요합니다.")
        @Valid
        List<SkillStepRequest> skillSteps
) {
}
