package com.sevenknights.community.domain.hero;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
 * 길드전·가이드용 영웅 마스터.
 * <p>
 * {@link com.sevenknights.community.domain.guildwar.character.GameCharacter}와 별도로 두어
 * 스킬·가이드 FK를 건드리지 않고 영웅 카탈로그만 먼저 구축한다.
 * 영문 식별명({@code slug})은 {@code frontend/public/images/heroes} 폴더명과 1:1로 맞춘다.
 */
@Entity
@Table(
        name = "heroes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_heroes_slug", columnNames = "slug"),
                @UniqueConstraint(name = "uk_heroes_name", columnNames = "name")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Hero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 화면 표시용 한글명 */
    @Column(nullable = false, length = 50)
    private String name;

    /** 이미지 폴더명과 동일한 영문 식별명 */
    @Column(nullable = false, length = 80)
    private String slug;

    /** 소속 폴더명 (예: seven_knights) */
    @Column(nullable = false, length = 80)
    private String faction;

    /** Next.js public 기준 정적 경로 (예: /images/heroes/seven_knights/rudy/rudy.webp) */
    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public Hero(String name, String slug, String faction, String imageUrl, Boolean isActive) {
        this.name = name;
        this.slug = slug;
        this.faction = faction;
        this.imageUrl = imageUrl;
        if (isActive != null) {
            this.isActive = isActive;
        }
    }

    public void updateProfile(String name, String faction, String imageUrl) {
        this.name = name;
        this.faction = faction;
        this.imageUrl = imageUrl;
    }
}
