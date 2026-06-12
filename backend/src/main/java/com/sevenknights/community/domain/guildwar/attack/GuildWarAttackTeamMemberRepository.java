package com.sevenknights.community.domain.guildwar.attack;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuildWarAttackTeamMemberRepository extends JpaRepository<GuildWarAttackTeamMember, Long> {

    List<GuildWarAttackTeamMember> findByRecommendationIdOrderBySlotOrderAsc(Long recommendationId);
}
