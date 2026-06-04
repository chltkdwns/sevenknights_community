package com.sevenknights.community.dto.post;

import com.sevenknights.community.domain.post.BoardType;
import com.sevenknights.community.domain.post.Post;
import com.sevenknights.community.domain.post.PostImage;

import java.time.LocalDateTime;
import java.util.List;

public record PostDetailResponse(
        Long id,
        String title,
        String content,
        BoardType boardType,
        long viewCount,
        Long authorId,
        String authorNickname,
        List<PostImageResponse> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static PostDetailResponse from(Post post, List<PostImage> images) {
        return new PostDetailResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getBoardType(),
                post.getViewCount(),
                post.getAuthor().getId(),
                post.getAuthor().getNickname(),
                images.stream().map(PostImageResponse::from).toList(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
