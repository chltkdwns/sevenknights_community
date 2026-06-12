package com.sevenknights.community.dto.guildwar.attack;

import com.sevenknights.community.domain.guildwar.attack.GuildWarSkillStep;
import com.sevenknights.community.domain.guildwar.character.SkillType;

/**
 * 스킬 시퀀스 한 스텝 응답.
 * {@code skillId}만 내리면 프론트가 스킬 메타를 추가 조회해야 하므로,
 * 가이드 상세 화면을 한 번의 API로 그리기 위해 스킬·소유 캐릭터 정보를 펼쳐서 내려준다.
 */
public record SkillStepResponse(
        int stepOrder,
        String note,
        Long skillId,
        SkillType skillType,
        String skillName,
        String skillImageUrl,
        Long characterId,
        String characterName
) {
    public static SkillStepResponse from(GuildWarSkillStep step) {
        return new SkillStepResponse(
                step.getStepOrder(),
                step.getNote(),
                step.getSkill().getId(),
                step.getSkill().getSkillType(),
                step.getSkill().getName(),
                step.getSkill().getImageUrl(),
                step.getSkill().getCharacter().getId(),
                step.getSkill().getCharacter().getName()
        );
    }
}
