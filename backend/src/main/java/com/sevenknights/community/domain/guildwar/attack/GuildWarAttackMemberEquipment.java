package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.guildwar.master.Equipment;
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
 * 추천 공격 캐릭터 1명이 착용하는 장비 한 줄.
 * <p>
 * 멤버:장비 = 1:N. 같은 장비를 두 줄로 넣을 수 있고, {@code sortOrder}가 화면 순서다.
 * 장비명·이미지는 {@link com.sevenknights.community.domain.guildwar.master.Equipment}에서 읽는다.
 */
@Entity
@Table(name = "gw_attack_member_equipments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarAttackMemberEquipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attack_team_member_id", nullable = false)
    private GuildWarAttackTeamMember member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(nullable = false)
    private int sortOrder;

    @Builder
    public GuildWarAttackMemberEquipment(
            GuildWarAttackTeamMember member,
            Equipment equipment,
            int sortOrder
    ) {
        this.member = member;
        this.equipment = equipment;
        this.sortOrder = sortOrder;
    }
}
