package com.sevenknights.community.domain.guildwar.character;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
 * 길드전 가이드 전역에서 참조하는 캐릭터 마스터.
 * <p>
 * 공격 가이드(상대팀·추천 공격팀)와 방어 가이드가 동일한 캐릭터 풀을 쓰므로
 * 가이드별로 캐릭터 정보를 복제하지 않고 FK로 묶는다.
 * 캐릭터명·이미지가 바뀌면 한 곳만 수정해도 모든 가이드 UI에 반영된다.
 */
@Entity
@Table(name = "characters")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GameCharacter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "character", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Skill> skills = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public GameCharacter(String name, String imageUrl, Boolean isActive) {
        this.name = name;
        this.imageUrl = imageUrl;
        if (isActive != null) {
            this.isActive = isActive;
        }
    }
}
