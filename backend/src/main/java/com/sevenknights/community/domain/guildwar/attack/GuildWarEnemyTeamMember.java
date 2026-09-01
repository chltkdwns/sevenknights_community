package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.hero.Hero;
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
 * 상대 방어팀 구성원. 캐릭터 ID만이 아니라 {@code slotOrder}로 전열 위치를 보존한다.
 * 길드전은 좌·중·우 배치가 전략에 영향을 주므로, 정렬 가능한 목록이 아닌 슬롯 번호를 쓴다.
 */
@Entity
@Table(
        name = "gw_enemy_team_members",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_gw_enemy_team_members_team_slot",
                columnNames = {"enemy_team_id", "slot_order"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarEnemyTeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enemy_team_id", nullable = false)
    private GuildWarEnemyTeam enemyTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hero_id")
    private Hero hero;

    /** 구버전 상대 방어팀 편성. 신규 저장은 hero FK만 쓰고 character_id는 NULL이다. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "character_id", nullable = true)
    private GameCharacter character;

    @Column(nullable = false)
    private int slotOrder;

    @Builder
    public GuildWarEnemyTeamMember(GuildWarEnemyTeam enemyTeam, Hero hero, GameCharacter character, int slotOrder) {
        this.enemyTeam = enemyTeam;
        this.hero = hero;
        this.character = character;
        this.slotOrder = slotOrder;
    }
}
