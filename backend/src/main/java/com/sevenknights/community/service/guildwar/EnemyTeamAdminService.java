package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberEquipment;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberRing;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendation;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendationPet;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackTeamMember;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamMember;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillRepository;
import com.sevenknights.community.domain.guildwar.master.Equipment;
import com.sevenknights.community.domain.guildwar.master.EquipmentRepository;
import com.sevenknights.community.domain.guildwar.master.Ring;
import com.sevenknights.community.domain.guildwar.master.RingRepository;
import com.sevenknights.community.domain.hero.Hero;
import com.sevenknights.community.domain.hero.HeroRepository;
import com.sevenknights.community.domain.pet.PetCatalogRepository;
import com.sevenknights.community.dto.guildwar.attack.AttackMemberEquipmentRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackMemberRingRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackRecommendationRequest;
import com.sevenknights.community.dto.guildwar.attack.AttackTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamAdminSummaryResponse;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamMemberRequest;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamUpsertRequest;
import com.sevenknights.community.dto.guildwar.attack.SkillStepRequest;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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
    private final HeroRepository heroRepository;
    private final SkillRepository skillRepository;
    private final PetCatalogRepository petCatalogRepository;
    private final EquipmentRepository equipmentRepository;
    private final RingRepository ringRepository;
    private final EntityManager entityManager;

    @Transactional
    public Long save(EnemyTeamUpsertRequest request) {
        validateRequest(request);

        Map<Long, Hero> heroMap = loadHeroes(collectHeroIds(request));
        Map<Long, Skill> skillMap = loadSkills(collectSkillIds(request));
        Map<Long, com.sevenknights.community.domain.pet.Pet> catalogPetMap = loadCatalogPets(collectPetIds(request));
        Map<Long, Equipment> equipmentMap = loadEquipments(collectEquipmentIds(request));
        Map<Long, Ring> ringMap = loadRings(collectRingIds(request));

        GuildWarEnemyTeam team = GuildWarEnemyTeam.builder()
                .title(request.title())
                .memo(request.memo())
                .sortOrder(nextSortOrder())
                .isPublished(request.isPublished())
                .petName(request.petName())
                .petImageUrl(request.petImageUrl())
                .build();

        applyMembers(team, request.members(), heroMap);
        applyRecommendations(team, request.recommendations(), heroMap, skillMap, catalogPetMap, equipmentMap, ringMap);

        return enemyTeamRepository.save(team).getId();
    }

    @Transactional
    public Long update(Long id, EnemyTeamUpsertRequest request) {
        validateRequest(request);

        GuildWarEnemyTeam team = enemyTeamRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new NotFoundException("상대 방어팀을 찾을 수 없습니다."));

        Map<Long, Hero> heroMap = loadHeroes(collectHeroIds(request));
        Map<Long, Skill> skillMap = loadSkills(collectSkillIds(request));
        Map<Long, com.sevenknights.community.domain.pet.Pet> catalogPetMap = loadCatalogPets(collectPetIds(request));
        Map<Long, Equipment> equipmentMap = loadEquipments(collectEquipmentIds(request));
        Map<Long, Ring> ringMap = loadRings(collectRingIds(request));

        team.update(
                request.title(),
                request.memo(),
                team.getSortOrder(),
                request.isPublished(),
                request.petName(),
                request.petImageUrl()
        );

        // Aggregate 루트만 유지하고 하위는 전부 제거 후 재생성.
        // recommendations.clear() 시 attackTeamMembers·skillSteps도 cascade orphanRemoval로 삭제된다.
        team.getRecommendations().clear();
        team.getMembers().clear();
        // UK(enemy_team_id, slot_order) 등 제약 때문에 DELETE가 INSERT보다 먼저 DB에 반영되어야 한다.
        entityManager.flush();

        applyMembers(team, request.members(), heroMap);
        applyRecommendations(team, request.recommendations(), heroMap, skillMap, catalogPetMap, equipmentMap, ringMap);

        return team.getId();
    }

    /**
     * 방어팀 Aggregate 전체 삭제.
     * members·recommendations는 cascade orphanRemoval로 하위(공격팀·스킬·장비·반지·펫 조인)까지 함께 제거한다.
     */
    @Transactional
    public void delete(Long id) {
        GuildWarEnemyTeam team = enemyTeamRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new NotFoundException("상대 방어팀을 찾을 수 없습니다."));
        team.getRecommendations().clear();
        team.getMembers().clear();
        entityManager.flush();
        enemyTeamRepository.delete(team);
    }

    @Transactional(readOnly = true)
    public List<EnemyTeamAdminSummaryResponse> listAllForAdmin() {
        return enemyTeamRepository.findAllWithMembersOrderBySortOrderAsc().stream()
                .map(EnemyTeamAdminSummaryResponse::from)
                .toList();
    }

    /**
     * 관리자 목록 드래그 앤 드롭 — 방어팀 {@code sortOrder}만 갱신한다.
     * 하위 추천 공격팀·편성 데이터는 건드리지 않는다.
     */
    @Transactional
    public void reorder(List<Long> orderedIds) {
        if (orderedIds == null || orderedIds.isEmpty()) {
            throw new BadRequestException("정렬할 방어팀 목록이 비어 있습니다.");
        }

        long distinctCount = orderedIds.stream().distinct().count();
        if (distinctCount != orderedIds.size()) {
            throw new BadRequestException("중복된 방어팀이 포함되어 있습니다.");
        }

        List<GuildWarEnemyTeam> allTeams = enemyTeamRepository.findAllByOrderBySortOrderAsc();
        if (allTeams.size() != orderedIds.size()) {
            throw new BadRequestException("모든 방어팀의 순서를 지정해야 합니다.");
        }

        Map<Long, GuildWarEnemyTeam> teamById = allTeams.stream()
                .collect(Collectors.toMap(GuildWarEnemyTeam::getId, Function.identity()));

        for (Long orderedId : orderedIds) {
            if (!teamById.containsKey(orderedId)) {
                throw new BadRequestException("존재하지 않는 방어팀이 포함되어 있습니다.");
            }
        }

        for (int index = 0; index < orderedIds.size(); index++) {
            teamById.get(orderedIds.get(index)).updateSortOrder(index);
        }
    }

    private int nextSortOrder() {
        return enemyTeamRepository.findAllByOrderBySortOrderAsc().stream()
                .mapToInt(GuildWarEnemyTeam::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private void validateRequest(EnemyTeamUpsertRequest request) {
        validateNoDuplicateOrders(
                request.members().stream().map(EnemyTeamMemberRequest::slotOrder).toList(),
                "상대 방어팀 슬롯 순서가 중복되었습니다."
        );

        Set<Long> heroIds = new HashSet<>();
        Set<Long> skillIds = new HashSet<>();
        Set<Long> petIds = new HashSet<>();
        Set<Long> equipmentIds = new HashSet<>();
        Set<Long> ringIds = new HashSet<>();

        request.members().forEach(member -> heroIds.add(member.heroId()));

        for (AttackRecommendationRequest recommendation : request.recommendations()) {
            validateNoDuplicateOrders(
                    recommendation.attackTeamMembers().stream().map(AttackTeamMemberRequest::slotOrder).toList(),
                    "추천 공격팀 슬롯 순서가 중복되었습니다."
            );
            validateNoDuplicateOrders(
                    recommendation.skillSteps().stream().map(SkillStepRequest::stepOrder).toList(),
                    "스킬 순서가 중복되었습니다."
            );

            validateNoDuplicatePetIds(resolvePetIds(recommendation), "추천 공격팀에 같은 펫을 중복 선택할 수 없습니다.");

            petIds.addAll(resolvePetIds(recommendation));

            recommendation.attackTeamMembers().forEach(member -> {
                heroIds.add(member.heroId());
                equipments(member).forEach(equipment -> {
                    if (equipment.equipmentId() != null) {
                        equipmentIds.add(equipment.equipmentId());
                    } else if (!isNotBlank(equipment.customName())) {
                        throw new BadRequestException("추천 장비를 선택하거나 직접 입력해 주세요.");
                    }
                });
                rings(member).forEach(ring -> {
                    if (ring.ringId() != null) {
                        ringIds.add(ring.ringId());
                    } else if (!isNotBlank(ring.customName())) {
                        throw new BadRequestException("추천 반지를 선택하거나 직접 입력해 주세요.");
                    }
                });
            });
            recommendation.skillSteps().forEach(step -> {
                if (step.skillId() != null) {
                    skillIds.add(step.skillId());
                }
            });
        }

        validateHeroesExist(heroIds);
        validateSkillsExist(skillIds);
        validateCatalogPetsExist(petIds);
        validateEquipmentsExist(equipmentIds);
        validateRingsExist(ringIds);
    }

    private void validateNoDuplicateOrders(List<Integer> orders, String message) {
        long distinctCount = orders.stream().distinct().count();
        if (distinctCount != orders.size()) {
            throw new BadRequestException(message);
        }
    }

    private void validateNoDuplicatePetIds(List<Long> petIds, String message) {
        long distinctCount = petIds.stream().distinct().count();
        if (distinctCount != petIds.size()) {
            throw new BadRequestException(message);
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

    private void validateHeroesExist(Set<Long> heroIds) {
        if (heroIds.isEmpty()) {
            return;
        }
        long foundCount = heroRepository.findAllById(heroIds).size();
        if (foundCount != heroIds.size()) {
            throw new BadRequestException("존재하지 않는 영웅이 포함되어 있습니다.");
        }
    }

    private void validateCatalogPetsExist(Set<Long> petIds) {
        if (petIds.isEmpty()) {
            return;
        }
        long foundCount = petCatalogRepository.findAllById(petIds).size();
        if (foundCount != petIds.size()) {
            throw new BadRequestException("존재하지 않는 펫이 포함되어 있습니다.");
        }
    }

    private void validateEquipmentsExist(Set<Long> equipmentIds) {
        if (equipmentIds.isEmpty()) {
            return;
        }
        long foundCount = equipmentRepository.findAllById(equipmentIds).size();
        if (foundCount != equipmentIds.size()) {
            throw new BadRequestException("존재하지 않는 장비가 포함되어 있습니다.");
        }
    }

    private void validateRingsExist(Set<Long> ringIds) {
        if (ringIds.isEmpty()) {
            return;
        }
        long foundCount = ringRepository.findAllById(ringIds).size();
        if (foundCount != ringIds.size()) {
            throw new BadRequestException("존재하지 않는 반지가 포함되어 있습니다.");
        }
    }

    private Set<Long> collectHeroIds(EnemyTeamUpsertRequest request) {
        Set<Long> heroIds = new HashSet<>();
        request.members().forEach(member -> heroIds.add(member.heroId()));
        request.recommendations().forEach(recommendation ->
                recommendation.attackTeamMembers().forEach(member -> heroIds.add(member.heroId()))
        );
        return heroIds;
    }

    private Set<Long> collectSkillIds(EnemyTeamUpsertRequest request) {
        Set<Long> skillIds = new HashSet<>();
        request.recommendations().forEach(recommendation ->
                recommendation.skillSteps().forEach(step -> {
                    if (step.skillId() != null) {
                        skillIds.add(step.skillId());
                    }
                })
        );
        return skillIds;
    }

    private Set<Long> collectPetIds(EnemyTeamUpsertRequest request) {
        Set<Long> petIds = new HashSet<>();
        request.recommendations().forEach(recommendation -> petIds.addAll(resolvePetIds(recommendation)));
        return petIds;
    }

    private static List<Long> resolvePetIds(AttackRecommendationRequest recommendation) {
        if (recommendation.petIds() != null && !recommendation.petIds().isEmpty()) {
            return recommendation.petIds().stream().filter(Objects::nonNull).toList();
        }
        if (recommendation.petId() != null) {
            return List.of(recommendation.petId());
        }
        return List.of();
    }

    private Set<Long> collectEquipmentIds(EnemyTeamUpsertRequest request) {
        Set<Long> equipmentIds = new HashSet<>();
        request.recommendations().forEach(recommendation ->
                recommendation.attackTeamMembers().forEach(member ->
                        equipments(member).stream()
                                .map(AttackMemberEquipmentRequest::equipmentId)
                                .filter(Objects::nonNull)
                                .forEach(equipmentIds::add)
                )
        );
        return equipmentIds;
    }

    private Set<Long> collectRingIds(EnemyTeamUpsertRequest request) {
        Set<Long> ringIds = new HashSet<>();
        request.recommendations().forEach(recommendation ->
                recommendation.attackTeamMembers().forEach(member ->
                        rings(member).stream()
                                .map(AttackMemberRingRequest::ringId)
                                .filter(Objects::nonNull)
                                .forEach(ringIds::add)
                )
        );
        return ringIds;
    }

    private Map<Long, Skill> loadSkills(Set<Long> skillIds) {
        return skillRepository.findAllById(skillIds).stream()
                .collect(Collectors.toMap(Skill::getId, Function.identity()));
    }

    private Map<Long, Hero> loadHeroes(Set<Long> heroIds) {
        return heroRepository.findAllById(heroIds).stream()
                .collect(Collectors.toMap(Hero::getId, Function.identity()));
    }

    private Map<Long, com.sevenknights.community.domain.pet.Pet> loadCatalogPets(Set<Long> petIds) {
        return petCatalogRepository.findAllById(petIds).stream()
                .collect(Collectors.toMap(com.sevenknights.community.domain.pet.Pet::getId, Function.identity()));
    }

    private Map<Long, Equipment> loadEquipments(Set<Long> equipmentIds) {
        return equipmentRepository.findAllById(equipmentIds).stream()
                .collect(Collectors.toMap(Equipment::getId, Function.identity()));
    }

    private Map<Long, Ring> loadRings(Set<Long> ringIds) {
        return ringRepository.findAllById(ringIds).stream()
                .collect(Collectors.toMap(Ring::getId, Function.identity()));
    }

    private void applyMembers(
            GuildWarEnemyTeam team,
            List<EnemyTeamMemberRequest> members,
            Map<Long, Hero> heroMap
    ) {
        for (EnemyTeamMemberRequest memberRequest : members) {
            team.getMembers().add(GuildWarEnemyTeamMember.builder()
                    .enemyTeam(team)
                    .hero(heroMap.get(memberRequest.heroId()))
                    .character(null)
                    .slotOrder(memberRequest.slotOrder())
                    .build());
        }
    }

    private void applyRecommendations(
            GuildWarEnemyTeam team,
            List<AttackRecommendationRequest> recommendations,
            Map<Long, Hero> heroMap,
            Map<Long, Skill> skillMap,
            Map<Long, com.sevenknights.community.domain.pet.Pet> catalogPetMap,
            Map<Long, Equipment> equipmentMap,
            Map<Long, Ring> ringMap
    ) {
        for (AttackRecommendationRequest recommendationRequest : recommendations) {
            // 신규 다중 펫은 조인 테이블에만 저장한다. 루트 pet/catalog_pet 컬럼은 구버전 호환용.
            GuildWarAttackRecommendation recommendation = GuildWarAttackRecommendation.builder()
                    .enemyTeam(team)
                    .title(recommendationRequest.title())
                    .description(recommendationRequest.description())
                    .sortOrder(recommendationRequest.sortOrder())
                    .pet(null)
                    .catalogPet(null)
                    .petName(null)
                    .petImageUrl(null)
                    .build();
            team.getRecommendations().add(recommendation);

            int petOrder = 1;
            for (Long petId : resolvePetIds(recommendationRequest)) {
                com.sevenknights.community.domain.pet.Pet catalogPet = catalogPetMap.get(petId);
                recommendation.getRecommendationPets().add(GuildWarAttackRecommendationPet.builder()
                        .recommendation(recommendation)
                        .catalogPet(catalogPet)
                        .sortOrder(petOrder++)
                        .build());
            }

            for (AttackTeamMemberRequest memberRequest : recommendationRequest.attackTeamMembers()) {
                GuildWarAttackTeamMember member = GuildWarAttackTeamMember.builder()
                        .recommendation(recommendation)
                        .hero(heroMap.get(memberRequest.heroId()))
                        .character(null)
                        .slotOrder(memberRequest.slotOrder())
                        .description(memberRequest.description())
                        .build();
                recommendation.getAttackTeamMembers().add(member);

                // 멤버 행이 먼저 persist 대상이 된 뒤에 자식 장비/반지를 붙인다. 이름·이미지는 저장하지 않는다.
                int equipmentOrder = 1;
                for (AttackMemberEquipmentRequest equipmentRequest : equipments(memberRequest)) {
                    if (equipmentRequest.equipmentId() != null) {
                        member.getEquipments().add(GuildWarAttackMemberEquipment.builder()
                                .member(member)
                                .equipment(equipmentMap.get(equipmentRequest.equipmentId()))
                                .customName(null)
                                .sortOrder(equipmentOrder++)
                                .build());
                        continue;
                    }
                    member.getEquipments().add(GuildWarAttackMemberEquipment.builder()
                            .member(member)
                            .equipment(null)
                            .customName(blankToNull(equipmentRequest.customName()))
                            .sortOrder(equipmentOrder++)
                            .build());
                }

                int ringOrder = 1;
                for (AttackMemberRingRequest ringRequest : rings(memberRequest)) {
                    if (ringRequest.ringId() != null) {
                        member.getRings().add(GuildWarAttackMemberRing.builder()
                                .member(member)
                                .ring(ringMap.get(ringRequest.ringId()))
                                .customName(null)
                                .enchantment(blankToNull(ringRequest.enchantment()))
                                .sortOrder(ringOrder++)
                                .build());
                        continue;
                    }
                    member.getRings().add(GuildWarAttackMemberRing.builder()
                            .member(member)
                            .ring(null)
                            .customName(blankToNull(ringRequest.customName()))
                            .enchantment(blankToNull(ringRequest.enchantment()))
                            .sortOrder(ringOrder++)
                            .build());
                }
            }

            List<SkillStepRequest> orderedSteps = recommendationRequest.skillSteps().stream()
                    .sorted(Comparator.comparingInt(SkillStepRequest::stepOrder))
                    .toList();
            for (SkillStepRequest stepRequest : orderedSteps) {
                if (stepRequest.skillId() != null) {
                    recommendation.getSkillSteps().add(GuildWarSkillStep.builder()
                            .recommendation(recommendation)
                            .stepOrder(stepRequest.stepOrder())
                            .skill(skillMap.get(stepRequest.skillId()))
                            .note(stepRequest.note())
                            .build());
                    continue;
                }
                // 직접 입력 모드: note만 저장. 카탈로그 모드의 스킬 사용 X는 note 없이 break.
                if (isNotBlank(stepRequest.note())) {
                    recommendation.getSkillSteps().add(GuildWarSkillStep.builder()
                            .recommendation(recommendation)
                            .stepOrder(stepRequest.stepOrder())
                            .skill(null)
                            .note(stepRequest.note().trim())
                            .build());
                    continue;
                }
                break;
            }
        }
    }

    private static List<AttackMemberEquipmentRequest> equipments(AttackTeamMemberRequest member) {
        if (member.equipments() == null) {
            return List.of();
        }
        return member.equipments().stream()
                .filter(Objects::nonNull)
                .filter(equipment -> equipment.equipmentId() != null || isNotBlank(equipment.customName()))
                .toList();
    }

    private static List<AttackMemberRingRequest> rings(AttackTeamMemberRequest member) {
        if (member.rings() == null) {
            return List.of();
        }
        return member.rings().stream()
                .filter(Objects::nonNull)
                .filter(ring -> ring.ringId() != null || isNotBlank(ring.customName()))
                .toList();
    }

    private static String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private static boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
    }
}
