package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMemberRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamRepository;
import com.sevenknights.community.dto.guildwar.attack.AttackRecommendationRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackTeamMemberRequest;
import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.guildwar.character.GameCharacterRepository;
import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamMemberResponse;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamUpsertRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * 상대 방어팀 편성 — Hero 신규 저장과 GameCharacter 구버전 호환을 검증한다.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class EnemyTeamMemberHeroSaveTest {

    @Autowired
    private EnemyTeamAdminService enemyTeamAdminService;

    @Autowired
    private GuildWarEnemyTeamRepository enemyTeamRepository;

    @Autowired
    private GuildWarEnemyTeamMemberRepository enemyTeamMemberRepository;

    @Autowired
    private HeroRepository heroRepository;

    @Autowired
    private GameCharacterRepository gameCharacterRepository;

    private Long heroId;

    @BeforeEach
    void setUp() {
        Hero hero = heroRepository.save(
                Hero.builder()
                        .name("루디")
                        .slug("rudy")
                        .faction("seven_knights")
                        .imageUrl("/images/heroes/seven_knights/rudy/rudy.webp")
                        .build()
        );
        heroId = hero.getId();
    }

    @Test
    void savesEnemyMemberWithHeroIdAndNullCharacterId() {
        Long teamId = enemyTeamAdminService.save(new EnemyTeamUpsertRequest(
                "Hero 기반 방어팀",
                null,
                0,
                true,
                null,
                null,
                List.of(new EnemyTeamMemberRequest(heroId, 1)),
                List.of()
        ));

        GuildWarEnemyTeamMember member = enemyTeamMemberRepository.findByEnemyTeamIdOrderBySlotOrderAsc(teamId)
                .getFirst();

        assertThat(member.getHero()).isNotNull();
        assertThat(member.getHero().getId()).isEqualTo(heroId);
        assertThat(member.getCharacter()).isNull();
    }

    @Test
    void readsLegacyMemberWithCharacterIdWhenHeroIsNull() {
        GameCharacter legacyCharacter = gameCharacterRepository.save(
                GameCharacter.builder()
                        .name("구버전캐릭터")
                        .imageUrl("/legacy.png")
                        .build()
        );

        GuildWarEnemyTeam team = enemyTeamRepository.save(
                GuildWarEnemyTeam.builder()
                        .title("구버전 방어팀")
                        .sortOrder(0)
                        .isPublished(true)
                        .build()
        );
        team.getMembers().add(GuildWarEnemyTeamMember.builder()
                .enemyTeam(team)
                .hero(null)
                .character(legacyCharacter)
                .slotOrder(1)
                .build());
        enemyTeamRepository.save(team);

        GuildWarEnemyTeamMember loaded = enemyTeamMemberRepository.findByEnemyTeamIdOrderBySlotOrderAsc(team.getId())
                .getFirst();

        EnemyTeamMemberResponse response = EnemyTeamMemberResponse.from(loaded);

        assertThat(loaded.getHero()).isNull();
        assertThat(loaded.getCharacter()).isNotNull();
        assertThat(loaded.getCharacter().getId()).isEqualTo(legacyCharacter.getId());
        assertThat(response.characterId()).isEqualTo(legacyCharacter.getId());
        assertThat(response.characterName()).isEqualTo("구버전캐릭터");
        assertThat(response.characterImageUrl()).isEqualTo("/legacy.png");
    }

    @Test
    void savesAttackMemberWithHeroIdAndNullCharacterId() {
        Long teamId = enemyTeamAdminService.save(new EnemyTeamUpsertRequest(
                "추천 공격팀 Hero 저장",
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
                        List.of()
                ))
        ));

        var attackMember = enemyTeamRepository.findByIdWithMembers(teamId)
                .orElseThrow()
                .getRecommendations().getFirst()
                .getAttackTeamMembers().getFirst();

        assertThat(attackMember.getHero()).isNotNull();
        assertThat(attackMember.getHero().getId()).isEqualTo(heroId);
        assertThat(attackMember.getCharacter()).isNull();
    }

    @Test
    void readsNewMemberWithHeroIdViaResponse() {
        Long teamId = enemyTeamAdminService.save(new EnemyTeamUpsertRequest(
                "Hero 응답 검증",
                null,
                0,
                true,
                null,
                null,
                List.of(new EnemyTeamMemberRequest(heroId, 1)),
                List.of()
        ));

        GuildWarEnemyTeamMember member = enemyTeamMemberRepository.findByEnemyTeamIdOrderBySlotOrderAsc(teamId)
                .getFirst();
        EnemyTeamMemberResponse response = EnemyTeamMemberResponse.from(member);

        assertThat(response.characterId()).isEqualTo(heroId);
        assertThat(response.characterName()).isEqualTo("루디");
        assertThat(response.characterImageUrl()).contains("rudy");
    }
}
