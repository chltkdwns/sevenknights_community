package com.sevenknights.community.board.validators;

import com.sevenknights.community.dto.post.PostCreateRequest;
import com.sevenknights.community.dto.post.PostUpdateRequest;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class PostValidator implements Validator {
    @Override
    public boolean supports(Class<?> clazz) {
        return PostCreateRequest.class.isAssignableFrom(clazz) || PostUpdateRequest.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        if (errors.hasErrors()) {
            return;
        }

        if (target instanceof PostCreateRequest createRequest) {
            validateCommon(createRequest.title(), createRequest.content(), errors);
        } else if (target instanceof PostUpdateRequest updateRequest) {
            validateCommon(updateRequest.title(), updateRequest.content(), errors);
        }
    }

    private void validateCommon(String title, String content, Errors errors) {
        if (title != null && title.trim().length() < 2) {
            errors.rejectValue("title", "Size", "제목은 2자 이상이어야 합니다.");
        }
        if (content != null && content.trim().length() < 5) {
            errors.rejectValue("content", "Size", "내용은 5자 이상이어야 합니다.");
        }
    }
}
