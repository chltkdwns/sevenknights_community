package com.sevenknights.community.global.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@Getter
public class CommonException extends RuntimeException {
    private final HttpStatus status;
    private Map<String, List<String>> errorMessages;

    public CommonException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public CommonException(Map<String, List<String>> errorMessages, HttpStatus status) {
        super("Validation failed");
        this.status = status;
        this.errorMessages = errorMessages;
    }
}
