package com.sevenknights.community.controller;

import com.sevenknights.community.dto.catalog.HeroCatalogResponse;
import com.sevenknights.community.dto.catalog.PetCatalogResponse;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.catalog.CatalogAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 게임 공통 카탈로그(heroes, pets) 조회.
 * 길드전 gw_pets·GameCharacter API와 분리해 관리자 폼에서 선택 목록으로 쓴다.
 */
@RestController
@RequestMapping("/api/admin/catalog")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CatalogAdminController {

    private final CatalogAdminService catalogAdminService;

    @GetMapping("/heroes")
    public JSONData<List<HeroCatalogResponse>> listHeroes() {
        return JSONData.of(HttpStatus.OK, catalogAdminService.listActiveHeroes());
    }

    @GetMapping("/pets")
    public JSONData<List<PetCatalogResponse>> listPets() {
        return JSONData.of(HttpStatus.OK, catalogAdminService.listActivePets());
    }
}
