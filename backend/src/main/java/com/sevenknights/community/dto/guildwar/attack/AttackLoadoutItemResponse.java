package com.sevenknights.community.dto.guildwar.attack;

/** 공개/관리 폼에 내려주는 장비·펫 한 건. id가 null이면 마스터 없이 남은 구버전 표시용. */
public record AttackLoadoutItemResponse(
        Long id,
        String name,
        String imageUrl
) {
}
