package com.sevenknights.community.config;

import com.sevenknights.community.service.pet.PetSeedResult;
import com.sevenknights.community.service.pet.PetSeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.pet", name = "seed", havingValue = "true")
public class PetSeedRunner implements ApplicationRunner {

    private final PetSeedService petSeedService;

    @Override
    public void run(ApplicationArguments args) {
        PetSeedResult result = petSeedService.seed();
        log.info(
                "Pet seed completed — inserted={}, updated={}, unchanged={}, fileTotal={}, dbTotal={}",
                result.inserted(),
                result.updated(),
                result.unchanged(),
                result.totalInFile(),
                result.totalInDatabase()
        );
    }
}
