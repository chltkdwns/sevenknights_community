"use client";
// React Compiler가 이 폼의 훅 순서를 깨는 것을 막는다.
"use no memo";

import { useState } from "react";
import { RecommendationPetPicker } from "@/components/admin/guild-war/RecommendationPetPicker";
import { SkillStepManualEditor } from "@/components/admin/guild-war/SkillStepManualEditor";
import { SkillStepEditor } from "@/components/admin/guild-war/SkillStepEditor";
import { TeamMemberPicker } from "@/components/admin/guild-war/TeamMemberPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { AttackRecommendationFormState } from "@/lib/guild-war-admin";
import { USE_MANUAL_SKILL_INPUT } from "@/lib/guild-war-skill-mode";
import type { GameCharacterAdmin, HeroCatalog, LoadoutItemAdmin, PetCatalog } from "@/types/guild-war";

type AttackRecommendationEditorProps = {
  index: number;
  recommendation: AttackRecommendationFormState;
  heroes: HeroCatalog[];
  /** 카탈로그 스킬 선택 모드에서만 사용. 직접 입력 모드에서는 보존용으로만 전달된다. */
  characters?: GameCharacterAdmin[];
  pets: PetCatalog[];
  equipments: LoadoutItemAdmin[];
  rings: LoadoutItemAdmin[];
  defaultExpanded?: boolean;
  onChange: (recommendation: AttackRecommendationFormState) => void;
  onRemove: () => void;
};

export function AttackRecommendationEditor({
  index,
  recommendation,
  heroes,
  characters = [],
  pets,
  equipments,
  rings,
  defaultExpanded = false,
  onChange,
  onRemove,
}: AttackRecommendationEditorProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const heading = recommendation.title.trim() || `추천 공격팀 ${index + 1}`;

  const update = (patch: Partial<AttackRecommendationFormState>) => {
    onChange({ ...recommendation, ...patch });
  };

  return (
    <article className="rounded-xl border border-border bg-background">
      <div className="flex items-center gap-2 p-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={expanded}
        >
          <span className="text-sm text-muted" aria-hidden>
            {expanded ? "▼" : "▶"}
          </span>
          <h3 className="truncate text-base font-semibold">{heading}</h3>
        </button>
        <Button type="button" variant="danger" onClick={onRemove}>
          추천팀 삭제
        </Button>
      </div>

      {expanded ? (
        <div className="space-y-4 border-t border-border p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="추천 제목 (선택)"
              value={recommendation.title}
              onChange={(event) => update({ title: event.target.value })}
              placeholder={`추천 공격팀 ${index + 1}`}
            />
            <Input
              label="정렬 순서"
              type="number"
              min={0}
              value={recommendation.sortOrder}
              onChange={(event) => update({ sortOrder: Number(event.target.value) || 0 })}
            />
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-muted">설명 (선택)</span>
            <textarea
              value={recommendation.description}
              onChange={(event) => update({ description: event.target.value })}
              rows={3}
              className="rounded-lg border border-border bg-input-bg px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
            />
          </label>

          <div className="border-t border-border pt-5">
            <TeamMemberPicker
              title="공격팀 캐릭터"
              slots={recommendation.attackTeamMembers}
              heroes={heroes}
              onChange={(attackTeamMembers) => update({ attackTeamMembers })}
              showGear
              idPrefix={recommendation.key}
              equipmentCatalog={equipments}
              ringCatalog={rings}
            />
            <div className="mt-8">
              <RecommendationPetPicker
                pets={pets}
                slots={recommendation.petSlots}
                onChange={(petSlots) => update({ petSlots })}
              />
            </div>
          </div>

          <div className="border-t border-border pt-5">
            {USE_MANUAL_SKILL_INPUT ? (
              <SkillStepManualEditor
                skillSteps={recommendation.skillSteps}
                onChange={(skillSteps) => update({ skillSteps })}
              />
            ) : (
              <SkillStepEditor
                attackTeamMembers={recommendation.attackTeamMembers}
                heroes={heroes}
                characters={characters}
                skillSteps={recommendation.skillSteps}
                onChange={(skillSteps) => update({ skillSteps })}
              />
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}
