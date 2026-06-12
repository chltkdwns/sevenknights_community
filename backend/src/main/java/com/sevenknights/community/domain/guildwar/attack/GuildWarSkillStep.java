package com.sevenknights.community.domain.guildwar.attack;

import com.sevenknights.community.domain.guildwar.character.Skill;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 추천안의 "몇 번째에 어떤 스킬을 쓸지" 시퀀스.
 * <p>
 * {@code (characterId, skillType)} 튜플 대신 {@code skill_id} FK를 쓰는 이유:
 * <ul>
 *   <li>스킬 마스터(name, imageUrl, cooldown) 변경이 가이드에 자동 반영된다.</li>
 *   <li>프론트는 스킬 선택 UI에서 이미 skill row를 고르므로 id 전달이 자연스럽다.</li>
 *   <li>{@code stepOrder}는 턴/행동 순서만 담당하고, 스킬 정체성은 skill_id가 담당한다.</li>
 * </ul>
 */
@Entity
@Table(
        name = "gw_skill_steps",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_gw_skill_steps_rec_step",
                columnNames = {"recommendation_id", "step_order"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarSkillStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private GuildWarAttackRecommendation recommendation;

    @Column(nullable = false)
    private int stepOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(length = 255)
    private String note;

    @Builder
    public GuildWarSkillStep(
            GuildWarAttackRecommendation recommendation,
            int stepOrder,
            Skill skill,
            String note
    ) {
        this.recommendation = recommendation;
        this.stepOrder = stepOrder;
        this.skill = skill;
        this.note = note;
    }
}
