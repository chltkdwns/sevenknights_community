package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** 관리자 목록 드래그 앤 드롭 후 방어팀 표시 순서. */
public record EnemyTeamReorderRequest(
        @NotEmpty(message = "정렬할 방어팀 목록이 비어 있습니다.")
        List<@NotNull Long> orderedIds
) {
}
