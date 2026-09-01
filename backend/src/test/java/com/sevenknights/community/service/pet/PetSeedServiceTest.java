package com.sevenknights.community.service.pet;

import com.sevenknights.community.domain.pet.Pet;
import com.sevenknights.community.domain.pet.PetCatalogRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PetSeedServiceTest {

    @Autowired
    private PetSeedService petSeedService;

    @Autowired
    private PetCatalogRepository petCatalogRepository;

    @Test
    void seedsFourteenPetsWithoutDuplicates() {
        PetSeedResult first = petSeedService.seed();
        PetSeedResult second = petSeedService.seed();

        assertThat(first.totalInFile()).isEqualTo(14);
        assertThat(first.inserted()).isEqualTo(14);
        assertThat(first.totalInDatabase()).isEqualTo(14);
        assertThat(second.inserted()).isZero();
        assertThat(second.unchanged()).isEqualTo(14);
        assertThat(petCatalogRepository.count()).isEqualTo(14);

        Set<String> slugs = petCatalogRepository.findAll().stream()
                .map(Pet::getSlug)
                .collect(Collectors.toSet());
        assertThat(slugs).hasSize(14);
        assertThat(slugs).contains("dello", "eirin", "merparrow", "windy");

        Pet dello = petCatalogRepository.findBySlug("dello").orElseThrow();
        assertThat(dello.getName()).isEqualTo("델로");
        assertThat(dello.getImageUrl()).isEqualTo("/images/pet/dello.webp");
    }
}
