package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendation;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackTeamMember;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.guildwar.character.GameCharacterRepository;
import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillRepository;
import com.sevenknights.community.dto.guildwar.attack.AttackRecommendationRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamUpsertRequest;
import com.sevenknights.community.dto.guildwar.attack.SkillStepRequest;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 상대 방어팀 Aggregate 저장·수정.
 * <p>
 * 수정은 PUT 한 번에 트리 전체를 교체한다. 행 단위 PATCH·id 유지 diff 대신
 * {@code clear() + 재구성}을 택한 이유:
 * <ul>
 *   <li>관리자 폼은 항상 "현재 화면 상태 전체"를 내므로 요청·DB 상태를 1:1로 맞추기 쉽다.</li>
 *   <li>추천 삭제·스킬 스텝 재정렬 시 고아 행·순서 꼬임을 orphanRemoval에 맡길 수 있다.</li>
 *   <li>MVP 트래픽·데이터 규모에서는 구현 단순성이 diff 알고리즘보다 우선이다.</li>
 * </ul>
 * 추후 추천·스텝이 수백 건 이상이거나 감사 로그가 필요하면 부분 업데이트·이벤트 소싱을 검토한다.
 */
@Service
@RequiredArgsConstructor
public class EnemyTeamAdminService {

    private final GuildWarEnemyTeamRepository enemyTeamRepository;
    private final GameCharacterRepository gameCharacterRepository;
    private final SkillRepository skillRepository;

    @Transactional
    public Long save(EnemyTeamUpsertRequest request) {
        validateRequest(request);

        Map<Long, GameCharacter> characterMap = loadCharacters(collectCharacterIds(request));
        Map<Long, Skill> skillMap = loadSkills(collectSkillIds(request));

        GuildWarEnemyTeam team = GuildWarEnemyTeam.builder()
                .title(request.title())
                .memo(request.memo())
                .sortOrder(request.sortOrder())
                .isPublished(request.isPublished())
                .petName(request.petName())
                .petImageUrl(request.petImageUrl())
                .build();

        applyMembers(team, request.members(), characterMap);
        applyRecommendations(team, request.recommendations(), characterMap, skillMap);

        return enemyTeamRepository.save(team).getId();
    }

    @Transactional
    public Long update(Long id, EnemyTeamUpsertRequest request) {
        validateRequest(request);

        GuildWarEnemyTeam team = enemyTeamRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("상대 방어팀을 찾을 수 없습니다."));

        Map<Long, GameCharacter> characterMap = loadCharacters(collectCharacterIds(request));
        Map<Long, Skill> skillMap = loadSkills(collectSkillIds(request));

        team.update(
                request.title(),
                request.memo(),
                request.sortOrder(),
                request.isPublished(),
                request.petName(),
                request.petImageUrl()
        );

        // Aggregate 루트만 유지하고 하위는 전부 제거 후 재생성.
        // recommendations.clear() 시 attackTeamMembers·skillSteps도 cascade orphanRemoval로 삭제된다.
        team.getMembers().clear();
        team.getRecommendations().clear();

        applyMembers(team, request.members(), characterMap);
        applyRecommendations(team, request.recommendations(), characterMap, skillMap);

