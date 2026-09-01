package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.pet.Pet;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 추천 공격팀에 붙는 펫 한 줄. pets 카탈로그 FK만 쓴다.
 * 구버전 단일 catalog_pet_id·gw_pets FK는 recommendation 루트 컬럼에 남긴다.
 */
@Entity
@Table(name = "gw_attack_recommendation_pets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarAttackRecommendationPet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private GuildWarAttackRecommendation recommendation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "catalog_pet_id", nullable = false)
    private Pet catalogPet;

    @Column(nullable = false)
    private int sortOrder;

    @Builder
    public GuildWarAttackRecommendationPet(
            GuildWarAttackRecommendation recommendation,
            Pet catalogPet,
            int sortOrder
    ) {
        this.recommendation = recommendation;
        this.catalogPet = catalogPet;
        this.sortOrder = sortOrder;
    }
}
