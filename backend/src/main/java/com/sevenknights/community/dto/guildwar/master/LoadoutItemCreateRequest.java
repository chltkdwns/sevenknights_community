package com.sevenknights.community.dto.guildwar.master;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoadoutItemCreateRequest(
        @NotBlank(message = "이름을 입력해 주세요.")
        @Size(max = 80, message = "이름은 80자 이하여야 합니다.")
        String name,

        @NotBlank(message = "이미지를 등록해 주세요.")
        @Size(max = 500, message = "이미지 URL은 500자 이하여야 합니다.")
        String imageUrl
) {
}