        return team.getId();
    }

    private void validateRequest(EnemyTeamUpsertRequest request) {
        validateNoDuplicateOrders(
                request.members().stream().map(EnemyTeamMemberRequest::slotOrder).toList(),
                "상대 방어팀 슬롯 순서가 중복되었습니다."
        );

        Set<Long> characterIds = new HashSet<>();
        Set<Long> skillIds = new HashSet<>();

        request.members().forEach(member -> characterIds.add(member.characterId()));

        for (AttackRecommendationRequest recommendation : request.recommendations()) {
            validateNoDuplicateOrders(
                    recommendation.attackTeamMembers().stream().map(AttackTeamMemberRequest::slotOrder).toList(),
                    "추천 공격팀 슬롯 순서가 중복되었습니다."
            );
            validateNoDuplicateOrders(
                    recommendation.skillSteps().stream().map(SkillStepRequest::stepOrder).toList(),
                    "스킬 순서가 중복되었습니다."
            );

            recommendation.attackTeamMembers().forEach(member -> characterIds.add(member.characterId()));
            recommendation.skillSteps().forEach(step -> skillIds.add(step.skillId()));

            // TODO MVP 제외: skillId가 이 추천의 attackTeamMembers에 실린 캐릭터 소속인지 검증.
            // 잘못된 skill_id 조합은 관리자 입력 실수로 간주하고, MVP에서는 존재 여부만 확인한다.
        }

        validateCharactersExist(characterIds);
        validateSkillsExist(skillIds);
    }

    private void validateNoDuplicateOrders(List<Integer> orders, String message) {
        long distinctCount = orders.stream().distinct().count();
        if (distinctCount != orders.size()) {
            throw new BadRequestException(message);
        }
    }

    private void validateCharactersExist(Set<Long> characterIds) {
        if (characterIds.isEmpty()) {
            return;
        }
        long foundCount = gameCharacterRepository.findAllById(characterIds).size();
        if (foundCount != characterIds.size()) {
            throw new BadRequestException("존재하지 않는 캐릭터가 포함되어 있습니다.");
        }
    }

    private void validateSkillsExist(Set<Long> skillIds) {
        if (skillIds.isEmpty()) {
            return;
        }
        long foundCount = skillRepository.findAllById(skillIds).size();
        if (foundCount != skillIds.size()) {
            throw new BadRequestException("존재하지 않는 스킬이 포함되어 있습니다.");
        }
    }

    private Set<Long> collectCharacterIds(EnemyTeamUpsertRequest request) {
        Set<Long> characterIds = new HashSet<>();
        request.members().forEach(member -> characterIds.add(member.characterId()));
        request.recommendations().forEach(recommendation ->
                recommendation.attackTeamMembers().forEach(member -> characterIds.add(member.characterId()))
        );
        return characterIds;
    }

    private Set<Long> collectSkillIds(EnemyTeamUpsertRequest request) {
        Set<Long> skillIds = new HashSet<>();
        request.recommendations().forEach(recommendation ->
                recommendation.skillSteps().forEach(step -> skillIds.add(step.skillId()))
        );
        return skillIds;
    }

    private Map<Long, GameCharacter> loadCharacters(Set<Long> characterIds) {
        return gameCharacterRepository.findAllById(characterIds).stream()
                .collect(Collectors.toMap(GameCharacter::getId, Function.identity()));
    }

    private Map<Long, Skill> loadSkills(Set<Long> skillIds) {
        return skillRepository.findAllById(skillIds).stream()
                .collect(Collectors.toMap(Skill::getId, Function.identity()));
    }

    private void applyMembers(
            GuildWarEnemyTeam team,
            List<EnemyTeamMemberRequest> members,
            Map<Long, GameCharacter> characterMap
    ) {
        for (EnemyTeamMemberRequest memberRequest : members) {
            team.getMembers().add(GuildWarEnemyTeamMember.builder()
                    .enemyTeam(team)
                    .character(characterMap.get(memberRequest.characterId()))
                    .slotOrder(memberRequest.slotOrder())
                    .build());
        }
    }

    private void applyRecommendations(
            GuildWarEnemyTeam team,
            List<AttackRecommendationRequest> recommendations,
            Map<Long, GameCharacter> characterMap,
            Map<Long, Skill> skillMap
    ) {
        for (AttackRecommendationRequest recommendationRequest : recommendations) {
            GuildWarAttackRecommendation recommendation = GuildWarAttackRecommendation.builder()
                    .enemyTeam(team)
                    .title(recommendationRequest.title())
                    .description(recommendationRequest.description())
                    .sortOrder(recommendationRequest.sortOrder())
                    .petName(recommendationRequest.petName())
                    .petImageUrl(recommendationRequest.petImageUrl())
                    .build();
            team.getRecommendations().add(recommendation);

            for (AttackTeamMemberRequest memberRequest : recommendationRequest.attackTeamMembers()) {
                recommendation.getAttackTeamMembers().add(GuildWarAttackTeamMember.builder()
                        .recommendation(recommendation)
                        .character(characterMap.get(memberRequest.characterId()))
                        .slotOrder(memberRequest.slotOrder())
                        .build());
            }

            for (SkillStepRequest stepRequest : recommendationRequest.skillSteps()) {
                recommendation.getSkillSteps().add(GuildWarSkillStep.builder()
                        .recommendation(recommendation)
                        .stepOrder(stepRequest.stepOrder())
                        .skill(skillMap.get(stepRequest.skillId()))
                        .note(stepRequest.note())
                        .build());
            }
        }
    }
}
