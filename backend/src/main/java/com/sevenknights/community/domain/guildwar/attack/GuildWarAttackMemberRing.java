package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.guildwar.master.Ring;
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
 * 추천 공격 캐릭터 1명의 반지 한 줄.
 * <p>
 * {@code ring_id}는 반지 마스터, {@code enchantment}는 이 추천안에서만 쓰는 세공 설명이다.
 * 세공은 옵션 테이블이 아니라 관리자가 입력한 자유 문자열이다.
 */
@Entity
@Table(name = "gw_attack_member_rings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarAttackMemberRing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attack_team_member_id", nullable = false)
    private GuildWarAttackTeamMember member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ring_id", nullable = false)
    private Ring ring;

    /** 이 추천안에서만 쓰는 세공 설명. 반지 마스터 옵션이 아님. */
    @Column(length = 255)
    private String enchantment;

    @Column(nullable = false)
    private int sortOrder;

    @Builder
    public GuildWarAttackMemberRing(
            GuildWarAttackTeamMember member,
            Ring ring,
            String enchantment,
            int sortOrder
    ) {
        this.member = member;
        this.ring = ring;
        this.enchantment = enchantment;
        this.sortOrder = sortOrder;
    }
}
