package com.sevenknights.community.service.catalog;

import com.sevenknights.community.service.hero.HeroSeedService;
import com.sevenknights.community.service.pet.PetSeedService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CatalogAdminServiceTest {

    @Autowired
    private CatalogAdminService catalogAdminService;

    @Autowired
    private HeroSeedService heroSeedService;

    @Autowired
    private PetSeedService petSeedService;

    @BeforeEach
    void seedCatalogs() {
        heroSeedService.seed();
        petSeedService.seed();
    }

    @Test
    void listsActiveHeroesAndPetsFromCatalog() {
        assertThat(catalogAdminService.listActiveHeroes()).hasSize(118);
        assertThat(catalogAdminService.listActivePets()).hasSize(14);
    }
}
