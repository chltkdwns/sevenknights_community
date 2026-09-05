package com.sevenknights.community.controller;

import com.sevenknights.community.dto.guildwar.attack.EnemyTeamDetailResponse;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamSummaryResponse;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.guildwar.EnemyTeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 길드전 공격 가이드 API.
 * MEMBER·ADMIN만 조회할 수 있다. 프론트 가드만으로는 부족하므로 서버에서도 역할을 검사한다.
 */
@RestController
@RequestMapping("/api/guild-war/attack/enemy-teams")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('MEMBER', 'ADMIN')")
public class EnemyTeamController {

    private final EnemyTeamService enemyTeamService;

    @GetMapping
    public ResponseEntity<JSONData<List<EnemyTeamSummaryResponse>>> getEnemyTeams() {
        List<EnemyTeamSummaryResponse> data = enemyTeamService.getEnemyTeams();
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JSONData<EnemyTeamDetailResponse>> getEnemyTeam(@PathVariable Long id) {
        EnemyTeamDetailResponse data = enemyTeamService.getEnemyTeamDetail(id);
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, data));
    }
}
