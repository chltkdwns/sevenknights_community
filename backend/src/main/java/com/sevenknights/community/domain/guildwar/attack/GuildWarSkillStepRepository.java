package com.sevenknights.community.domain.guildwar.attack;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;



import java.util.List;



public interface GuildWarSkillStepRepository extends JpaRepository<GuildWarSkillStep, Long> {



    List<GuildWarSkillStep> findByRecommendationIdOrderByStepOrderAsc(Long recommendationId);



    /**

     * 공개 상세 3단계: 팀 소속 모든 스킬 스텝 + 스킬 + 캐릭터를 한 번에 적재한다.

     */

    @Query("""

            SELECT ss FROM GuildWarSkillStep ss

            JOIN FETCH ss.skill s

            JOIN FETCH s.character

            JOIN ss.recommendation r

            WHERE r.enemyTeam.id = :enemyTeamId

            ORDER BY r.sortOrder ASC, ss.stepOrder ASC

            """)

    List<GuildWarSkillStep> findAllByEnemyTeamIdWithSkillAndCharacter(@Param("enemyTeamId") Long enemyTeamId);

}

