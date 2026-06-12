package com.sevenknights.community.domain.guildwar.attack;

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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Column(nullable = false)
    private int slotOrder;

    @Builder
    public GuildWarAttackTeamMember(
            GuildWarAttackRecommendation recommendation,
            GameCharacter character,
            int slotOrder
    ) {
        this.recommendation = recommendation;
        this.character = character;
        this.slotOrder = slotOrder;
    }
}
