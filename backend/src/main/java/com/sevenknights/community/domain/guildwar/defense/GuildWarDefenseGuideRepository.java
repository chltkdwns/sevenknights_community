package com.sevenknights.community.domain.guildwar.defense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuildWarDefenseGuideRepository extends JpaRepository<GuildWarDefenseGuide, Long> {

    List<GuildWarDefenseGuide> findByIsPublishedTrueOrderBySortOrderAsc();

    List<GuildWarDefenseGuide> findAllByOrderBySortOrderAsc();
}
