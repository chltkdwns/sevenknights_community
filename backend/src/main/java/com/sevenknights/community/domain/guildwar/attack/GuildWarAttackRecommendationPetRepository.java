package com.sevenknights.community.domain.guildwar.attack;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GuildWarAttackRecommendationPetRepository extends JpaRepository<GuildWarAttackRecommendationPet, Long> {

    @Query("""
            SELECT rp FROM GuildWarAttackRecommendationPet rp
            JOIN FETCH rp.catalogPet
            WHERE rp.recommendation.id IN :recommendationIds
            ORDER BY rp.sortOrder ASC
            """)
    List<GuildWarAttackRecommendationPet> findByRecommendationIdInWithCatalogPet(
            @Param("recommendationIds") List<Long> recommendationIds
    );
}
