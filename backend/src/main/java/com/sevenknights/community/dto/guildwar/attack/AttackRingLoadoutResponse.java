package com.sevenknights.community.dto.guildwar.attack;

/** 반지 마스터 스냅샷 + 이 추천안에만 있는 세공 문구. */
public record AttackRingLoadoutResponse(
        Long id,
        String name,
        String imageUrl,
        String enchantment
) {
}
