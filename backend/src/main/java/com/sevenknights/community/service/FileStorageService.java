package com.sevenknights.community.service;

import com.sevenknights.community.config.UploadProperties;
import com.sevenknights.community.global.exceptions.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final UploadProperties uploadProperties;
    private Path uploadRoot;

    @PostConstruct
    void init() {
        uploadRoot = Paths.get(uploadProperties.dir()).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new IllegalStateException("업로드 디렉터리를 생성할 수 없습니다.", e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("빈 파일은 업로드할 수 없습니다.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("이미지 1장당 최대 5MB까지 업로드할 수 있습니다.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("jpg, jpeg, png, webp 이미지만 업로드할 수 있습니다.");
        }

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (!StringUtils.hasText(extension) || !ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BadRequestException("jpg, jpeg, png, webp 이미지만 업로드할 수 있습니다.");
        }
        String storedFileName = UUID.randomUUID() + (extension != null ? "." + extension : "");

        try {
            Path target = uploadRoot.resolve(storedFileName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return storedFileName;
        } catch (IOException e) {
            throw new BadRequestException("파일 저장에 실패했습니다.");
        }
    }

    public void storeAll(List<MultipartFile> files) {
        if (files == null) {
            return;
        }
        files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .forEach(this::store);
    }

    public void delete(String storedFileName) {
        if (!StringUtils.hasText(storedFileName)) {
            return;
        }
        try {
            Files.deleteIfExists(uploadRoot.resolve(storedFileName));
        } catch (IOException e) {
            throw new BadRequestException("파일 삭제에 실패했습니다.");
        }
    }

    public void deleteAll(List<String> storedFileNames) {
        if (storedFileNames == null) {
            return;
        }
        storedFileNames.forEach(this::delete);
    }
}
