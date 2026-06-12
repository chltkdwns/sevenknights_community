package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendation;
import com.sevenknights.community.domain.guildwar.attack.GuildWarAttackRecommendationRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeam;
import com.sevenknights.community.domain.guildwar.attack.GuildWarEnemyTeamRepository;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStepRepository;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamDetailResponse;
import com.sevenknights.community.dto.guildwar.attack.EnemyTeamSummaryResponse;
import com.sevenknights.community.global.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 길드전 공격 가이드 — 공개 조회 전용 서비스.
 * <p>
 * {@link EnemyTeamAdminService}와 분리한 이유:
 * <ul>
 *   <li>읽기는 {@code isPublished=true}만, 쓰기는 관리자 전용 — 보안·검증 규칙이 다르다.</li>
 *   <li>조회는 fetch join 전략·읽기 DTO 조립이 핵심이고, 쓰기는 Aggregate 교체가 핵심이다.</li>
 * </ul>
 * 미발행 초안은 목록·상세 모두 404와 동일하게 처리해 id 열거를 막는다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnemyTeamService {

    private final GuildWarEnemyTeamRepository enemyTeamRepository;
    private final GuildWarAttackRecommendationRepository recommendationRepository;
    private final GuildWarSkillStepRepository skillStepRepository;

    public List<EnemyTeamSummaryResponse> getEnemyTeams() {
        return enemyTeamRepository.findPublishedAllWithMembers().stream()
                .map(EnemyTeamSummaryResponse::from)
                .toList();
    }

    public EnemyTeamDetailResponse getEnemyTeamDetail(Long id) {
        GuildWarEnemyTeam team = enemyTeamRepository.findPublishedByIdWithMembers(id)
                .orElseThrow(() -> new NotFoundException("상대 방어팀을 찾을 수 없습니다."));

        List<GuildWarAttackRecommendation> recommendations =
                recommendationRepository.findByEnemyTeamIdWithAttackMembers(id);

        Map<Long, List<GuildWarSkillStep>> skillStepsByRecommendationId =
                skillStepRepository.findAllByEnemyTeamIdWithSkillAndCharacter(id).stream()
                        .collect(Collectors.groupingBy(step -> step.getRecommendation().getId()));

        return EnemyTeamDetailResponse.from(team, recommendations, skillStepsByRecommendationId);
    }
}
