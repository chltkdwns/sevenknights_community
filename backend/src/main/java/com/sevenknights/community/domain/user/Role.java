package com.sevenknights.community.domain.user;

/**
 * 사이트 권한. 별도 회원 테이블 없이 users.role 컬럼으로만 구분한다.
 * USER: 가입만 한 상태(길드전 공략 불가), MEMBER: 관리자 승인 길드원, ADMIN: 관리자.
 */
public enum Role {
    USER,
    MEMBER,
    ADMIN
}
