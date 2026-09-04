package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendationRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMemberRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStepRepository;
import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
import com.sevenknights.community.dto.guildwar.attack.AttackRecommendationRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamUpsertRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EnemyTeamAdminDeleteTest {

    @Autowired
    private EnemyTeamAdminService enemyTeamAdminService;

    @Autowired
    private GuildWarEnemyTeamRepository enemyTeamRepository;

    @Autowired
    private GuildWarEnemyTeamMemberRepository enemyTeamMemberRepository;

    @Autowired
    private GuildWarAttackRecommendationRepository recommendationRepository;

    @Autowired
    private GuildWarSkillStepRepository skillStepRepository;

    @Autowired
    private HeroRepository heroRepository;

    private Long heroId;

    @BeforeEach
    void setUp() {
        Hero hero = heroRepository.save(
                Hero.builder()
                        .name("루디")
                        .slug("rudy-delete")
                        .faction("seven_knights")
                        .imageUrl("/images/heroes/seven_knights/rudy/rudy.webp")
                        .build()
        );
        heroId = hero.getId();
    }

    @Test
    void deletesEnemyTeamWithMembersAndRecommendations() {
        Long teamId = enemyTeamAdminService.save(new EnemyTeamUpsertRequest(
                "삭제 대상 방어팀",
                null,
                0,
                true,
                null,
                null,
                List.of(new EnemyTeamMemberRequest(heroId, 1)),
                List.of(new AttackRecommendationRequest(
                        "추천 1",
                        null,
                        0,
                        null,
                        List.of(),
                        List.of(new AttackTeamMemberRequest(heroId, 1, null, List.of(), List.of())),
                        List.of()
                ))
        ));

        assertThat(enemyTeamRepository.findById(teamId)).isPresent();
        assertThat(enemyTeamMemberRepository.findByEnemyTeamIdOrderBySlotOrderAsc(teamId)).isNotEmpty();
        assertThat(recommendationRepository.findByEnemyTeamIdWithAttackMembers(teamId)).isNotEmpty();

        enemyTeamAdminService.delete(teamId);

        assertThat(enemyTeamRepository.findById(teamId)).isEmpty();
        assertThat(enemyTeamMemberRepository.findByEnemyTeamIdOrderBySlotOrderAsc(teamId)).isEmpty();
        assertThat(recommendationRepository.findByEnemyTeamIdWithAttackMembers(teamId)).isEmpty();
        assertThat(skillStepRepository.findAllByEnemyTeamIdWithSkillAndCharacter(teamId)).isEmpty();
    }
}
