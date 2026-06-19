package com.sevenknights.community.service;

import com.sevenknights.community.domain.user.UserRepository;
import com.sevenknights.community.dto.auth.UserResponse;
import com.sevenknights.community.dto.common.PageResponse;
import com.sevenknights.community.dto.post.PostSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostService postService;

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> getAllPosts(int page, int size) {
        return postService.getAllPosts(page, size);
    }

    @Transactional
    public void deletePost(Long id) {
        postService.deletePostByAdmin(id);
    }

    @Transactional
    public PostSummaryResponse updatePostVisibility(Long id, boolean hidden) {
        return postService.updateVisibilityByAdmin(id, hidden);
    }
}
