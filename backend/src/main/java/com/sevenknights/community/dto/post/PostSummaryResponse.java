package com.sevenknights.community.dto.post;

import com.sevenknights.community.domain.post.BoardType;
import com.sevenknights.community.domain.post.Post;

import java.time.LocalDateTime;

public record PostSummaryResponse(
        Long id,
        String title,
        BoardType boardType,
        long viewCount,
        String authorNickname,
        LocalDateTime createdAt,
        boolean hidden
) {
    public static PostSummaryResponse from(Post post) {
        return new PostSummaryResponse(
                post.getId(),
                post.getTitle(),
                post.getBoardType(),
                post.getViewCount(),
                post.getAuthor().getNickname(),
                post.getCreatedAt(),
                post.isHidden()
        );
    }
}
