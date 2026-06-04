package com.sevenknights.community.dto.post;

import com.sevenknights.community.domain.post.PostImage;

public record PostImageResponse(
        Long id,
        String url,
        String originalFileName,
        int sortOrder
) {
    public static PostImageResponse from(PostImage image) {
        return new PostImageResponse(
                image.getId(),
                "/uploads/" + image.getStoredFileName(),
                image.getOriginalFileName(),
                image.getSortOrder()
        );
    }
}
