import { Input } from "@/components/ui/Input";
import type { SkillStepSlot } from "@/lib/guild-war-admin";

type SkillStepManualEditorProps = {
  skillSteps: SkillStepSlot[];
  onChange: (steps: SkillStepSlot[]) => void;
};

/**
 * 스킬 DB 구축 전 임시 입력 UI.
 * {@link import("./SkillStepEditor")} 카탈로그 선택 방식으로 다시 전환할 예정이다.
 */
export function SkillStepManualEditor({ skillSteps, onChange }: SkillStepManualEditorProps) {
  const updateStep = (index: number, note: string) => {
    onChange(
      skillSteps.map((step, stepIndex) =>
        stepIndex === index
          ? { ...step, skillId: null, skipped: false, note }
          : step
      )
    );
  };

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-muted">스킬 사용 순서</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {skillSteps.map((step, index) => (
          <div key={step.stepOrder} className="min-w-0 flex-1">
            <Input
              label={`${index + 1}번`}
              value={step.note}
              placeholder="직접 입력"
              onChange={(event) => updateStep(index, event.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
