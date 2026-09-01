package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.hero.Hero;
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
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 추천안별 공격 3인 편성. EnemyTeamMember와 구조는 같지만 소속이 Recommendation이다.
 * 추천마다 공격 조합이 달라지므로 EnemyTeam에 직접 붙이지 않는다.
 */
@Entity
@Table(
        name = "gw_attack_team_members",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_gw_attack_team_members_rec_slot",
                columnNames = {"recommendation_id", "slot_order"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarAttackTeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private GuildWarAttackRecommendation recommendation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hero_id")
    private Hero hero;

    /** 구버전 추천 공격팀 편성. 신규 저장은 hero FK만 쓰고 character_id는 NULL이다. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = true)
    private GameCharacter character;

    @Column(nullable = false)
    private int slotOrder;

    /** 이 슬롯의 장비들. 이름/이미지는 Equipment 마스터, 여기에는 ID와 순서만 둔다. */
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarAttackMemberEquipment> equipments = new ArrayList<>();

    /** 이 슬롯의 반지들. 반지 ID + 세공 문자열. */
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarAttackMemberRing> rings = new ArrayList<>();

    /** 구버전 단일 장비/반지 문자열. 컬럼은 유지하고 신규 저장은 조인 테이블만 사용한다. */
    @Column(name = "equipment_image_url", length = 500)
    private String equipmentImageUrl;

    @Column(name = "equipment_set_name", length = 80)
    private String equipmentSetName;

    @Column(name = "ring_image_url", length = 500)
    private String ringImageUrl;

    @Column(name = "ring_name", length = 80)
    private String ringName;

    @Column(name = "ring_enchantment", length = 255)
    private String ringEnchantment;

    /** 추천 공격팀 슬롯별 선택 설명 — 없으면 공개 UI에서 숨긴다. */
    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder
    public GuildWarAttackTeamMember(
            GuildWarAttackRecommendation recommendation,
            Hero hero,
            GameCharacter character,
            int slotOrder,
            String equipmentImageUrl,
            String equipmentSetName,
            String ringImageUrl,
            String ringName,
            String ringEnchantment,
            String description
    ) {
        this.recommendation = recommendation;
        this.hero = hero;
        this.character = character;
        this.slotOrder = slotOrder;
        this.equipmentImageUrl = equipmentImageUrl;
        this.equipmentSetName = equipmentSetName;
        this.ringImageUrl = ringImageUrl;
        this.ringName = ringName;
        this.ringEnchantment = ringEnchantment;
        this.description = description;
    }
}
