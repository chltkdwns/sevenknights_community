package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillType;

/**
 * 스킬 시퀀스 한 스텝 응답.
 * skill FK가 있으면 카탈로그 모드, note만 있으면 직접 입력 모드다.
 */
public record SkillStepResponse(
        int stepOrder,
        boolean skipped,
        String note,
        Long skillId,
        SkillType skillType,
        String skillName,
        String skillImageUrl,
        Long characterId,
        String characterName
) {
    public static SkillStepResponse from(GuildWarSkillStep step) {
        Skill skill = step.getSkill();
        if (skill == null) {
            boolean hasManualText = step.getNote() != null && !step.getNote().isBlank();
            return new SkillStepResponse(
                    step.getStepOrder(),
                    !hasManualText,
                    step.getNote(),
                    null,
                    null,
                    hasManualText ? step.getNote() : null,
                    null,
                    null,
                    null
            );
        }
        return new SkillStepResponse(
                step.getStepOrder(),
                false,
                step.getNote(),
                skill.getId(),
                skill.getSkillType(),
                skill.getName(),
                skill.getImageUrl(),
                skill.getCharacter().getId(),
                skill.getCharacter().getName()
        );
    }
}
