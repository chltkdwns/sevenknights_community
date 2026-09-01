package com.sevenknights.community.config;

import com.sevenknights.community.service.hero.HeroSeedResult;
import com.sevenknights.community.service.hero.HeroSeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * {@code app.hero.seed=true}일 때만 영웅 시드를 실행한다.
 * 기본값은 false라 기존 배포·개발 서버 동작에 영향을 주지 않는다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.hero", name = "seed", havingValue = "true")
public class HeroSeedRunner implements ApplicationRunner {

    private final HeroSeedService heroSeedService;

    @Override
    public void run(ApplicationArguments args) {
        HeroSeedResult result = heroSeedService.seed();
        log.info(
                "Hero seed completed — inserted={}, updated={}, unchanged={}, fileTotal={}, dbTotal={}",
                result.inserted(),
                result.updated(),
                result.unchanged(),
                result.totalInFile(),
                result.totalInDatabase()
        );
    }
}
