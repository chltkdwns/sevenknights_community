package com.sevenknights.community.service.hero;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * {@code data/heroes-seed.json}을 읽어 heroes 테이블에 멱등으로 적재한다.
 * slug 기준으로 이미 있으면 이름·소속·이미지 경로만 갱신한다.
 */
@Service
@RequiredArgsConstructor
public class HeroSeedService {

    private static final String SEED_RESOURCE = "data/heroes-seed.json";

    private final HeroRepository heroRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public HeroSeedResult seed() {
        List<HeroSeedRecord> records = loadSeedRecords();
        validateSeedRecords(records);

        int inserted = 0;
        int updated = 0;
        int unchanged = 0;

        for (HeroSeedRecord record : records) {
            Hero existing = heroRepository.findBySlug(record.slug()).orElse(null);
            if (existing == null) {
                heroRepository.save(Hero.builder()
                        .name(record.name())
                        .slug(record.slug())
                        .faction(record.faction())
                        .imageUrl(record.imageUrl())
                        .build());
                inserted++;
                continue;
            }

            if (needsUpdate(existing, record)) {
                existing.updateProfile(record.name(), record.faction(), record.imageUrl());
                updated++;
            } else {
                unchanged++;
            }
        }

        return new HeroSeedResult(
                inserted,
                updated,
                unchanged,
                records.size(),
                heroRepository.count()
        );
    }

    private List<HeroSeedRecord> loadSeedRecords() {
        try (InputStream inputStream = new ClassPathResource(SEED_RESOURCE).getInputStream()) {
            return objectMapper.readValue(inputStream, new TypeReference<>() {
            });
        } catch (IOException exception) {
            throw new IllegalStateException("영웅 시드 파일을 읽지 못했습니다: " + SEED_RESOURCE, exception);
        }
    }

    /** slug·한글명 중복과 이미지 경로 형식만 검사한다. 인원수는 고정하지 않는다. */
    private static void validateSeedRecords(List<HeroSeedRecord> records) {
        Set<String> slugs = new HashSet<>();
        Set<String> names = new HashSet<>();
        for (HeroSeedRecord record : records) {
            if (!slugs.add(record.slug())) {
                throw new IllegalStateException("시드 slug 중복: " + record.slug());
            }
            if (!names.add(record.name())) {
                throw new IllegalStateException("시드 한글명 중복: " + record.name());
            }
            String expectedPath = "/images/heroes/" + record.faction() + "/" + record.slug() + "/" + record.slug() + ".webp";
            if (!Objects.equals(expectedPath, record.imageUrl())) {
                throw new IllegalStateException("이미지 경로 불일치: " + record.slug());
            }
        }
    }

    private static boolean needsUpdate(Hero existing, HeroSeedRecord record) {
        return !Objects.equals(existing.getName(), record.name())
                || !Objects.equals(existing.getFaction(), record.faction())
                || !Objects.equals(existing.getImageUrl(), record.imageUrl());
    }
}
