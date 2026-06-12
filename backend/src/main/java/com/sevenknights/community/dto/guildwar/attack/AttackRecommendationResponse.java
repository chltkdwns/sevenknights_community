package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendation;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;

import java.util.Comparator;
import java.util.List;

/** 상대팀 카드 안의 추천 공격안 하나 — 공격 3인·스킬 순서·펫 표시를 묶어서 내려준다. */
public record AttackRecommendationResponse(
        Long id,
        String title,
        String description,
        int sortOrder,
        String petName,
        String petImageUrl,
        List<AttackTeamMemberResponse> attackTeamMembers,
        List<SkillStepResponse> skillSteps
) {
    public static AttackRecommendationResponse from(
            GuildWarAttackRecommendation recommendation,
            List<GuildWarSkillStep> skillSteps
    ) {
        return new AttackRecommendationResponse(
                recommendation.getId(),
                recommendation.getTitle(),
                recommendation.getDescription(),
                recommendation.getSortOrder(),
                recommendation.getPetName(),
                recommendation.getPetImageUrl(),
                recommendation.getAttackTeamMembers().stream()
                        .sorted(Comparator.comparingInt(m -> m.getSlotOrder()))
                        .map(AttackTeamMemberResponse::from)
                        .toList(),
                skillSteps.stream()
                        .sorted(Comparator.comparingInt(GuildWarSkillStep::getStepOrder))
                        .map(SkillStepResponse::from)
                        .toList()
        );
    }
}
