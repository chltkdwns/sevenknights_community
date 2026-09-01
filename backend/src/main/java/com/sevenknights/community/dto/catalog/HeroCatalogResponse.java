package com.sevenknights.community.dto.catalog;

import com.sevenknights.community.domain.hero.Hero;

/** 영웅 카탈로그(heroes) 조회 응답. */
public record HeroCatalogResponse(
        Long id,
        String name,
        String slug,
        String faction,
        String imageUrl,
        boolean isActive
) {
    public static HeroCatalogResponse from(Hero hero) {
        return new HeroCatalogResponse(
                hero.getId(),
                hero.getName(),
                hero.getSlug(),
                hero.getFaction(),
                hero.getImageUrl(),
                hero.isActive()
        );
    }
}
