package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.guildwar.master.Pet;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 상대 방어팀 하나에 대한 추천 공격안.
 * <p>
 * 같은 상대팀이라도 "고점수용 / 안정 픽"처럼 공격 조합·스킬 순서가 여러 벌이므로
 * EnemyTeam과 1:N으로 분리한다. 추천마다 독립된 공격 3인({@link GuildWarAttackTeamMember})과
 * 스킬 시퀀스({@link GuildWarSkillStep})를 갖는다.
 */
@Entity
@Table(name = "gw_attack_recommendations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarAttackRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enemy_team_id", nullable = false)
    private GuildWarEnemyTeam enemyTeam;

    @Column(length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int sortOrder;

    /** 추천 공격팀이 쓰는 펫(구버전 gw_pets FK). 신규 저장은 catalogPet만 쓴다. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    private Pet pet;

    /** 추천 공격팀 펫 — pets 카탈로그 FK. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_pet_id")
    private com.sevenknights.community.domain.pet.Pet catalogPet;

    /**
     * 구버전 문자열 저장. Hibernate가 컬럼을 지우지 않으므로 기존 행은 유지되고,
     * 공개 API는 pet FK가 있으면 마스터 값을, 없으면 이 컬럼을 사용한다.
     */
    @Column(name = "pet_name", length = 50)
    private String petName;

    @Column(name = "pet_image_url", length = 500)
    private String petImageUrl;

    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarAttackTeamMember> attackTeamMembers = new ArrayList<>();

    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarSkillStep> skillSteps = new ArrayList<>();

    /** 신규 다중 펫 — pets 카탈로그 조인 테이블. */
    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarAttackRecommendationPet> recommendationPets = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public GuildWarAttackRecommendation(
            GuildWarEnemyTeam enemyTeam,
            String title,
            String description,
            int sortOrder,
            Pet pet,
            com.sevenknights.community.domain.pet.Pet catalogPet,
            String petName,
            String petImageUrl
    ) {
        this.enemyTeam = enemyTeam;
        this.title = title;
        this.description = description;
        this.sortOrder = sortOrder;
        this.pet = pet;
        this.catalogPet = catalogPet;
        this.petName = petName;
        this.petImageUrl = petImageUrl;
    }

    /** 신규는 catalog_pet_id, 구버전은 pet_id(gw_pets). */
    public Long resolvePetId() {
        if (catalogPet != null) {
            return catalogPet.getId();
        }
        return pet != null ? pet.getId() : null;
    }

    public String resolvePetName() {
        if (catalogPet != null) {
            return catalogPet.getName();
        }
        return pet != null ? pet.getName() : petName;
    }

    public String resolvePetImageUrl() {
        if (catalogPet != null) {
            return catalogPet.getImageUrl();
        }
        return pet != null ? pet.getImageUrl() : petImageUrl;
    }
}
