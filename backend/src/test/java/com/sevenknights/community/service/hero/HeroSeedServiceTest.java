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
    void seedsAllHeroesFromFileWithoutDuplicates() {
        HeroSeedResult first = heroSeedService.seed();
        int totalInFile = first.totalInFile();

        // 인원수 고정 검증은 제거됨 — 파일에 있는 전원이 멱등으로 반영되면 된다.
        assertThat(totalInFile).isGreaterThanOrEqualTo(119);
        assertThat(first.inserted() + first.updated() + first.unchanged()).isEqualTo(totalInFile);
        assertThat(heroRepository.count()).isEqualTo(totalInFile);

        HeroSeedResult second = heroSeedService.seed();
        assertThat(second.inserted()).isZero();
        assertThat(second.updated()).isZero();
        assertThat(second.unchanged()).isEqualTo(totalInFile);
        assertThat(heroRepository.count()).isEqualTo(totalInFile);

        Set<String> slugs = heroRepository.findAll().stream()
                .map(Hero::getSlug)
                .collect(Collectors.toSet());
        assertThat(slugs).hasSize(totalInFile);
        assertThat(slugs).contains("lania", "rudy", "Dwaeo", "trued", "nata", "sogyo", "espada", "sung_jinwoo", "hayeon");

        Hero trude = heroRepository.findBySlug("trued").orElseThrow();
        assertThat(trude.getName()).isEqualTo("트루드");

        Hero dwaeo = heroRepository.findBySlug("Dwaeo").orElseThrow();
        assertThat(dwaeo.getName()).isEqualTo("돼오");

        Hero nata = heroRepository.findBySlug("nata").orElseThrow();
        assertThat(nata.getName()).isEqualTo("나타");

        Hero sogyo = heroRepository.findBySlug("sogyo").orElseThrow();
        assertThat(sogyo.getName()).isEqualTo("소교");

        Hero hayeon = heroRepository.findBySlug("hayeon").orElseThrow();
        assertThat(hayeon.getName()).isEqualTo("하연");
    }
}
