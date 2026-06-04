package com.sevenknights.community.global.exceptions;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends CommonException {
    public UnAuthorizedException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
