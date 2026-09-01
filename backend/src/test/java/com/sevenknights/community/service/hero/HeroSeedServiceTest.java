package com.sevenknights.community.service.hero;

import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
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
class HeroSeedServiceTest {

    @Autowired
    private HeroSeedService heroSeedService;

    @Autowired
    private HeroRepository heroRepository;

    @Test
    void seedsOneHundredThirteenHeroesWithoutDuplicates() {
        HeroSeedResult first = heroSeedService.seed();
        HeroSeedResult second = heroSeedService.seed();

        assertThat(first.totalInFile()).isEqualTo(118);
        assertThat(first.inserted()).isEqualTo(118);
        assertThat(first.totalInDatabase()).isEqualTo(118);
        assertThat(second.inserted()).isZero();
        assertThat(second.updated()).isZero();
        assertThat(second.unchanged()).isEqualTo(118);
        assertThat(heroRepository.count()).isEqualTo(118);

        Set<String> slugs = heroRepository.findAll().stream()
                .map(Hero::getSlug)
                .collect(Collectors.toSet());
        assertThat(slugs).hasSize(118);
        assertThat(slugs).contains("lania", "rudy", "Dwaeo", "trued", "nata", "sogyo", "espada", "sung_jinwoo");

        Hero trude = heroRepository.findBySlug("trued").orElseThrow();
        assertThat(trude.getName()).isEqualTo("트루드");

        Hero dwaeo = heroRepository.findBySlug("Dwaeo").orElseThrow();
        assertThat(dwaeo.getName()).isEqualTo("돼오");

        Hero nata = heroRepository.findBySlug("nata").orElseThrow();
        assertThat(nata.getName()).isEqualTo("나타");

        Hero sogyo = heroRepository.findBySlug("sogyo").orElseThrow();
        assertThat(sogyo.getName()).isEqualTo("소교");
    }
}
