import { getSkillTypeLabel } from "@/components/guild-war/skill-label";
import type { GameCharacterAdmin, HeroCatalog } from "@/types/guild-war";
import type { SkillStepSlot, TeamMemberSlot } from "@/lib/guild-war-admin";

const SKIP_VALUE = "SKIP";

type SkillStepEditorProps = {
  attackTeamMembers: TeamMemberSlot[];
  heroes: HeroCatalog[];
  characters: GameCharacterAdmin[];
  skillSteps: SkillStepSlot[];
  onChange: (steps: SkillStepSlot[]) => void;
};

function getAvailableSkills(
  attackTeamMembers: TeamMemberSlot[],
  heroes: HeroCatalog[],
  characters: GameCharacterAdmin[]
) {
  const heroNames = new Set(
    attackTeamMembers
      .map((member) => heroes.find((hero) => hero.id === member.characterId)?.name)
      .filter((name): name is string => name != null)
  );

  return characters
    .filter((character) => heroNames.has(character.name))
    .flatMap((character) =>
      character.skills.map((skill) => ({
        ...skill,
        characterName: character.name,
      }))
    );
}

function firstSkipIndex(steps: SkillStepSlot[]) {
  return steps.findIndex((step) => step.skipped);
}

export function SkillStepEditor({
  attackTeamMembers,
  heroes,
  characters,
  skillSteps,
  onChange,
}: SkillStepEditorProps) {
  const availableSkills = getAvailableSkills(attackTeamMembers, heroes, characters);
  const skipAt = firstSkipIndex(skillSteps);

  const updateStep = (index: number, value: string) => {
    const next = skillSteps.map((step) => ({ ...step }));
    if (value === SKIP_VALUE) {
      next[index] = { ...next[index], skillId: null, skipped: true, note: "" };
      for (let later = index + 1; later < next.length; later += 1) {
        next[later] = { ...next[later], skillId: null, skipped: false, note: "" };
      }
    } else {
      next[index] = {
        ...next[index],
        skillId: value ? Number(value) : null,
        skipped: false,
      };
    }
    onChange(next);
  };

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-muted">스킬 사용 순서</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {skillSteps.map((step, index) => {
          const disabled = skipAt >= 0 && index > skipAt;
          const selectValue = step.skipped ? SKIP_VALUE : step.skillId != null ? String(step.skillId) : "";

          return (
            <label key={step.stepOrder} className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">{index + 1}번</span>
              <select
                value={disabled ? "" : selectValue}
                disabled={disabled}
                onChange={(event) => updateStep(index, event.target.value)}
                className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {disabled ? (
                  <option value="">선택 불가</option>
                ) : (
                  <>
                    <option value="">영웅 스킬 선택</option>
                    <option value={SKIP_VALUE}>스킬 사용 X</option>
                    {availableSkills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.characterName} · {skill.name} ({getSkillTypeLabel(skill.skillType)})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </label>
          );
        })}
      </div>
    </div>
  );
}
