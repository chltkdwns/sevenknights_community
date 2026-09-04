package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;

/** 관리자 방어팀 목록 — 미공개 포함, 정렬·드래그용. */
public record EnemyTeamAdminSummaryResponse(
        Long id,
        String title,
        int sortOrder,
        boolean isPublished,
        int memberCount
) {
    public static EnemyTeamAdminSummaryResponse from(GuildWarEnemyTeam team) {
        return new EnemyTeamAdminSummaryResponse(
                team.getId(),
                team.getTitle(),
                team.getSortOrder(),
                team.isPublished(),
                team.getMembers().size()
        );
    }
}
