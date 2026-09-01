package com.sevenknights.community.service.pet;

public record PetSeedResult(
        int inserted,
        int updated,
        int unchanged,
        int totalInFile,
        long totalInDatabase
) {
}
