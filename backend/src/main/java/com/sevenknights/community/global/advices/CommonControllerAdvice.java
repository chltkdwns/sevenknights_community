package com.sevenknights.community.global.advices;

import com.sevenknights.community.global.exceptions.CommonException;
import com.sevenknights.community.global.rests.JSONError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice("com.sevenknights.community")
public class CommonControllerAdvice {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<JSONError> validationHandler(MethodArgumentNotValidException e) {
        Map<String, List<String>> messages = e.getBindingResult().getFieldErrors()
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

        return ResponseEntity.badRequest().body(new JSONError(HttpStatus.BAD_REQUEST, messages));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<JSONError> badCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new JSONError(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<JSONError> errorHandler(Exception e) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        Object messages = "서버 오류가 발생했습니다.";

        if (e instanceof CommonException commonException) {
            status = commonException.getStatus();
            messages = commonException.getErrorMessages() == null
                    ? commonException.getMessage()
                    : commonException.getErrorMessages();
        } else if (e instanceof AuthorizationDeniedException) {
            status = HttpStatus.UNAUTHORIZED;
            messages = "권한이 없습니다.";
        }

        return ResponseEntity.status(status).body(new JSONError(status, messages));
    }
}
