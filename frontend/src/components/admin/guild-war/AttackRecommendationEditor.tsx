import { SkillStepEditor } from "@/components/admin/guild-war/SkillStepEditor";
import { TeamMemberPicker } from "@/components/admin/guild-war/TeamMemberPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AttackRecommendationFormState } from "@/lib/guild-war-admin";
import type { GameCharacterAdmin } from "@/types/guild-war";

type AttackRecommendationEditorProps = {
  index: number;
  recommendation: AttackRecommendationFormState;
  characters: GameCharacterAdmin[];
  onChange: (recommendation: AttackRecommendationFormState) => void;
  onRemove: () => void;
};

export function AttackRecommendationEditor({
  index,
  recommendation,
  characters,
  onChange,
  onRemove,
}: AttackRecommendationEditorProps) {
  const update = (patch: Partial<AttackRecommendationFormState>) => {
    onChange({ ...recommendation, ...patch });
  };

  return (
    <article className="rounded-xl border border-border bg-background p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold">추천 공격팀 {index + 1}</h3>
        <Button type="button" variant="danger" onClick={onRemove}>
          추천팀 삭제
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="추천 제목 (선택)"
          value={recommendation.title}
          onChange={(event) => update({ title: event.target.value })}
          placeholder={`추천 ${index + 1}`}
        />
        <Input
          label="정렬 순서"
          type="number"
          min={0}
          value={recommendation.sortOrder}
          onChange={(event) => update({ sortOrder: Number(event.target.value) || 0 })}
        />
      </div>

      <label className="mt-4 flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-muted">설명 (선택)</span>
        <textarea
          value={recommendation.description}
          onChange={(event) => update({ description: event.target.value })}
          rows={3}
          className="rounded-lg border border-border bg-input-bg px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="펫 이름 (선택)"
          value={recommendation.petName}
          onChange={(event) => update({ petName: event.target.value })}
        />
        <Input
          label="펫 이미지 URL (선택)"
          value={recommendation.petImageUrl}
          onChange={(event) => update({ petImageUrl: event.target.value })}
        />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <TeamMemberPicker
          title="공격팀 캐릭터"
          slots={recommendation.attackTeamMembers}
          characters={characters}
          onChange={(attackTeamMembers) => update({ attackTeamMembers })}
        />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <SkillStepEditor
          attackTeamMembers={recommendation.attackTeamMembers}
          characters={characters}
          skillSteps={recommendation.skillSteps}
          onChange={(skillSteps) => update({ skillSteps })}
        />
      </div>
    </article>
  );
}
