package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberEquipment;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackMemberRing;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackTeamMember;
import com.sevenknights.community.domain.guildwar.character.Skill;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** 추천 공격팀 편성원 응답 — 캐릭터 스냅샷 + 장비/반지(마스터 참조) + 스킬 목록. */
public record AttackTeamMemberResponse(
        int slotOrder,
        Long characterId,
        String characterName,
        String characterImageUrl,
        List<AttackLoadoutItemResponse> equipments,
        List<AttackRingLoadoutResponse> rings,
        /**
         * 구버전 단일 장비 필드. 새 UI는 equipments 배열을 쓰고,
         * 예전 클라이언트/폴백 표시를 위해 첫 장비 또는 레거시 컬럼을 채운다.
         */
        String equipmentImageUrl,
        String equipmentSetName,
        String ringImageUrl,
        String ringName,
        String ringEnchantment,
        String description,
        List<CharacterSkillResponse> skills
) {
    public static AttackTeamMemberResponse from(
            GuildWarAttackTeamMember member,
            List<Skill> skills,
            List<GuildWarAttackMemberEquipment> memberEquipments,
            List<GuildWarAttackMemberRing> memberRings
    ) {
        List<AttackLoadoutItemResponse> equipments = memberEquipments.stream()
                .map(item -> {
                    if (item.getEquipment() != null) {
                        return new AttackLoadoutItemResponse(
                                item.getEquipment().getId(),
                                item.getEquipment().getName(),
                                item.getEquipment().getImageUrl()
                        );
                    }
                    return new AttackLoadoutItemResponse(null, item.getCustomName(), null);
                })
                .filter(item -> !isBlank(item.name()))
                .toList();
        // 조인 테이블이 비어 있으면 예전 멤버 컬럼(이름·URL 한 세트)으로 공개 화면을 채운다.
        if (equipments.isEmpty()) {
            equipments = legacyEquipment(member);
        }

        List<AttackRingLoadoutResponse> rings = memberRings.stream()
                .map(item -> {
                    if (item.getRing() != null) {
                        return new AttackRingLoadoutResponse(
                                item.getRing().getId(),
                                item.getRing().getName(),
                                item.getRing().getImageUrl(),
                                item.getEnchantment()
                        );
                    }
                    return new AttackRingLoadoutResponse(null, item.getCustomName(), null, item.getEnchantment());
                })
                .filter(item -> !isBlank(item.name()) || !isBlank(item.enchantment()))
                .toList();
        if (rings.isEmpty()) {
            rings = legacyRings(member);
        }

        AttackLoadoutItemResponse firstEquipment = equipments.isEmpty() ? null : equipments.get(0);
        AttackRingLoadoutResponse firstRing = rings.isEmpty() ? null : rings.get(0);

        return new AttackTeamMemberResponse(
                member.getSlotOrder(),
                resolveCharacterId(member),
                resolveCharacterName(member),
                resolveCharacterImageUrl(member),
                equipments,
                rings,
                firstEquipment != null ? firstEquipment.imageUrl() : member.getEquipmentImageUrl(),
                firstEquipment != null ? firstEquipment.name() : member.getEquipmentSetName(),
                firstRing != null ? firstRing.imageUrl() : member.getRingImageUrl(),
                firstRing != null ? firstRing.name() : member.getRingName(),
                firstRing != null ? firstRing.enchantment() : member.getRingEnchantment(),
                member.getDescription(),
                skills.stream().map(CharacterSkillResponse::from).toList()
        );
    }

    private static List<AttackLoadoutItemResponse> legacyEquipment(GuildWarAttackTeamMember member) {
        // id=null: 마스터에 없는 구데이터. 관리자 드롭다운에는 올리지 않고 표시만 한다.
        if (isBlank(member.getEquipmentSetName()) && isBlank(member.getEquipmentImageUrl())) {
            return List.of();
        }
        List<AttackLoadoutItemResponse> items = new ArrayList<>();
        items.add(new AttackLoadoutItemResponse(
                null,
                member.getEquipmentSetName(),
                member.getEquipmentImageUrl()
        ));
        return items;
    }

    private static List<AttackRingLoadoutResponse> legacyRings(GuildWarAttackTeamMember member) {
        if (isBlank(member.getRingName()) && isBlank(member.getRingImageUrl()) && isBlank(member.getRingEnchantment())) {
            return List.of();
        }
        List<AttackRingLoadoutResponse> items = new ArrayList<>();
        items.add(new AttackRingLoadoutResponse(
                null,
                member.getRingName(),
                member.getRingImageUrl(),
                member.getRingEnchantment()
        ));
        return items;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    /** 신규는 heroes.id, 구버전은 characters.id를 내려준다. */
    private static Long resolveCharacterId(GuildWarAttackTeamMember member) {
        if (member.getHero() != null) {
            return member.getHero().getId();
        }
        if (member.getCharacter() != null) {
            return member.getCharacter().getId();
        }
        return null;
    }

    private static String resolveCharacterName(GuildWarAttackTeamMember member) {
        if (member.getHero() != null) {
            return member.getHero().getName();
        }
        if (member.getCharacter() != null) {
            return member.getCharacter().getName();
        }
        return null;
    }

    private static String resolveCharacterImageUrl(GuildWarAttackTeamMember member) {
        if (member.getHero() != null) {
            return member.getHero().getImageUrl();
        }
        if (member.getCharacter() != null) {
            return member.getCharacter().getImageUrl();
        }
        return null;
    }

    /**
     * 스킬 목록은 아직 GameCharacter에 묶여 있다. hero FK 행은 이름으로 characters를 찾는다.
     */
    public static Long resolveSkillCharacterId(
            GuildWarAttackTeamMember member,
            Map<String, Long> gameCharacterIdByName
    ) {
        if (member.getCharacter() != null) {
            return member.getCharacter().getId();
        }
        if (member.getHero() != null) {
            return gameCharacterIdByName.get(member.getHero().getName());
        }
        return null;
    }
}
