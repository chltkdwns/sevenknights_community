package com.sevenknights.community.dto.guildwar.character;

import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillType;

public record SkillAdminResponse(
        Long id,
        SkillType skillType,
        String name,
        String imageUrl,
        int sortOrder
) {
    public static SkillAdminResponse from(Skill skill) {
        return new SkillAdminResponse(
                skill.getId(),
                skill.getSkillType(),
                skill.getName(),
                skill.getImageUrl(),
                skill.getSortOrder()
        );
    }
}
