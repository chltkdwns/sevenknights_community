package com.sevenknights.community.global.libs;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ValidationMessages {
    public Map<String, List<String>> getErrorMessages(Errors errors) {
        return errors.getFieldErrors()
                .stream()
                .collect(Collectors.groupingBy(
                        FieldError::getField,
                        Collectors.mapping(
                                fieldError -> {
                                    String message = fieldError.getDefaultMessage();
                                    return (message == null || message.isBlank()) ? "입력값이 올바르지 않습니다." : message;
                                },
                                Collectors.toList()
                        )
                ));
    }
}
