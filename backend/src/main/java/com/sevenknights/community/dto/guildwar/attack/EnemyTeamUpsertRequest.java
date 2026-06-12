package com.sevenknights.community.dto.guildwar.attack;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * 관리자용 Aggregate Upsert DTO — {@link com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam}
 * 트리와 동일한 중첩 구조로, 폼 전체를 한 번에 검증·저장하기 위해 설계했다.
 */
public record EnemyTeamUpsertRequest(
        @NotBlank(message = "상대 방어팀 제목을 입력해 주세요.")
        @Size(max = 100, message = "제목은 100자 이하여야 합니다.")
        String title,

        @Size(max = 255, message = "메모는 255자 이하여야 합니다.")
        String memo,

        @NotNull(message = "정렬 순서를 입력해 주세요.")
        @Min(value = 0, message = "정렬 순서는 0 이상이어야 합니다.")
        Integer sortOrder,

        @NotNull(message = "노출 여부를 입력해 주세요.")
        Boolean isPublished,

        @Size(max = 50, message = "펫 이름은 50자 이하여야 합니다.")
        String petName,

        @Size(max = 500, message = "펫 이미지 URL은 500자 이하여야 합니다.")
        String petImageUrl,

        @NotEmpty(message = "상대 방어팀 캐릭터를 1명 이상 등록해 주세요.")
        @Size(max = 3, message = "상대 방어팀 캐릭터는 최대 3명까지 등록할 수 있습니다.")
        @Valid
        List<EnemyTeamMemberRequest> members,

        @NotNull(message = "추천 공격팀 목록이 필요합니다.")
        @Valid
        List<AttackRecommendationRequest> recommendations
) {
}
