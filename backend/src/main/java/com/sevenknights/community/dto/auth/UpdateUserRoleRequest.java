package com.sevenknights.community.dto.auth;

import com.sevenknights.community.domain.user.Role;
import jakarta.validation.constraints.NotNull;

/** 관리자가 USER↔MEMBER만 바꿀 때 사용한다. ADMIN 승격은 이 API로 하지 않는다. */
public record UpdateUserRoleRequest(
        @NotNull(message = "권한을 선택해 주세요.")
        Role role
) {
}
