package com.sevenknights.community.domain.guildwar.defense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuildWarDefenseGuideMemberRepository extends JpaRepository<GuildWarDefenseGuideMember, Long> {

    List<GuildWarDefenseGuideMember> findByDefenseGuideIdOrderBySlotOrderAsc(Long defenseGuideId);
}
