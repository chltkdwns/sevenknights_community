package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;

/**
 * 상대 방어팀 편성원 응답.
 * Upsert DTO는 {@code characterId}만 받지만, 공개 UI는 이름·이미지가 필요하므로
 * 조회 시점의 캐릭터 마스터 스냅샷을 함께 내려준다.
 */
public record EnemyTeamMemberResponse(
        int slotOrder,
        Long characterId,
        String characterName,
        String characterImageUrl
) {
    public static EnemyTeamMemberResponse from(GuildWarEnemyTeamMember member) {
        return new EnemyTeamMemberResponse(
                member.getSlotOrder(),
                member.getCharacter().getId(),
                member.getCharacter().getName(),
                member.getCharacter().getImageUrl()
        );
    }
}
