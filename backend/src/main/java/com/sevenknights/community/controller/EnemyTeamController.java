package com.sevenknights.community.controller;

import com.sevenknights.community.dto.guildwar.attack.EnemyTeamDetailResponse;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamSummaryResponse;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.guildwar.EnemyTeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 길드전 공격 가이드 공개 API.
 * 인증 없이 조회 가능하며, 노출 여부는 서비스·리포지토리의 {@code isPublished} 필터로만 제어한다.
 */
@RestController
@RequestMapping("/api/guild-war/attack/enemy-teams")
@RequiredArgsConstructor
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
