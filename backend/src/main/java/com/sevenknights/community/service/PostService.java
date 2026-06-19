package com.sevenknights.community.service;

import com.sevenknights.community.domain.post.BoardType;
import com.sevenknights.community.domain.post.Post;
import com.sevenknights.community.domain.post.PostImage;
import com.sevenknights.community.domain.post.PostImageRepository;
import com.sevenknights.community.domain.post.PostRepository;
import com.sevenknights.community.domain.user.Role;
import com.sevenknights.community.domain.user.User;
import com.sevenknights.community.domain.user.UserRepository;
import com.sevenknights.community.dto.common.PageResponse;
import com.sevenknights.community.dto.post.PostCreateRequest;
import com.sevenknights.community.dto.post.PostDetailResponse;
import com.sevenknights.community.dto.post.PostSummaryResponse;
import com.sevenknights.community.dto.post.PostUpdateRequest;
import com.sevenknights.community.global.exceptions.BadRequestException;
import com.sevenknights.community.global.exceptions.ForbiddenException;
import com.sevenknights.community.global.exceptions.NotFoundException;
import com.sevenknights.community.global.exceptions.UnAuthorizedException;
import com.sevenknights.community.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private static final int MAX_IMAGE_COUNT = 10;

    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> getPosts(BoardType boardType, int page, int size) {
        // DB 페이징 결과를 API 응답용 PageResponse로 변환
        Pageable pageable = PageRequest.of(page, size);
        Page<PostSummaryResponse> result = postRepository
                .findByBoardTypeAndHiddenFalseOrderByCreatedAtDesc(boardType, pageable)
                .map(PostSummaryResponse::from);
        return PageResponse.from(result);
    }

    @Transactional
    public PostDetailResponse getPost(Long id) {
        // 게시글 상세 조회 시 조회수를 즉시 1 증가시킨다.
        Post post = findVisiblePost(id);
        post.increaseViewCount();
        List<PostImage> images = postImageRepository.findByPostIdOrderBySortOrderAsc(post.getId());
        return PostDetailResponse.from(post, images);
    }

    @Transactional
    public PostDetailResponse createPost(PostCreateRequest request, List<MultipartFile> files) {
        // SecurityContext에서 현재 로그인 사용자를 읽어 작성자로 연결
        CustomUserDetails currentUser = getCurrentUser();
        validateCreatePermission(request.boardType(), currentUser);
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .boardType(request.boardType())
                .author(author)
                .build();

        Post savedPost = postRepository.save(post);
        List<PostImage> images = saveImages(savedPost, files);
        return PostDetailResponse.from(savedPost, images);
    }

    @Transactional
    public PostDetailResponse updatePost(Long id, PostUpdateRequest request) {
        Post post = findPost(id);
        // 작성자 본인 또는 관리자만 수정 가능
        validateOwnerOrAdmin(post);
        post.update(request.title(), request.content());
        List<PostImage> images = postImageRepository.findByPostIdOrderBySortOrderAsc(post.getId());
        return PostDetailResponse.from(post, images);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = findPost(id);
        // 작성자 본인 또는 관리자만 삭제 가능
        validateOwnerOrAdmin(post);
        List<PostImage> images = postImageRepository.findByPostIdOrderBySortOrderAsc(post.getId());
        fileStorageService.deleteAll(images.stream().map(PostImage::getStoredFileName).toList());
        postImageRepository.deleteByPostId(post.getId());
        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostSummaryResponse> result = postRepository.findAll(pageable).map(PostSummaryResponse::from);
        return PageResponse.from(result);
    }

    @Transactional
    public void deletePostByAdmin(Long id) {
        Post post = findPost(id);
        List<PostImage> images = postImageRepository.findByPostIdOrderBySortOrderAsc(post.getId());
        fileStorageService.deleteAll(images.stream().map(PostImage::getStoredFileName).toList());
        postImageRepository.deleteByPostId(post.getId());
        postRepository.delete(post);
    }

    @Transactional
    public PostSummaryResponse updateVisibilityByAdmin(Long id, boolean hidden) {
        Post post = findPost(id);
        post.setHidden(hidden);
        return PostSummaryResponse.from(post);
    }

    private Post findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));
    }

    private Post findVisiblePost(Long id) {
        Post post = findPost(id);
        if (post.isHidden()) {
            throw new NotFoundException("게시글을 찾을 수 없습니다.");
        }
        return post;
    }

    private void validateOwnerOrAdmin(Post post) {
        CustomUserDetails currentUser = getCurrentUser();
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (post.getBoardType() == BoardType.NOTICE) {
            if (!isAdmin) {
                throw new ForbiddenException("공지사항은 관리자만 수정/삭제할 수 있습니다.");
            }
            return;
        }

        boolean isOwner = post.getAuthor().getId().equals(currentUser.getId());
        if (!isOwner) {
            throw new ForbiddenException("게시글을 수정/삭제할 권한이 없습니다.");
        }
    }

    private CustomUserDetails getCurrentUser() {
        // JWT 필터가 넣어둔 인증 정보를 꺼내 현재 사용자로 사용
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails details)) {
            throw new UnAuthorizedException("로그인이 필요합니다.");
        }
        return details;
    }

    private void validateCreatePermission(BoardType boardType, CustomUserDetails currentUser) {
        if (boardType == BoardType.NOTICE && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenException("공지사항은 관리자만 작성할 수 있습니다.");
        }
    }

    private List<PostImage> saveImages(Post post, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        long uploadCount = files.stream().filter(file -> file != null && !file.isEmpty()).count();
        if (uploadCount > MAX_IMAGE_COUNT) {
            throw new BadRequestException("이미지는 최대 10장까지 업로드할 수 있습니다.");
        }

        int order = 0;
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String storedName = fileStorageService.store(file);
            PostImage image = PostImage.builder()
                    .post(post)
                    .storedFileName(storedName)
                    .originalFileName(file.getOriginalFilename())
                    .sortOrder(order++)
                    .build();
            postImageRepository.save(image);
        }

        return postImageRepository.findByPostIdOrderBySortOrderAsc(post.getId());
    }
}
