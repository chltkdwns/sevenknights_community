package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillType;

/** 공개 가이드에서 캐릭터 스킬 아이콘·이름을 표시하기 위한 스냅샷. */
public record CharacterSkillResponse(
        Long id,
        SkillType skillType,
        String name,
        String imageUrl,
        int sortOrder
) {
    public static CharacterSkillResponse from(Skill skill) {
        return new CharacterSkillResponse(
                skill.getId(),
                skill.getSkillType(),
                skill.getName(),
                skill.getImageUrl(),
                skill.getSortOrder()
        );
    }
}
