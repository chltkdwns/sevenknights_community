package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.master.Equipment;
import com.sevenknights.community.domain.guildwar.master.EquipmentRepository;
import com.sevenknights.community.domain.guildwar.master.Pet;
import com.sevenknights.community.domain.guildwar.master.PetRepository;
import com.sevenknights.community.domain.guildwar.master.Ring;
import com.sevenknights.community.domain.guildwar.master.RingRepository;
import com.sevenknights.community.dto.guildwar.master.LoadoutItemAdminResponse;
import com.sevenknights.community.dto.guildwar.master.LoadoutItemCreateRequest;
import com.sevenknights.community.global.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 펫·장비·반지 마스터 조회/등록. 추천 공격팀 드롭다운 전용이며 상대 방어팀 펫 문자열과는 별개다. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuildWarLoadoutAdminService {

    private final PetRepository petRepository;
    private final EquipmentRepository equipmentRepository;
    private final RingRepository ringRepository;

    public List<LoadoutItemAdminResponse> listPets() {
        return petRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(LoadoutItemAdminResponse::from)
                .toList();
    }

    public List<LoadoutItemAdminResponse> listEquipments() {
        return equipmentRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(LoadoutItemAdminResponse::from)
                .toList();
    }

    public List<LoadoutItemAdminResponse> listRings() {
        return ringRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(LoadoutItemAdminResponse::from)
                .toList();
    }

    @Transactional
    public LoadoutItemAdminResponse createPet(LoadoutItemCreateRequest request) {
        if (petRepository.findByName(request.name().trim()).isPresent()) {
            throw new BadRequestException("이미 등록된 펫 이름입니다.");
        }
        Pet pet = petRepository.save(Pet.builder()
                .name(request.name().trim())
                .imageUrl(request.imageUrl().trim())
                .isActive(true)
                .build());
        return LoadoutItemAdminResponse.from(pet);
    }

    @Transactional
    public LoadoutItemAdminResponse createEquipment(LoadoutItemCreateRequest request) {
        if (equipmentRepository.findByName(request.name().trim()).isPresent()) {
            throw new BadRequestException("이미 등록된 장비 이름입니다.");
        }
        Equipment equipment = equipmentRepository.save(Equipment.builder()
                .name(request.name().trim())
                .imageUrl(request.imageUrl().trim())
                .isActive(true)
                .build());
        return LoadoutItemAdminResponse.from(equipment);
    }

    @Transactional
    public LoadoutItemAdminResponse createRing(LoadoutItemCreateRequest request) {
        if (ringRepository.findByName(request.name().trim()).isPresent()) {
            throw new BadRequestException("이미 등록된 반지 이름입니다.");
        }
        Ring ring = ringRepository.save(Ring.builder()
                .name(request.name().trim())
                .imageUrl(request.imageUrl().trim())
                .isActive(true)
                .build());
        return LoadoutItemAdminResponse.from(ring);
    }
}
