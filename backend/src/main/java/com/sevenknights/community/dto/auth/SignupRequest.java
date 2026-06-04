package com.sevenknights.community.dto.auth;

import com.sevenknights.community.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "아이디를 입력해 주세요.")
        @Size(min = 4, max = 50, message = "아이디는 4자 이상 50자 이하여야 합니다.")
        String username,
        @NotBlank(message = "이메일을 입력해 주세요.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        String email,
        @NotBlank(message = "비밀번호를 입력해 주세요.")
        @ValidPassword
        String password,
        @NotBlank(message = "닉네임을 입력해 주세요.")
        @Size(min = 2, max = 30, message = "닉네임은 2자 이상 30자 이하여야 합니다.")
        String nickname
) {
}
