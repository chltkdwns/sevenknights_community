package com.sevenknights.community.controller;

import com.sevenknights.community.dto.guildwar.character.GameCharacterAdminResponse;
import com.sevenknights.community.global.rests.JSONData;
import com.sevenknights.community.service.guildwar.GuildWarCharacterAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/guild-war/characters")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class GuildWarCharacterAdminController {

    private final GuildWarCharacterAdminService guildWarCharacterAdminService;

    @GetMapping
    public JSONData<List<GameCharacterAdminResponse>> list() {
        return JSONData.of(HttpStatus.OK, guildWarCharacterAdminService.listActiveCharacters());
    }
}
