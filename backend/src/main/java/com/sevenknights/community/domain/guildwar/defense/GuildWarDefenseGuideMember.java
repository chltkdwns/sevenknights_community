package com.sevenknights.community.domain.guildwar.defense;

import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 방어 가이드 편성원. 공격 쪽 Member와 동일하게 slotOrder로 전열을 표현하되,
 * 스킬 스텝·추천안 하위 구조는 방어 UX에 없어 이 엔티티까지만 둔다.
 */
@Entity
@Table(
        name = "gw_defense_guide_members",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_gw_defense_guide_members_guide_slot",
                columnNames = {"defense_guide_id", "slot_order"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarDefenseGuideMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "defense_guide_id", nullable = false)
    private GuildWarDefenseGuide defenseGuide;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Column(nullable = false)
    private int slotOrder;

    @Builder
    public GuildWarDefenseGuideMember(
            GuildWarDefenseGuide defenseGuide,
            GameCharacter character,
            int slotOrder
    ) {
        this.defenseGuide = defenseGuide;
        this.character = character;
        this.slotOrder = slotOrder;
    }
}
