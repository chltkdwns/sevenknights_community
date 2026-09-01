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
 * 길드전 가이드에서 참조하는 반지 마스터.
 * <p>
 * 반지 자체(이름·이미지)는 여기 ID로 저장하고, 세공 문구는 가이드마다 다르므로
 * 마스터가 아니라 {@code gw_attack_member_rings.enchantment}에 문자열로 둔다.
 */
@Entity
@Table(name = "gw_rings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Ring {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
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
    public Ring(String name, String imageUrl, Boolean isActive) {
        this.name = name;
        this.imageUrl = imageUrl;
        if (isActive != null) {
            this.isActive = isActive;
        }
    }
}
