package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamRepository;
import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
import com.sevenknights.community.dto.guildwar.attack.AttackMemberEquipmentRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackMemberRingRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackRecommendationRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamUpsertRequest;
import com.sevenknights.community.dto.guildwar.attack.SkillStepRequest;
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
class EnemyTeamAdminReorderAndCustomLoadoutTest {

    @Autowired
    private EnemyTeamAdminService enemyTeamAdminService;

    @Autowired
    private GuildWarEnemyTeamRepository enemyTeamRepository;

    @Autowired
    private HeroRepository heroRepository;

    private Long heroId;

    @BeforeEach
    void setUp() {
        Hero hero = heroRepository.save(
                Hero.builder()
                        .name("루디")
                        .slug("rudy-reorder")
                        .faction("seven_knights")
                        .imageUrl("/rudy.png")
                        .build()
        );
        heroId = hero.getId();
    }

    @Test
    void reordersEnemyTeamsBySortOrderOnly() {
        Long firstId = saveTeam("팀 A", 0);
        Long secondId = saveTeam("팀 B", 1);
        Long thirdId = saveTeam("팀 C", 2);

        enemyTeamAdminService.reorder(List.of(thirdId, firstId, secondId));

        List<GuildWarEnemyTeam> teams = enemyTeamRepository.findAllByOrderBySortOrderAsc();
        assertThat(teams).extracting(GuildWarEnemyTeam::getId).containsExactly(thirdId, firstId, secondId);
        assertThat(teams).extracting(GuildWarEnemyTeam::getSortOrder).containsExactly(0, 1, 2);
    }

    @Test
    void savesCustomEquipmentAndRingNames() {
        Long teamId = enemyTeamAdminService.save(
                new EnemyTeamUpsertRequest(
                        "커스텀 로드아웃",
                        null,
                        0,
                        true,
                        null,
                        null,
                        List.of(new EnemyTeamMemberRequest(heroId, 1)),
                        List.of(
                                new AttackRecommendationRequest(
                                        "추천 1",
                                        null,
                                        0,
                                        null,
                                        List.of(),
                                        List.of(
                                                new AttackTeamMemberRequest(
                                                        heroId,
                                                        1,
                                                        null,
                                                        List.of(new AttackMemberEquipmentRequest(null, "직접 장비")),
                                                        List.of(new AttackMemberRingRequest(
                                                                null,
                                                                "직접 반지",
                                                                "세공 문구"
                                                        ))
                                                )
                                        ),
                                        List.of(new SkillStepRequest(1, null, "스킬1"))
                                )
                        )
                )
        );

        GuildWarEnemyTeam team = enemyTeamRepository.findById(teamId).orElseThrow();
        var member = team.getRecommendations().get(0).getAttackTeamMembers().get(0);

        assertThat(member.getEquipments()).hasSize(1);
        assertThat(member.getEquipments().get(0).getEquipment()).isNull();
        assertThat(member.getEquipments().get(0).getCustomName()).isEqualTo("직접 장비");

        assertThat(member.getRings()).hasSize(1);
        assertThat(member.getRings().get(0).getRing()).isNull();
        assertThat(member.getRings().get(0).getCustomName()).isEqualTo("직접 반지");
        assertThat(member.getRings().get(0).getEnchantment()).isEqualTo("세공 문구");
    }

    private Long saveTeam(String title, int sortOrder) {
        return enemyTeamAdminService.save(
                new EnemyTeamUpsertRequest(
                        title,
                        null,
                        sortOrder,
                        true,
                        null,
                        null,
                        List.of(new EnemyTeamMemberRequest(heroId, 1)),
                        List.of()
                )
        );
    }
}
