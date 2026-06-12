package com.sevenknights.community.domain.guildwar.attack;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 공격 가이드의 루트 Aggregate — "이 상대 방어팀" 카드 하나에 대응한다.
 * <p>
 * 실제 UX 흐름: 상대 방어팀(3인) 확인 → 그 팀을 깨는 추천 공격안 N개 선택.
 * 따라서 {@code EnemyTeam → Recommendation → (AttackMembers + SkillSteps)} 트리로 모델링하고,
 * 하위 컬렉션은 {@code cascade=ALL, orphanRemoval=true}로 묶어
 * 관리자 수정 시 한 요청으로 전체 스냅샷을 교체할 수 있게 한다.
 * (부분 PATCH·행 단위 diff는 MVP 범위 밖 — {@link com.sevenknights.community.service.guildwar.EnemyTeamAdminService} 참고)
 */
@Entity
@Table(name = "gw_enemy_teams")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarEnemyTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 255)
    private String memo;

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private boolean isPublished = false;

    /**
     * MVP: 펫 마스터 없이 팀 카드에 표시할 이름·이미지만 저장한다.
     * 펫 효과·도감·CRUD가 필요해지면 {@code pets} 테이블 + {@code pet_id} FK로 리팩터링한다.
     */
    @Column(name = "pet_name", length = 50)
    private String petName;

    @Column(name = "pet_image_url", length = 500)
    private String petImageUrl;

    @OneToMany(mappedBy = "enemyTeam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarEnemyTeamMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "enemyTeam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarAttackRecommendation> recommendations = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public GuildWarEnemyTeam(
            String title,
            String memo,
            int sortOrder,
            Boolean isPublished,
            String petName,
            String petImageUrl
    ) {
        this.title = title;
        this.memo = memo;
        this.sortOrder = sortOrder;
        if (isPublished != null) {
            this.isPublished = isPublished;
        }
        this.petName = petName;
        this.petImageUrl = petImageUrl;
    }

    public void update(
            String title,
            String memo,
            int sortOrder,
            boolean isPublished,
            String petName,
            String petImageUrl
    ) {
        this.title = title;
        this.memo = memo;
        this.sortOrder = sortOrder;
        this.isPublished = isPublished;
        this.petName = petName;
        this.petImageUrl = petImageUrl;
    }
}
