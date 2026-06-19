package com.sevenknights.community.domain.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

    // 게시판 타입별 최신글 목록을 페이징으로 조회 (숨김 제외)
    Page<Post> findByBoardTypeAndHiddenFalseOrderByCreatedAtDesc(BoardType boardType, Pageable pageable);
}
