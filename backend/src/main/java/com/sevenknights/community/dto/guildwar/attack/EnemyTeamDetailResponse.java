package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberEquipment;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberRing;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendation;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendationPet;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.character.Skill;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

/**
 * 공개 상세 응답 — Aggregate 트리 전체를 UI가 바로 렌더링할 수 있는 형태로 펼친다.
 * <p>
 * 쓰기({@link EnemyTeamUpsertRequest})와 읽기 DTO를 분리해
 * 공개 API가 관리자 입력 스키마에 묶이지 않게 하고, 조회 전용 필드(캐릭터명·스킬 메타)를 추가할 수 있다.
 */
public record EnemyTeamDetailResponse(
        Long id,
        String title,
        String memo,
        int sortOrder,
        String petName,
        String petImageUrl,
        List<EnemyTeamMemberResponse> members,
        List<AttackRecommendationResponse> recommendations
) {
    public static EnemyTeamDetailResponse from(
            GuildWarEnemyTeam team,
            List<GuildWarAttackRecommendation> recommendations,
            Map<Long, List<GuildWarSkillStep>> skillStepsByRecommendationId,
            Map<Long, List<Skill>> skillsByCharacterId,
            Map<String, Long> gameCharacterIdByName,
            Map<Long, List<GuildWarAttackMemberEquipment>> equipmentsByMemberId,
            Map<Long, List<GuildWarAttackMemberRing>> ringsByMemberId,
            Map<Long, List<GuildWarAttackRecommendationPet>> petsByRecommendationId
    ) {
        return new EnemyTeamDetailResponse(
                team.getId(),
                team.getTitle(),
                team.getMemo(),
                team.getSortOrder(),
                team.getPetName(),
                team.getPetImageUrl(),
                team.getMembers().stream()
                        .sorted(Comparator.comparingInt(GuildWarEnemyTeamMember::getSlotOrder))
                        .map(EnemyTeamMemberResponse::from)
                        .toList(),
                recommendations.stream()
                        .sorted(Comparator.comparingInt(GuildWarAttackRecommendation::getSortOrder))
                        .map(recommendation -> AttackRecommendationResponse.from(
                                recommendation,
                                skillStepsByRecommendationId.getOrDefault(recommendation.getId(), List.of()),
                                skillsByCharacterId,
                                gameCharacterIdByName,
                                equipmentsByMemberId,
                                ringsByMemberId,
                                petsByRecommendationId.getOrDefault(recommendation.getId(), List.of())
                        ))
                        .toList()
        );
    }
}
