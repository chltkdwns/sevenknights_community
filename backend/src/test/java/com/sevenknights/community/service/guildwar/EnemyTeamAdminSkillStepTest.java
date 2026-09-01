package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStepRepository;
import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.guildwar.character.GameCharacterRepository;
import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillRepository;
import com.sevenknights.community.domain.guildwar.character.SkillType;
import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
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

/**
 * 스킬 사용 X 선택 시 skill_id null 행을 저장하지 않는지 검증한다.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EnemyTeamAdminSkillStepTest {

    @Autowired
    private EnemyTeamAdminService enemyTeamAdminService;

    @Autowired
    private GameCharacterRepository gameCharacterRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private GuildWarSkillStepRepository skillStepRepository;

    @Autowired
    private HeroRepository heroRepository;

    private Long characterId;
    private Long heroId;
    private Long skillA;
    private Long skillB;
    private Long skillC;

    @BeforeEach
    void setUp() {
        GameCharacter character = gameCharacterRepository.save(
                GameCharacter.builder()
                        .name("테스트캐릭터")
                        .imageUrl("/test.png")
                        .build()
        );
        characterId = character.getId();

        Hero hero = heroRepository.save(
                Hero.builder()
                        .name("테스트캐릭터")
                        .slug("test-hero")
                        .faction("test")
                        .imageUrl("/test-hero.png")
                        .build()
        );
        heroId = hero.getId();

        skillA = saveSkill(character, SkillType.SKILL_1, "스킬A", 1);
        skillB = saveSkill(character, SkillType.SKILL_2, "스킬B", 2);
        skillC = saveSkill(character, SkillType.AWAKENING, "스킬C", 3);
    }

    @Test
    void savesThreeSkillsWhenAllSelected() {
        Long teamId = enemyTeamAdminService.save(requestWithSteps(
                step(1, skillA),
                step(2, skillB),
                step(3, skillC)
        ));

        List<GuildWarSkillStep> steps = loadSteps(teamId);
        assertThat(steps).hasSize(3);
        assertThat(steps).extracting(s -> s.getSkill().getId()).containsExactly(skillA, skillB, skillC);
    }

    @Test
    void stopsBeforeSkipWithoutNullSkillRow() {
        Long teamId = enemyTeamAdminService.save(requestWithSteps(
                step(1, skillA),
                step(2, skillB),
                step(3, null)
        ));

        List<GuildWarSkillStep> steps = loadSteps(teamId);
        assertThat(steps).hasSize(2);
        assertThat(steps).extracting(s -> s.getSkill().getId()).containsExactly(skillA, skillB);
        assertThat(steps).allMatch(step -> step.getSkill() != null);
    }

    @Test
    void savesOnlyFirstSkillWhenSecondIsSkip() {
        Long teamId = enemyTeamAdminService.save(requestWithSteps(
                step(1, skillA),
                step(2, null)
        ));

        List<GuildWarSkillStep> steps = loadSteps(teamId);
        assertThat(steps).hasSize(1);
        assertThat(steps.getFirst().getSkill().getId()).isEqualTo(skillA);
    }

    private List<GuildWarSkillStep> loadSteps(Long teamId) {
        return skillStepRepository.findAll().stream()
                .filter(step -> step.getRecommendation().getEnemyTeam().getId().equals(teamId))
                .sorted((a, b) -> Integer.compare(a.getStepOrder(), b.getStepOrder()))
                .toList();
    }

    @Test
    void savesManualSkillNotesWithoutSkillId() {
        Long teamId = enemyTeamAdminService.save(new EnemyTeamUpsertRequest(
                "테스트 방어팀",
                null,
                0,
                true,
                null,
                null,
                List.of(new EnemyTeamMemberRequest(heroId, 1)),
                List.of(new AttackRecommendationRequest(
                        null,
                        null,
                        0,
                        null,
                        List.of(),
                        List.of(new AttackTeamMemberRequest(heroId, 1, null, List.of(), List.of())),
                        List.of(
                                new SkillStepRequest(1, null, "루디 1스킬"),
                                new SkillStepRequest(2, null, "관우 각성")
                        )
                ))
        ));

        List<GuildWarSkillStep> steps = loadSteps(teamId);
        assertThat(steps).hasSize(2);
        assertThat(steps).allMatch(step -> step.getSkill() == null);
        assertThat(steps).extracting(GuildWarSkillStep::getNote).containsExactly("루디 1스킬", "관우 각성");
    }

    private EnemyTeamUpsertRequest requestWithSteps(SkillStepRequest... skillSteps) {
        return new EnemyTeamUpsertRequest(
                "테스트 방어팀",
                null,
                0,
                true,
                null,
                null,
                List.of(new EnemyTeamMemberRequest(heroId, 1)),
                List.of(new AttackRecommendationRequest(
                        null,
                        null,
                        0,
                        null,
                        List.of(),
                        List.of(new AttackTeamMemberRequest(heroId, 1, null, List.of(), List.of())),
                        List.of(skillSteps)
                ))
        );
    }

    private static SkillStepRequest step(int order, Long skillId) {
        return new SkillStepRequest(order, skillId, null);
    }

    private Long saveSkill(GameCharacter character, SkillType type, String name, int sortOrder) {
        return skillRepository.save(Skill.builder()
                .character(character)
                .skillType(type)
                .name(name)
                .imageUrl("/skill.png")
                .sortOrder(sortOrder)
                .build()).getId();
    }
}
