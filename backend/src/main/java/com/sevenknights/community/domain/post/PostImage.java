package com.sevenknights.community.domain.post;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, length = 255)
    private String storedFileName;

    @Column(nullable = false, length = 255)
    private String originalFileName;

    @Column(nullable = false)
    private int sortOrder;

    @Builder
    public PostImage(Post post, String storedFileName, String originalFileName, int sortOrder) {
        this.post = post;
        this.storedFileName = storedFileName;
        this.originalFileName = originalFileName;
        this.sortOrder = sortOrder;
    }
}
