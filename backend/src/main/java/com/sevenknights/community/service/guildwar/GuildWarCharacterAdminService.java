package com.sevenknights.community.service.guildwar;

import com.sevenknights.community.domain.guildwar.character.GameCharacter;
import com.sevenknights.community.domain.guildwar.character.GameCharacterRepository;
import com.sevenknights.community.domain.guildwar.character.Skill;
import com.sevenknights.community.domain.guildwar.character.SkillRepository;
import com.sevenknights.community.dto.guildwar.character.GameCharacterAdminResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GuildWarCharacterAdminService {

    private final GameCharacterRepository gameCharacterRepository;
    private final SkillRepository skillRepository;

    public List<GameCharacterAdminResponse> listActiveCharacters() {
        List<GameCharacter> characters = gameCharacterRepository.findByIsActiveTrueOrderByNameAsc();
        return characters.stream()
                .map(character -> {
                    List<Skill> skills = skillRepository.findByCharacterIdAndIsActiveTrueOrderBySortOrderAsc(
                            character.getId()
                    );
                    return GameCharacterAdminResponse.from(character, skills);
                })
                .toList();
    }
}
