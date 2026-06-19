package com.sevenknights.community.controller;

import com.sevenknights.community.dto.auth.UserResponse;
import com.sevenknights.community.dto.common.PageResponse;
import com.sevenknights.community.dto.post.PostSummaryResponse;
import com.sevenknights.community.dto.post.PostVisibilityRequest;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<JSONData<List<UserResponse>>> users() {
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, adminService.getUsers()));
    }

    @GetMapping("/posts")
    public ResponseEntity<JSONData<PageResponse<PostSummaryResponse>>> posts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, adminService.getAllPosts(page, size)));
    }

    @DeleteMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
    }

    @PutMapping("/posts/{id}/visibility")
    public ResponseEntity<JSONData<PostSummaryResponse>> updatePostVisibility(
            @PathVariable Long id,
            @Valid @RequestBody PostVisibilityRequest request
    ) {
        PostSummaryResponse updated = adminService.updatePostVisibility(id, request.hidden());
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, updated));
    }
}
