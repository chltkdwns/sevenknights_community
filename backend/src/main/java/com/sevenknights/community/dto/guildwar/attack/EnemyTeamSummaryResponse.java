package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;

import java.util.Comparator;
import java.util.List;

/**
 * 공개 목록용 요약 응답.
 * <p>
 * 관리자 Upsert DTO·상세 응답과 분리한 이유:
 * <ul>
 *   <li>목록 카드에는 추천 공격안 전체가 필요 없어 N+1·페이로드를 줄인다.</li>
 *   <li>{@code isPublished}, {@code memo} 등 내부 필드를 노출하지 않는다.</li>
 * </ul>
 * {@code isPublished=true} 필터는 서비스·리포지토리에서 적용하며, 응답에는 포함하지 않는다.
 */
public record EnemyTeamSummaryResponse(
        Long id,
        String title,
        int sortOrder,
        String petName,
        String petImageUrl,
        List<EnemyTeamMemberResponse> members
) {
    public static EnemyTeamSummaryResponse from(GuildWarEnemyTeam team) {
        return new EnemyTeamSummaryResponse(
                team.getId(),
                team.getTitle(),
                team.getSortOrder(),
                team.getPetName(),
                team.getPetImageUrl(),
                team.getMembers().stream()
                        .sorted(Comparator.comparingInt(GuildWarEnemyTeamMember::getSlotOrder))
                        .map(EnemyTeamMemberResponse::from)
                        .toList()
        );
    }
}
