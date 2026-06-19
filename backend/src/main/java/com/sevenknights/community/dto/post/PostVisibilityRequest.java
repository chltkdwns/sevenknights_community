package com.sevenknights.community.dto.post;

import jakarta.validation.constraints.NotNull;

public record PostVisibilityRequest(
        @NotNull(message = "숨김 여부를 입력해 주세요.")
        Boolean hidden
) {
}
