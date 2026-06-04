package com.sevenknights.community.dto.auth;

public record TokenResponse(
        String accessToken,
        String tokenType,
        UserResponse user
) {
    public static TokenResponse of(String accessToken, UserResponse user) {
        return new TokenResponse(accessToken, "Bearer", user);
    }
}
