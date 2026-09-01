package com.sevenknights.community.domain.pet;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * {@code pets} 카탈로그 전용. 길드전 {@code gw_pets}용 PetRepository와 빈 이름이 겹치지 않게 분리한다.
 */
public interface PetCatalogRepository extends JpaRepository<Pet, Long> {

    List<Pet> findByIsActiveTrueOrderByNameAsc();

    Optional<Pet> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
