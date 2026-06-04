package com.sevenknights.community.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.upload")
public record UploadProperties(String dir) {
}
