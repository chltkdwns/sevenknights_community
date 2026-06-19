package com.sevenknights.community.dto.guildwar.character;

import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.guildwar.character.Skill;

import java.util.List;

public record GameCharacterAdminResponse(
        Long id,
        String name,
        String imageUrl,
        List<SkillAdminResponse> skills
) {
    public static GameCharacterAdminResponse from(GameCharacter character, List<Skill> skills) {
        return new GameCharacterAdminResponse(
                character.getId(),
                character.getName(),
                character.getImageUrl(),
                skills.stream().map(SkillAdminResponse::from).toList()
        );
    }
}
