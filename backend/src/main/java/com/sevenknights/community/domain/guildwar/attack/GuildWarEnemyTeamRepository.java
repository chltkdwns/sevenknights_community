package com.sevenknights.community.domain.guildwar.attack;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;



import java.util.List;

import java.util.Optional;



public interface GuildWarEnemyTeamRepository extends JpaRepository<GuildWarEnemyTeam, Long> {



    List<GuildWarEnemyTeam> findByIsPublishedTrueOrderBySortOrderAsc();



    List<GuildWarEnemyTeam> findAllByOrderBySortOrderAsc();



    /**

     * 공개 목록: 노출된 팀 + 상대 편성원 + 캐릭터를 한 번에 적재한다.

     * recommendations는 목록에 불필요하므로 fetch하지 않아 카테시안 곱·N+1을 피한다.

     */

    @Query("""

            SELECT DISTINCT t FROM GuildWarEnemyTeam t

            LEFT JOIN FETCH t.members m

            LEFT JOIN FETCH m.character

            WHERE t.isPublished = true

            ORDER BY t.sortOrder ASC

            """)

    List<GuildWarEnemyTeam> findPublishedAllWithMembers();



    /**

     * 공개 상세 1단계: 노출 여부를 DB에서 먼저 걸러 미발행 초안이 id로 유출되지 않게 한다.

     */

    @Query("""

            SELECT t FROM GuildWarEnemyTeam t

            LEFT JOIN FETCH t.members m

            LEFT JOIN FETCH m.character

            WHERE t.id = :id AND t.isPublished = true

            """)

    Optional<GuildWarEnemyTeam> findPublishedByIdWithMembers(@Param("id") Long id);

}

