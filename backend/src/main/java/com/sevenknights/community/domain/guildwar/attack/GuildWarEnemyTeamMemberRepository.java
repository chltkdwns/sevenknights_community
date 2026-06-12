package com.sevenknights.community.domain.guildwar.attack;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuildWarEnemyTeamMemberRepository extends JpaRepository<GuildWarEnemyTeamMember, Long> {

    List<GuildWarEnemyTeamMember> findByEnemyTeamIdOrderBySlotOrderAsc(Long enemyTeamId);
}
