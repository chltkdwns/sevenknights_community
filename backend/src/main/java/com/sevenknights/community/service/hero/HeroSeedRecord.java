package com.sevenknights.community.service.hero;

/**
 * {@code data/heroes-seed.json} 한 행.
 */
public record HeroSeedRecord(
        String slug,
        String name,
        String faction,
        String imageUrl
) {
}
