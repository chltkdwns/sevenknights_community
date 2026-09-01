package com.sevenknights.community.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({JwtProperties.class, UploadProperties.class, HeroProperties.class, PetProperties.class})
public class AppPropertiesConfig {
}
