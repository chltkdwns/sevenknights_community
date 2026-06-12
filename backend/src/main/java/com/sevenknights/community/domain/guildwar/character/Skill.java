package com.sevenknights.community.domain.guildwar.character;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 캐릭터별 스킬 마스터.
 * <p>
 * 스킬을 GameCharacter에 JSON/임베디드로 넣지 않고 별도 Entity로 둔 이유:
 * <ul>
 *   <li>공격 가이드의 스킬 순서(gw_skill_steps)가 {@code skill_id} FK로 특정 스킬을 가리켜야
 *       쿨타임·이미지·설명 변경 시 가이드 데이터를 일괄 갱신할 수 있다.</li>
 *   <li>캐릭터당 1·2스킬·각성은 고정 슬롯({@link SkillType})이므로
 *       (character_id, skill_type) 유니크로 중복 등록을 막는다.</li>
 *   <li>추후 점수표/계산기에서 스킬 단위 배율·쿨타임을 붙일 때
 *       스킬 row를 확장 지점으로 쓸 수 있다.</li>
 * </ul>
 */
@Entity
@Table(
        name = "skills",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_skills_character_skill_type",
                columnNames = {"character_id", "skill_type"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "character_id", nullable = false)
    private GameCharacter character;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_type", nullable = false, length = 20)
    private SkillType skillType;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(length = 500)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer cooldown;

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public Skill(
            GameCharacter character,
            SkillType skillType,
            String name,
            String imageUrl,
            String description,
            Integer cooldown,
            int sortOrder,
            Boolean isActive
    ) {
        this.character = character;
        this.skillType = skillType;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.cooldown = cooldown;
        this.sortOrder = sortOrder;
        if (isActive != null) {
            this.isActive = isActive;
        }
    }
}
