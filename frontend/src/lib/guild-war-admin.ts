import type {
  AttackRecommendationUpsert,
  AttackTeamMemberUpsert,
  EnemyTeamDetail,
  EnemyTeamUpsertRequest,
  SkillStepUpsert,
} from "@/types/guild-war";

export type TeamMemberSlot = {
  slotOrder: number;
  characterId: number | null;
};

export type SkillStepSlot = {
  stepOrder: number;
  skillId: number | null;
  note: string;
};

export type AttackRecommendationFormState = {
  key: string;
  title: string;
  description: string;
  sortOrder: number;
  petName: string;
  petImageUrl: string;
  attackTeamMembers: TeamMemberSlot[];
  skillSteps: SkillStepSlot[];
};

export type EnemyTeamFormState = {
  title: string;
  memo: string;
  sortOrder: number;
  isPublished: boolean;
  petName: string;
  petImageUrl: string;
  members: TeamMemberSlot[];
  recommendations: AttackRecommendationFormState[];
};

function createTeamMemberSlots(): TeamMemberSlot[] {
  return [1, 2, 3].map((slotOrder) => ({ slotOrder, characterId: null }));
}

export function createEmptyRecommendation(sortOrder: number): AttackRecommendationFormState {
  return {
    key: crypto.randomUUID(),
    title: "",
    description: "",
    sortOrder,
    petName: "",
    petImageUrl: "",
    attackTeamMembers: createTeamMemberSlots(),
    skillSteps: [],
  };
}

export function createEmptyEnemyTeamForm(): EnemyTeamFormState {
  return {
    title: "",
    memo: "",
    sortOrder: 0,
    isPublished: true,
    petName: "",
    petImageUrl: "",
    members: createTeamMemberSlots(),
    recommendations: [],
  };
}

export function enemyTeamDetailToForm(detail: EnemyTeamDetail): EnemyTeamFormState {
  const members = createTeamMemberSlots();
  detail.members.forEach((member) => {
    const slot = members.find((item) => item.slotOrder === member.slotOrder);
    if (slot) {
      slot.characterId = member.characterId;
    }
  });

  return {
    title: detail.title,
    memo: detail.memo ?? "",
    sortOrder: detail.sortOrder,
    isPublished: true,
    petName: detail.petName ?? "",
    petImageUrl: detail.petImageUrl ?? "",
    members,
    recommendations: detail.recommendations.map((recommendation) => {
      const attackTeamMembers = createTeamMemberSlots();
      recommendation.attackTeamMembers.forEach((member) => {
        const slot = attackTeamMembers.find((item) => item.slotOrder === member.slotOrder);
        if (slot) {
          slot.characterId = member.characterId;
        }
      });

      return {
        key: String(recommendation.id),
        title: recommendation.title ?? "",
        description: recommendation.description ?? "",
        sortOrder: recommendation.sortOrder,
        petName: recommendation.petName ?? "",
        petImageUrl: recommendation.petImageUrl ?? "",
        attackTeamMembers,
        skillSteps: recommendation.skillSteps.map((step) => ({
          stepOrder: step.stepOrder,
          skillId: step.skillId,
          note: step.note ?? "",
        })),
      };
    }),
  };
}

function normalizeOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toAttackTeamMembers(slots: TeamMemberSlot[]): AttackTeamMemberUpsert[] {
  return slots
    .filter((slot) => slot.characterId != null)
    .map((slot) => ({
      slotOrder: slot.slotOrder,
      characterId: slot.characterId as number,
    }));
}

function toSkillSteps(steps: SkillStepSlot[]): SkillStepUpsert[] {
  return steps
    .filter((step) => step.skillId != null)
    .map((step, index) => ({
      stepOrder: index + 1,
      skillId: step.skillId as number,
      note: normalizeOptionalText(step.note),
    }));
}

export function enemyTeamFormToUpsertRequest(form: EnemyTeamFormState): EnemyTeamUpsertRequest {
  const recommendations: AttackRecommendationUpsert[] = form.recommendations.map(
    (recommendation, index) => ({
      title: normalizeOptionalText(recommendation.title),
      description: normalizeOptionalText(recommendation.description),
      sortOrder: recommendation.sortOrder ?? index,
      petName: normalizeOptionalText(recommendation.petName),
      petImageUrl: normalizeOptionalText(recommendation.petImageUrl),
      attackTeamMembers: toAttackTeamMembers(recommendation.attackTeamMembers),
      skillSteps: toSkillSteps(recommendation.skillSteps),
    })
  );

  return {
    title: form.title.trim(),
    memo: normalizeOptionalText(form.memo),
    sortOrder: form.sortOrder,
    isPublished: form.isPublished,
    petName: normalizeOptionalText(form.petName),
    petImageUrl: normalizeOptionalText(form.petImageUrl),
    members: toAttackTeamMembers(form.members),
    recommendations,
  };
}

export function validateEnemyTeamForm(form: EnemyTeamFormState): string | null {
  if (!form.title.trim()) {
    return "상대 방어팀 제목을 입력해 주세요.";
  }

  const enemyMembers = form.members.filter((slot) => slot.characterId != null);
  if (enemyMembers.length === 0) {
    return "상대 방어팀 캐릭터를 1명 이상 선택해 주세요.";
  }

  const enemyCharacterIds = new Set<number>();
  for (const slot of enemyMembers) {
    if (enemyCharacterIds.has(slot.characterId as number)) {
      return "상대 방어팀에 같은 캐릭터를 중복 선택할 수 없습니다.";
    }
    enemyCharacterIds.add(slot.characterId as number);
  }

  for (const [index, recommendation] of form.recommendations.entries()) {
    const attackMembers = recommendation.attackTeamMembers.filter((slot) => slot.characterId != null);
    if (attackMembers.length === 0) {
      return `추천 공격팀 ${index + 1}: 공격팀 캐릭터를 1명 이상 선택해 주세요.`;
    }

    const attackCharacterIds = new Set<number>();
    for (const slot of attackMembers) {
      if (attackCharacterIds.has(slot.characterId as number)) {
        return `추천 공격팀 ${index + 1}: 같은 캐릭터를 중복 선택할 수 없습니다.`;
      }
      attackCharacterIds.add(slot.characterId as number);
    }

    const validSteps = recommendation.skillSteps.filter((step) => step.skillId != null);
    const skillIds = new Set<number>();
    for (const step of validSteps) {
      if (skillIds.has(step.skillId as number)) {
        return `추천 공격팀 ${index + 1}: 같은 스킬을 중복 선택할 수 없습니다.`;
      }
      skillIds.add(step.skillId as number);
    }
  }

  return null;
}
