package com.sevenknights.community.domain.guildwar.attack;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import org.springframework.data.repository.query.Param;



import java.util.List;



public interface GuildWarAttackRecommendationRepository extends JpaRepository<GuildWarAttackRecommendation, Long> {



    List<GuildWarAttackRecommendation> findByEnemyTeamIdOrderBySortOrderAsc(Long enemyTeamId);



    /**

     * 공개 상세 2단계: 추천안 + 펫 + 공격 편성원 + 캐릭터만 fetch.
     * skillSteps·장비·반지는 별도 쿼리로 적재한다.
     * 한 JPQL에서 bag를 여러 개 fetch하면 Hibernate 제약·카테시안 곱이 난다.
     * pet은 ToOne이라 members bag와 같이 fetch해도 된다.
     * skill_id가 null인 "스킬 사용 X" 행도 가져와야 해서 skill은 LEFT JOIN FETCH.
     */

    @Query("""
            SELECT DISTINCT r FROM GuildWarAttackRecommendation r
            LEFT JOIN FETCH r.pet
            LEFT JOIN FETCH r.catalogPet
            LEFT JOIN FETCH r.attackTeamMembers atm
            LEFT JOIN FETCH atm.character
            LEFT JOIN FETCH atm.hero
            WHERE r.enemyTeam.id = :enemyTeamId
            ORDER BY r.sortOrder ASC
            """)

    List<GuildWarAttackRecommendation> findByEnemyTeamIdWithAttackMembers(@Param("enemyTeamId") Long enemyTeamId);

}

