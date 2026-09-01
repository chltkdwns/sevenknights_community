package com.sevenknights.community.domain.guildwar.master;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Long> {

    List<Pet> findByIsActiveTrueOrderByNameAsc();

    Optional<Pet> findByName(String name);
}
