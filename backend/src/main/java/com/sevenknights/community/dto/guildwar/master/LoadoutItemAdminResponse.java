package com.sevenknights.community.dto.guildwar.master;

import com.sevenknights.community.domain.guildwar.master.Equipment;
import com.sevenknights.community.domain.guildwar.master.Pet;
import com.sevenknights.community.domain.guildwar.master.Ring;

/** 관리자 드롭다운용 마스터 한 줄. 펫·장비·반지 응답 형식을 맞춘다. */
public record LoadoutItemAdminResponse(
        Long id,
        String name,
        String imageUrl
) {
    public static LoadoutItemAdminResponse from(Pet pet) {
        return new LoadoutItemAdminResponse(pet.getId(), pet.getName(), pet.getImageUrl());
    }

    public static LoadoutItemAdminResponse from(Equipment equipment) {
        return new LoadoutItemAdminResponse(equipment.getId(), equipment.getName(), equipment.getImageUrl());
    }

    public static LoadoutItemAdminResponse from(Ring ring) {
        return new LoadoutItemAdminResponse(ring.getId(), ring.getName(), ring.getImageUrl());
    }
}
