package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;

/**
 * 상대 방어팀 편성원 응답.
 * 신규는 heroes.id, 구버전은 characters.id를 characterId 필드로 내려준다.
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
                resolveCharacterId(member),
                resolveCharacterName(member),
                resolveCharacterImageUrl(member)
        );
    }

    private static Long resolveCharacterId(GuildWarEnemyTeamMember member) {
        if (member.getHero() != null) {
            return member.getHero().getId();
        }
        if (member.getCharacter() != null) {
            return member.getCharacter().getId();
        }
        return null;
    }

    private static String resolveCharacterName(GuildWarEnemyTeamMember member) {
        if (member.getHero() != null) {
            return member.getHero().getName();
        }
        if (member.getCharacter() != null) {
            return member.getCharacter().getName();
        }
        return null;
    }

    private static String resolveCharacterImageUrl(GuildWarEnemyTeamMember member) {
        if (member.getHero() != null) {
            return member.getHero().getImageUrl();
        }
        if (member.getCharacter() != null) {
            return member.getCharacter().getImageUrl();
        }
        return null;
    }
}
