package com.sevenknights.community.domain.hero;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HeroRepository extends JpaRepository<Hero, Long> {

    List<Hero> findByIsActiveTrueOrderByNameAsc();

    Optional<Hero> findBySlug(String slug);

    boolean existsBySlug(String slug);

    long countByIsActiveTrue();
}
