package com.sevenknights.community.global.rests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class JSONError {
    private HttpStatus status;
    private Object messages;
}
