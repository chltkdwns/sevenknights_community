package com.sevenknights.community.service.hero;

public record HeroSeedResult(
        int inserted,
        int updated,
        int unchanged,
        int totalInFile,
        long totalInDatabase
) {
}
