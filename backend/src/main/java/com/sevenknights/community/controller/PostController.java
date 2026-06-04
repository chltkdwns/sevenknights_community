package com.sevenknights.community.controller;

import com.sevenknights.community.domain.post.BoardType;
import com.sevenknights.community.dto.common.PageResponse;
import com.sevenknights.community.dto.post.PostCreateRequest;
import com.sevenknights.community.dto.post.PostDetailResponse;
import com.sevenknights.community.dto.post.PostSummaryResponse;
import com.sevenknights.community.dto.post.PostUpdateRequest;
import com.sevenknights.community.board.validators.PostValidator;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.libs.ValidationMessages;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostValidator postValidator;
    private final ValidationMessages validationMessages;
    private final Validator validator;

    @GetMapping
    public ResponseEntity<JSONData<PageResponse<PostSummaryResponse>>> getPosts(
            @RequestParam BoardType boardType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        // 게시판 타입(FREE/GUIDE) 기준으로 페이징 목록 조회
        PageResponse<PostSummaryResponse> data = postService.getPosts(boardType, page, size);
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JSONData<PostDetailResponse>> getPost(@PathVariable Long id) {
        // 상세 조회 시 조회수 증가 로직은 서비스에서 처리
        PostDetailResponse data = postService.getPost(id);
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, data));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public JSONData<PostDetailResponse> createPost(
            @RequestPart("request") PostCreateRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        Errors errors = new BeanPropertyBindingResult(request, "request");
        validator.validate(request, errors);
        // 요청 유효성 검증 실패 시 필드 단위 메시지로 반환
        postValidator.validate(request, errors);
        if (errors.hasErrors()) {
            throw new BadRequestException(validationMessages.getErrorMessages(errors));
        }
        PostDetailResponse data = postService.createPost(request, images);
        return JSONData.of(HttpStatus.CREATED, data);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JSONData<PostDetailResponse>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request,
            Errors errors
    ) {
        // 수정 권한(작성자/관리자) 검사는 서비스에서 처리
        postValidator.validate(request, errors);
        if (errors.hasErrors()) {
            throw new BadRequestException(validationMessages.getErrorMessages(errors));
        }
        PostDetailResponse data = postService.updatePost(id, request);
        return ResponseEntity.ok(JSONData.of(HttpStatus.OK, data));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        // 삭제 권한(작성자/관리자) 검사는 서비스에서 처리
        postService.deletePost(id);
    }
}
