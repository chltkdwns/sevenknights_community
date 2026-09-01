package com.sevenknights.community.domain.pet;

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
 * 펫 카탈로그 마스터.
 * <p>
 * 길드전 추천팀용 {@link com.sevenknights.community.domain.guildwar.master.Pet}({@code gw_pets})와
 * 별도 테이블이다. slug는 {@code frontend/public/images/pet/{slug}.webp} 파일명과 1:1로 맞춘다.
 */
@Entity(name = "CatalogPet")
@Table(
        name = "pets",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_pets_slug", columnNames = "slug"),
                @UniqueConstraint(name = "uk_pets_name", columnNames = "name")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 80)
    private String slug;

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
    public Pet(String name, String slug, String imageUrl, Boolean isActive) {
        this.name = name;
        this.slug = slug;
        this.imageUrl = imageUrl;
        if (isActive != null) {
            this.isActive = isActive;
        }
    }

    public void updateProfile(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }
}
