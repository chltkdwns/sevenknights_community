package com.sevenknights.community.member.validators;

import com.sevenknights.community.domain.user.UserRepository;
import com.sevenknights.community.dto.auth.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
@RequiredArgsConstructor
public class SignupValidator implements Validator {

    private final UserRepository userRepository;

    @Override
    public boolean supports(Class<?> clazz) {
        return clazz.isAssignableFrom(SignupRequest.class);
    }

    @Override
    public void validate(Object target, Errors errors) {
        if (errors.hasErrors()) {
            return;
        }

        SignupRequest form = (SignupRequest) target;
        if (userRepository.existsByUsername(form.username())) {
            errors.rejectValue("username", "Duplicated", "이미 사용 중인 아이디입니다.");
        }

        if (userRepository.existsByEmail(form.email())) {
            errors.rejectValue("email", "Duplicated", "이미 사용 중인 이메일입니다.");
        }
    }
}
