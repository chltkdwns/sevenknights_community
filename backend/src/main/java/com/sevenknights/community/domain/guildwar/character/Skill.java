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
