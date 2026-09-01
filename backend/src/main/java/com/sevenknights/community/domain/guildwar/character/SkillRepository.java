package com.sevenknights.community.domain.guildwar.character;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByCharacterIdOrderBySortOrderAsc(Long characterId);

    List<Skill> findByCharacterIdAndIsActiveTrueOrderBySortOrderAsc(Long characterId);

    List<Skill> findByCharacterIdInAndIsActiveTrueOrderBySortOrderAsc(Iterable<Long> characterIds);

    Optional<Skill> findByCharacterIdAndSortOrder(Long characterId, int sortOrder);
}
