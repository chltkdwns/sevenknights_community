package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendationPet;
import com.sevenknights.community.domain.pet.Pet;

/** 추천 공격팀 펫 목록 한 항목 — pets 카탈로그 기준. */
public record AttackPetLoadoutResponse(
        Long id,
        String name,
        String imageUrl
) {
    public static AttackPetLoadoutResponse from(Pet pet) {
        return new AttackPetLoadoutResponse(pet.getId(), pet.getName(), pet.getImageUrl());
    }

    public static AttackPetLoadoutResponse from(GuildWarAttackRecommendationPet row) {
        return from(row.getCatalogPet());
    }
}
