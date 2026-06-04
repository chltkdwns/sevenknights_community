package com.sevenknights.community.service;

import com.sevenknights.community.domain.user.Role;
import com.sevenknights.community.domain.user.User;
import com.sevenknights.community.domain.user.UserRepository;
import com.sevenknights.community.dto.auth.LoginRequest;
import com.sevenknights.community.dto.auth.SignupRequest;
import com.sevenknights.community.dto.auth.TokenResponse;
import com.sevenknights.community.dto.auth.UserResponse;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.exceptions.NotFoundException;
import com.sevenknights.community.security.CustomUserDetails;
import com.sevenknights.community.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public UserResponse signup(SignupRequest request) {
        // 서비스 레벨에서도 중복을 한번 더 확인해 데이터 무결성을 지킨다.
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("이미 사용 중인 아이디입니다.");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("이미 사용 중인 이메일입니다.");
        }

        // 비밀번호는 반드시 해시(BCrypt)로 저장한다.
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .role(Role.USER)
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    public TokenResponse login(LoginRequest request) {
        // AuthenticationManager가 아이디/비밀번호 인증을 수행한다.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        // 인증 성공 정보를 바탕으로 JWT를 발급한다.
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtTokenProvider.createToken(authentication);
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        return TokenResponse.of(token, UserResponse.from(user));
    }
}
