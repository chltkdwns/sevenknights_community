package com.sevenknights.community.domain.guildwar.attack;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
 * 상대 방어팀 하나에 대한 추천 공격안.
 * <p>
 * 같은 상대팀이라도 "고점수용 / 안정 픽"처럼 공격 조합·스킬 순서가 여러 벌이므로
 * EnemyTeam과 1:N으로 분리한다. 추천마다 독립된 공격 3인({@link GuildWarAttackTeamMember})과
 * 스킬 시퀀스({@link GuildWarSkillStep})를 갖는다.
 */
@Entity
@Table(name = "gw_attack_recommendations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarAttackRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "enemy_team_id", nullable = false)
    private GuildWarEnemyTeam enemyTeam;

    @Column(length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int sortOrder;

    /**
     * MVP: 추천 공격팀에 사용한 펫을 표시용으로만 저장한다.
     * 상대팀({@link GuildWarEnemyTeam}) 펫과 독립 — 추천마다 다른 펫을 쓸 수 있다.
     * 펫 계산·도감 도입 시 {@code pets} 테이블로 분리해 {@code pet_id} FK로 전환한다.
     */
    @Column(name = "pet_name", length = 50)
    private String petName;

    @Column(name = "pet_image_url", length = 500)
    private String petImageUrl;

    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarAttackTeamMember> attackTeamMembers = new ArrayList<>();

    @OneToMany(mappedBy = "recommendation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarSkillStep> skillSteps = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public GuildWarAttackRecommendation(
            GuildWarEnemyTeam enemyTeam,
            String title,
            String description,
            int sortOrder,
            String petName,
            String petImageUrl
    ) {
        this.enemyTeam = enemyTeam;
        this.title = title;
        this.description = description;
        this.sortOrder = sortOrder;
        this.petName = petName;
        this.petImageUrl = petImageUrl;
    }
}
