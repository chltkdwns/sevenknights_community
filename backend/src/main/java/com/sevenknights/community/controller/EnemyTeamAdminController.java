package com.sevenknights.community.controller;

import com.sevenknights.community.dto.guildwar.attack.EnemyTeamUpsertRequest;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.guildwar.EnemyTeamAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 공격 가이드 — 상대 방어팀 관리 API.
 * 저장·수정만 노출하고 조회는 의도적으로 분리한다.
 * 목록/상세는 공개 API({@code /api/guild-war/...})와 응답 DTO가 달라질 예정이며,
 * 관리용 Upsert DTO({@link EnemyTeamUpsertRequest})를 그대로 노출하지 않기 위함이다.
 */
@RestController
@RequestMapping("/api/admin/guild-war/attack/enemy-teams")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class EnemyTeamAdminController {

    private final EnemyTeamAdminService enemyTeamAdminService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JSONData<Long> save(@Valid @RequestBody EnemyTeamUpsertRequest request) {
        Long id = enemyTeamAdminService.save(request);
        return JSONData.of(HttpStatus.CREATED, id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONData<Long>> update(
            @PathVariable Long id,
            @Valid @RequestBody EnemyTeamUpsertRequest request
    ) {
        Long updatedId = enemyTeamAdminService.update(id, request);
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, updatedId));
    }
}
