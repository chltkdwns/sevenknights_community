package com.sevenknights.community.domain.guildwar.master;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    List<Equipment> findByIsActiveTrueOrderByNameAsc();

    Optional<Equipment> findByName(String name);
}
