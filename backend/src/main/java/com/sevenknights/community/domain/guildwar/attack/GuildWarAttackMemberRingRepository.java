package com.sevenknights.community.domain.guildwar.attack;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface GuildWarAttackMemberRingRepository extends JpaRepository<GuildWarAttackMemberRing, Long> {

    @Query("""
            SELECT r FROM GuildWarAttackMemberRing r
            JOIN FETCH r.ring
            WHERE r.member.id IN :memberIds
            ORDER BY r.member.id ASC, r.sortOrder ASC
            """)
    List<GuildWarAttackMemberRing> findByMemberIdInWithRing(@Param("memberIds") Collection<Long> memberIds);
}
