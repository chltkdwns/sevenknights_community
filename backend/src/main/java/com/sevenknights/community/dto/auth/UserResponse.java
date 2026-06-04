package com.sevenknights.community.dto.auth;

import com.sevenknights.community.domain.user.Role;
import com.sevenknights.community.domain.user.User;

public record UserResponse(
        Long id,
        String username,
        String email,
        String nickname,
        Role role
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getNickname(),
                user.getRole()
        );
    }
}
