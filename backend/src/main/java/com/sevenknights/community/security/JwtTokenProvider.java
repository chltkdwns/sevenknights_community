package com.sevenknights.community.security;

import com.sevenknights.community.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    public String createToken(Authentication authentication) {
        // 로그인 성공 시 사용자 식별 정보(userId/role)를 JWT claim으로 담아 발급
        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.expirationMs());

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("userId", principal.getId())
                .claim("role", principal.getRole().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey())
                .compact();
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            // 서명/만료 등 파싱 단계에서 토큰 유효성을 함께 검증한다.
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        byte[] keyBytes = jwtProperties.secret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
