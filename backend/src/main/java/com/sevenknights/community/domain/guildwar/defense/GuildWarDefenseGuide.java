package com.sevenknights.community.domain.guildwar.defense;

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
 * 우리 길드 방어 가이드. 공격 가이드({@code domain.guildwar.attack})와 패키지·테이블을 분리한다.
 * <p>
 * 분리 이유:
 * <ul>
 *   <li>도메인 질문이 다르다 — 공격은 "상대팀 → 추천 공격·스킬 순서", 방어는 "우리 편성·세팅·운영 팁".</li>
 *   <li>방어에는 스킬 시퀀스·추천 N벌 개념이 없어 attack 트리를 재사용하면 불필요한 null/빈 컬렉션이 생긴다.</li>
 *   <li>API·관리 화면·공개 URL을 {@code /guild-war/attack} vs {@code /guild-war/defense}로 나누기 쉽다.</li>
 * </ul>
 * 캐릭터 마스터({@link com.sevenknights.community.domain.guildwar.character.GameCharacter})만 공유한다.
 */
@Entity
@Table(name = "gw_defense_guides")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GuildWarDefenseGuide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String recommendedSetting;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String operationTip;

    @Column(nullable = false)
    private int sortOrder;

    @Column(nullable = false)
    private boolean isPublished = false;

    /**
     * MVP: 방어 편성에 사용한 펫을 표시용으로만 저장한다.
     * Pet Entity 없이 문자열·URL을 둔 이유는 펫 효과·도감이 MVP 범위 밖이기 때문이다.
     * 추후 {@code pets} 테이블 + {@code pet_id} FK로 마이그레이션할 수 있다.
     */
    @Column(name = "pet_name", length = 50)
    private String petName;

    @Column(name = "pet_image_url", length = 500)
    private String petImageUrl;

    @OneToMany(mappedBy = "defenseGuide", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuildWarDefenseGuideMember> members = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    public GuildWarDefenseGuide(
            String title,
            String recommendedSetting,
            String description,
            String operationTip,
            int sortOrder,
            Boolean isPublished,
            String petName,
            String petImageUrl
    ) {
        this.title = title;
        this.recommendedSetting = recommendedSetting;
        this.description = description;
        this.operationTip = operationTip;
        this.sortOrder = sortOrder;
        if (isPublished != null) {
            this.isPublished = isPublished;
        }
        this.petName = petName;
        this.petImageUrl = petImageUrl;
    }
}
