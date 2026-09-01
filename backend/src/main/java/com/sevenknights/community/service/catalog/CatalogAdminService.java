package com.sevenknights.community.service.catalog;

import com.sevenknights.community.domain.hero.HeroRepository;
import com.sevenknights.community.domain.pet.PetCatalogRepository;
import com.sevenknights.community.dto.catalog.HeroCatalogResponse;
import com.sevenknights.community.dto.catalog.PetCatalogResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CatalogAdminService {

    private final HeroRepository heroRepository;
    private final PetCatalogRepository petCatalogRepository;

    public List<HeroCatalogResponse> listActiveHeroes() {
        return heroRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(HeroCatalogResponse::from)
                .toList();
    }

    public List<PetCatalogResponse> listActivePets() {
        return petCatalogRepository.findByIsActiveTrueOrderByNameAsc().stream()
                .map(PetCatalogResponse::from)
                .toList();
    }
}
