package com.sevenknights.community.controller;

import com.sevenknights.community.dto.common.UploadedImageResponse;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public JSONData<UploadedImageResponse> uploadImage(@RequestPart("image") MultipartFile image) {
        String storedFileName = fileStorageService.store(image);
        return JSONData.of(HttpStatus.CREATED, new UploadedImageResponse("/uploads/" + storedFileName));
    }
}
