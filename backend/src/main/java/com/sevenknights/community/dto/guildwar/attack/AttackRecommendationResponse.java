package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberEquipment;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberRing;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendation;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendationPet;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.character.Skill;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

/** 상대팀 카드 안의 추천 공격안 하나 — 공격 3인·스킬 순서·펫 표시를 묶어서 내려준다. */
public record AttackRecommendationResponse(
        Long id,
        String title,
        String description,
        int sortOrder,
        /** 구버전 단일 펫. 신규는 pets 배열을 우선한다. */
        Long petId,
        String petName,
        String petImageUrl,
        List<AttackPetLoadoutResponse> pets,
        List<AttackTeamMemberResponse> attackTeamMembers,
        List<SkillStepResponse> skillSteps
) {
    public static AttackRecommendationResponse from(
            GuildWarAttackRecommendation recommendation,
            List<GuildWarSkillStep> skillSteps,
            Map<Long, List<Skill>> skillsByCharacterId,
            Map<String, Long> gameCharacterIdByName,
            Map<Long, List<GuildWarAttackMemberEquipment>> equipmentsByMemberId,
            Map<Long, List<GuildWarAttackMemberRing>> ringsByMemberId,
            List<GuildWarAttackRecommendationPet> recommendationPets
    ) {
        List<AttackPetLoadoutResponse> pets = resolvePets(recommendation, recommendationPets);

        return new AttackRecommendationResponse(
                recommendation.getId(),
                recommendation.getTitle(),
                recommendation.getDescription(),
                recommendation.getSortOrder(),
                recommendation.resolvePetId(),
                recommendation.resolvePetName(),
                recommendation.resolvePetImageUrl(),
                pets,
                recommendation.getAttackTeamMembers().stream()
                        .sorted(Comparator.comparingInt(m -> m.getSlotOrder()))
                        .map(member -> AttackTeamMemberResponse.from(
                                member,
                                skillsByCharacterId.getOrDefault(
                                        nullableSkillCharacterId(
                                                AttackTeamMemberResponse.resolveSkillCharacterId(member, gameCharacterIdByName)
                                        ),
                                        List.of()
                                ),
                                equipmentsByMemberId.getOrDefault(member.getId(), List.of()),
                                ringsByMemberId.getOrDefault(member.getId(), List.of())
                        ))
                        .toList(),
                skillSteps.stream()
                        .sorted(Comparator.comparingInt(GuildWarSkillStep::getStepOrder))
                        .filter(step -> step.getSkill() != null || hasText(step.getNote()))
                        .map(SkillStepResponse::from)
                        .toList()
        );
    }

    private static List<AttackPetLoadoutResponse> resolvePets(
            GuildWarAttackRecommendation recommendation,
            List<GuildWarAttackRecommendationPet> recommendationPets
    ) {
        if (recommendationPets != null && !recommendationPets.isEmpty()) {
            return recommendationPets.stream()
                    .sorted(Comparator.comparingInt(GuildWarAttackRecommendationPet::getSortOrder))
                    .map(AttackPetLoadoutResponse::from)
                    .toList();
        }
        if (recommendation.resolvePetId() != null) {
            return List.of(new AttackPetLoadoutResponse(
                    recommendation.resolvePetId(),
                    recommendation.resolvePetName(),
                    recommendation.resolvePetImageUrl()
            ));
        }
        if (hasText(recommendation.resolvePetName())) {
            return List.of(new AttackPetLoadoutResponse(
                    null,
                    recommendation.resolvePetName(),
                    recommendation.resolvePetImageUrl()
            ));
        }
        return List.of();
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static Long nullableSkillCharacterId(Long characterId) {
        return characterId != null ? characterId : -1L;
    }
}
