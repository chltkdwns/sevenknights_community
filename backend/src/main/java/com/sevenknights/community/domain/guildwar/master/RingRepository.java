package com.sevenknights.community.domain.guildwar.master;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RingRepository extends JpaRepository<Ring, Long> {

    List<Ring> findByIsActiveTrueOrderByNameAsc();

    Optional<Ring> findByName(String name);
}
