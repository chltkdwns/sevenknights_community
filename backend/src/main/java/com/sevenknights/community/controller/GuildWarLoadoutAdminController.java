package com.sevenknights.community.controller;

import com.sevenknights.community.dto.guildwar.master.LoadoutItemAdminResponse;
import com.sevenknights.community.dto.guildwar.master.LoadoutItemCreateRequest;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.guildwar.GuildWarLoadoutAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 추천 공격팀 드롭다운용 펫·장비·반지 마스터.
 * <p>
 * 캐릭터 목록 API와 같이 관리자 GET/POST만 둔다. 공개 가이드 API는 건드리지 않는다.
 * POST는 드롭다운이 비어 있을 때 같은 관리 폼에서 항목을 넣을 수 있게 하기 위함이다.
 */
@RestController
@RequestMapping("/api/admin/guild-war")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GuildWarLoadoutAdminController {

    private final GuildWarLoadoutAdminService guildWarLoadoutAdminService;

    @GetMapping("/pets")
    public JSONData<List<LoadoutItemAdminResponse>> listPets() {
        return JSONData.of(HttpStatus.OK, guildWarLoadoutAdminService.listPets());
    }

    @PostMapping("/pets")
    @ResponseStatus(HttpStatus.CREATED)
    public JSONData<LoadoutItemAdminResponse> createPet(@Valid @RequestBody LoadoutItemCreateRequest request) {
        return JSONData.of(HttpStatus.CREATED, guildWarLoadoutAdminService.createPet(request));
    }

    @GetMapping("/equipments")
    public JSONData<List<LoadoutItemAdminResponse>> listEquipments() {
        return JSONData.of(HttpStatus.OK, guildWarLoadoutAdminService.listEquipments());
    }

    @PostMapping("/equipments")
    @ResponseStatus(HttpStatus.CREATED)
    public JSONData<LoadoutItemAdminResponse> createEquipment(@Valid @RequestBody LoadoutItemCreateRequest request) {
        return JSONData.of(HttpStatus.CREATED, guildWarLoadoutAdminService.createEquipment(request));
    }

    @GetMapping("/rings")
    public JSONData<List<LoadoutItemAdminResponse>> listRings() {
        return JSONData.of(HttpStatus.OK, guildWarLoadoutAdminService.listRings());
    }

    @PostMapping("/rings")
    @ResponseStatus(HttpStatus.CREATED)
    public JSONData<LoadoutItemAdminResponse> createRing(@Valid @RequestBody LoadoutItemCreateRequest request) {
        return JSONData.of(HttpStatus.CREATED, guildWarLoadoutAdminService.createRing(request));
    }
}
