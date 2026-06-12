package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackTeamMember;

/** 추천 공격팀 편성원 응답 — {@link EnemyTeamMemberResponse}와 동일하게 UI 표시용 스냅샷을 포함한다. */
public record AttackTeamMemberResponse(
        int slotOrder,
        Long characterId,
        String characterName,
        String characterImageUrl
) {
    public static AttackTeamMemberResponse from(GuildWarAttackTeamMember member) {
        return new AttackTeamMemberResponse(
                member.getSlotOrder(),
                member.getCharacter().getId(),
                member.getCharacter().getName(),
                member.getCharacter().getImageUrl()
        );
    }
}
