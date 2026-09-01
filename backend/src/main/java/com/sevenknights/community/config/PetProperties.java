package com.sevenknights.community.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.pet")
public record PetProperties(
        /** true이면 애플리케이션 기동 시 pets-seed.json을 DB에 적재한다. */
        boolean seed
) {
}
