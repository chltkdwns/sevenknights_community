package com.sevenknights.community.global.rests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class JSONData<T> {
    private HttpStatus status;
    private T data;

    public static <T> JSONData<T> of(HttpStatus status, T data) {
        return new JSONData<>(status, data);
    }
}
