package com.sevenknights.community.service;

import com.sevenknights.community.domain.user.Role;
import com.sevenknights.community.domain.user.User;
import com.sevenknights.community.domain.user.UserRepository;
import com.sevenknights.community.dto.auth.UserResponse;
import com.sevenknights.community.dto.common.PageResponse;
import com.sevenknights.community.dto.post.PostSummaryResponse;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.exceptions.NotFoundException;
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

    /**
     * 길드원 승인 상태만 바꾼다. USER↔MEMBER만 허용하고 ADMIN 계정은 건드리지 않는다.
     */
    @Transactional
    public UserResponse updateGuildRole(Long id, Role role) {
        if (role != Role.USER && role != Role.MEMBER) {
            throw new BadRequestException("길드원 승인 상태만 변경할 수 있습니다.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("관리자 권한은 이 화면에서 변경할 수 없습니다.");
        }

        user.changeRole(role);
        return UserResponse.from(user);
    }
}
