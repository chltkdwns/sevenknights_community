package com.sevenknights.community.domain.guildwar.attack;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;



import java.util.List;



public interface GuildWarAttackRecommendationRepository extends JpaRepository<GuildWarAttackRecommendation, Long> {



    List<GuildWarAttackRecommendation> findByEnemyTeamIdOrderBySortOrderAsc(Long enemyTeamId);



    /**

     * 공개 상세 2단계: 추천안 + 공격 편성원 + 캐릭터만 fetch.

     * skillSteps는 별도 쿼리로 적재한다 — 한 JPQL에서 bag 2개를 fetch하면 Hibernate 제약·카테시안 곱이 난다.

     */

    @Query("""

            SELECT DISTINCT r FROM GuildWarAttackRecommendation r

            LEFT JOIN FETCH r.attackTeamMembers atm

            LEFT JOIN FETCH atm.character

            WHERE r.enemyTeam.id = :enemyTeamId

            ORDER BY r.sortOrder ASC

            """)

    List<GuildWarAttackRecommendation> findByEnemyTeamIdWithAttackMembers(@Param("enemyTeamId") Long enemyTeamId);

}

