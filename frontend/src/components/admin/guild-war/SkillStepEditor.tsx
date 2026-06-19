import { getSkillTypeLabel } from "@/components/guild-war/skill-label";
import { Button } from "@/components/ui/Button";
import type { GameCharacterAdmin } from "@/types/guild-war";
import type { SkillStepSlot, TeamMemberSlot } from "@/lib/guild-war-admin";

type SkillStepEditorProps = {
  attackTeamMembers: TeamMemberSlot[];
  characters: GameCharacterAdmin[];
  skillSteps: SkillStepSlot[];
  onChange: (steps: SkillStepSlot[]) => void;
};

function getAvailableSkills(attackTeamMembers: TeamMemberSlot[], characters: GameCharacterAdmin[]) {
  const characterIds = new Set(
    attackTeamMembers
      .map((member) => member.characterId)
      .filter((characterId): characterId is number => characterId != null)
  );

  return characters
    .filter((character) => characterIds.has(character.id))
    .flatMap((character) =>
      character.skills.map((skill) => ({
        ...skill,
        characterName: character.name,
      }))
    );
}

export function SkillStepEditor({
  attackTeamMembers,
  characters,
  skillSteps,
  onChange,
}: SkillStepEditorProps) {
  const availableSkills = getAvailableSkills(attackTeamMembers, characters);

  const addStep = () => {
    onChange([
      ...skillSteps,
      {
        stepOrder: skillSteps.length + 1,
        skillId: null,
        note: "",
      },
    ]);
  };

  const updateStep = (index: number, patch: Partial<SkillStepSlot>) => {
    onChange(
      skillSteps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, ...patch } : step
      )
    );
  };

  const removeStep = (index: number) => {
    onChange(
      skillSteps
        .filter((_, stepIndex) => stepIndex !== index)
        .map((step, stepIndex) => ({ ...step, stepOrder: stepIndex + 1 }))
    );
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= skillSteps.length) return;

    const nextSteps = [...skillSteps];
    [nextSteps[index], nextSteps[targetIndex]] = [nextSteps[targetIndex], nextSteps[index]];
    onChange(nextSteps.map((step, stepIndex) => ({ ...step, stepOrder: stepIndex + 1 })));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-muted">스킬 사용 순서</p>
        <Button type="button" variant="secondary" onClick={addStep}>
          스킬 추가
        </Button>
      </div>

      {skillSteps.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
          공격팀 캐릭터를 선택한 뒤 스킬 순서를 추가하세요.
        </p>
      ) : (
        <ol className="space-y-3">
          {skillSteps.map((step, index) => (
            <li
              key={`${step.stepOrder}-${index}`}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{index + 1}번째 스킬</span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => moveStep(index, -1)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => moveStep(index, 1)}
                    disabled={index === skillSteps.length - 1}
                  >
                    ↓
                  </Button>
                  <Button type="button" variant="danger" onClick={() => removeStep(index)}>
                    삭제
                  </Button>
                </div>
              </div>

              <select
                value={step.skillId ?? ""}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  updateStep(index, { skillId: nextValue ? Number(nextValue) : null });
                }}
                className="mb-3 w-full rounded-lg border border-border bg-input-bg px-3 py-2 text-sm outline-none transition focus:border-accent"
              >
                <option value="">스킬 선택</option>
                {availableSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.characterName} · {skill.name} ({getSkillTypeLabel(skill.skillType)})
                  </option>
                ))}
              </select>

              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-muted">메모 (선택)</span>
                <input
                  value={step.note}
                  onChange={(event) => updateStep(index, { note: event.target.value })}
                  placeholder="예: 각성 먼저 사용"
                  className="rounded-lg border border-border bg-input-bg px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
                />
              </label>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
