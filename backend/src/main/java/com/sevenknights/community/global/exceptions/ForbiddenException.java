package com.sevenknights.community.global.exceptions;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends CommonException {
    public ForbiddenException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
