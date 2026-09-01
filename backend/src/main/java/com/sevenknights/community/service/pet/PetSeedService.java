package com.sevenknights.community.service.pet;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sevenknights.community.domain.pet.Pet;
import com.sevenknights.community.domain.pet.PetCatalogRepository;
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
 * {@code data/pets-seed.json}을 읽어 pets 테이블에 멱등으로 적재한다.
 */
@Service
@RequiredArgsConstructor
public class PetSeedService {

    private static final String SEED_RESOURCE = "data/pets-seed.json";
    private static final int EXPECTED_PET_COUNT = 14;

    private final PetCatalogRepository petCatalogRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public PetSeedResult seed() {
        List<PetSeedRecord> records = loadSeedRecords();
        validateSeedRecords(records);

        int inserted = 0;
        int updated = 0;
        int unchanged = 0;

        for (PetSeedRecord record : records) {
            Pet existing = petCatalogRepository.findBySlug(record.slug()).orElse(null);
            if (existing == null) {
                petCatalogRepository.save(Pet.builder()
                        .name(record.name())
                        .slug(record.slug())
                        .imageUrl(record.imageUrl())
                        .build());
                inserted++;
                continue;
            }

            if (needsUpdate(existing, record)) {
                existing.updateProfile(record.name(), record.imageUrl());
                updated++;
            } else {
                unchanged++;
            }
        }

        return new PetSeedResult(
                inserted,
                updated,
                unchanged,
                records.size(),
                petCatalogRepository.count()
        );
    }

    private List<PetSeedRecord> loadSeedRecords() {
        try (InputStream inputStream = new ClassPathResource(SEED_RESOURCE).getInputStream()) {
            return objectMapper.readValue(inputStream, new TypeReference<>() {
            });
        } catch (IOException exception) {
            throw new IllegalStateException("펫 시드 파일을 읽지 못했습니다: " + SEED_RESOURCE, exception);
        }
    }

    private static void validateSeedRecords(List<PetSeedRecord> records) {
        if (records.size() != EXPECTED_PET_COUNT) {
            throw new IllegalStateException(
                    "펫 시드 파일은 " + EXPECTED_PET_COUNT + "개여야 합니다. 현재: " + records.size()
            );
        }

        Set<String> slugs = new HashSet<>();
        Set<String> names = new HashSet<>();
        for (PetSeedRecord record : records) {
            if (!slugs.add(record.slug())) {
                throw new IllegalStateException("시드 slug 중복: " + record.slug());
            }
            if (!names.add(record.name())) {
                throw new IllegalStateException("시드 한글명 중복: " + record.name());
            }
            String expectedPath = "/images/pet/" + record.slug() + ".webp";
            if (!Objects.equals(expectedPath, record.imageUrl())) {
                throw new IllegalStateException("이미지 경로 불일치: " + record.slug());
            }
        }
    }

    private static boolean needsUpdate(Pet existing, PetSeedRecord record) {
        return !Objects.equals(existing.getName(), record.name())
                || !Objects.equals(existing.getImageUrl(), record.imageUrl());
    }
}
