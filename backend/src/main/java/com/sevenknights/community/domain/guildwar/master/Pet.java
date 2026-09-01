package com.sevenknights.community.domain.guildwar.master;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 길드전 가이드에서 참조하는 펫 마스터.
 * <p>
 * 추천 공격팀은 이름·이미지 URL을 복제하지 않고 {@code pet_id}로만 가리킨다.
 * 상대 방어팀 펫은 아직 문자열(이름+URL)이라 이 테이블과 분리되어 있다.
 */
@Entity
@Table(name = "gw_pets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

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
    public Pet(String name, String imageUrl, Boolean isActive) {
        this.name = name;
        this.imageUrl = imageUrl;
        if (isActive != null) {
            this.isActive = isActive;
        }
    }
}
