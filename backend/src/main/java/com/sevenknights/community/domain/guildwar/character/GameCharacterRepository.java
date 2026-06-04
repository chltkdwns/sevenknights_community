package com.sevenknights.community.domain.guildwar.character;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameCharacterRepository extends JpaRepository<GameCharacter, Long> {

    List<GameCharacter> findByIsActiveTrueOrderByNameAsc();

    List<GameCharacter> findAllByOrderByNameAsc();

    Optional<GameCharacter> findByName(String name);

    boolean existsByName(String name);
}
