package com.sevenknights.community.dto.catalog;

import com.sevenknights.community.domain.pet.Pet;

/** 펫 카탈로그(pets) 조회 응답. gw_pets와 별개다. */
public record PetCatalogResponse(
        Long id,
        String name,
        String slug,
        String imageUrl,
        boolean isActive
) {
    public static PetCatalogResponse from(Pet pet) {
        return new PetCatalogResponse(
                pet.getId(),
                pet.getName(),
                pet.getSlug(),
                pet.getImageUrl(),
                pet.isActive()
        );
    }
}
