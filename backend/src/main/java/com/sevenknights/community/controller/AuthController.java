package com.sevenknights.community.controller;

import com.sevenknights.community.dto.auth.LoginRequest;
import com.sevenknights.community.dto.auth.SignupRequest;
import com.sevenknights.community.dto.auth.TokenResponse;
import com.sevenknights.community.dto.auth.UserResponse;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.libs.ValidationMessages;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.member.validators.SignupValidator;
import com.sevenknights.community.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SignupValidator signupValidator;
    private final ValidationMessages validationMessages;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public JSONData<UserResponse> signup(@Valid @RequestBody SignupRequest request, Errors errors) {
        signupValidator.validate(request, errors);
        if (errors.hasErrors()) {
            throw new BadRequestException(validationMessages.getErrorMessages(errors));
        }

        UserResponse data = authService.signup(request);
        return JSONData.of(HttpStatus.CREATED, data);
    }

    @PostMapping("/login")
    public ResponseEntity<JSONData<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse data = authService.login(request);
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, data));
    }
}
