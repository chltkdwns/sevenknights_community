package com.sevenknights.community.domain.guildwar.attack;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface GuildWarAttackMemberEquipmentRepository extends JpaRepository<GuildWarAttackMemberEquipment, Long> {

    @Query("""
            SELECT e FROM GuildWarAttackMemberEquipment e
            JOIN FETCH e.equipment
            WHERE e.member.id IN :memberIds
            ORDER BY e.member.id ASC, e.sortOrder ASC
            """)
    List<GuildWarAttackMemberEquipment> findByMemberIdInWithEquipment(@Param("memberIds") Collection<Long> memberIds);
}
