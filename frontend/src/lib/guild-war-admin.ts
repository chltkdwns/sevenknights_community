import type {
  AttackRecommendationUpsert,
  AttackTeamMemberUpsert,
  EnemyTeamDetail,
  EnemyTeamMemberUpsert,
  EnemyTeamUpsertRequest,
  LoadoutItemAdmin,
  PetCatalog,
  SkillStepUpsert,
} from "@/types/guild-war";
import { USE_MANUAL_SKILL_INPUT } from "@/lib/guild-war-skill-mode";
import type { PetSlotState } from "@/components/admin/guild-war/RecommendationPetPicker";

export type EquipmentSlotState = {
  key: string;
  /** 저장 시 보내는 장비 마스터 ID. 미선택 행은 payload에서 뺀다. */
  equipmentId: number | null;
};

export type RingSlotState = {
  key: string;
  ringId: number | null;
  /** 세공 문구. 마스터가 아니라 이 추천 슬롯에만 저장된다. */
  enchantment: string;
};

export type TeamMemberSlot = {
  slotOrder: number;
  characterId: number | null;
  description: string;
  equipmentSlots: EquipmentSlotState[];
  ringSlots: RingSlotState[];
};

export type SkillStepSlot = {
  stepOrder: number;
  skillId: number | null;
  /** true면 이 순서에서 스킬을 쓰지 않고, 이후 슬롯은 비활성화한다. (카탈로그 모드) */
  skipped: boolean;
  note: string;
};

export type AttackRecommendationFormState = {
  key: string;
  title: string;
  description: string;
  sortOrder: number;
  petSlots: PetSlotState[];
  attackTeamMembers: TeamMemberSlot[];
  skillSteps: SkillStepSlot[];
};

export type EnemyTeamFormState = {
  title: string;
  memo: string;
  sortOrder: number;
  isPublished: boolean;
  /** 상대 방어팀 레거시 펫 문자열. UI에는 노출하지 않고 기존 DB 값 유지용으로만 PUT에 실어 보낸다. */
  petName: string;
  petImageUrl: string;
  members: TeamMemberSlot[];
  recommendations: AttackRecommendationFormState[];
};

export type LoadoutCatalogs = {
  catalogPets: PetCatalog[];
  equipments: LoadoutItemAdmin[];
  rings: LoadoutItemAdmin[];
};

function createTeamMemberSlots(): TeamMemberSlot[] {
  return [1, 2, 3].map((slotOrder) => ({
    slotOrder,
    characterId: null,
    description: "",
    equipmentSlots: [],
    ringSlots: [],
  }));
}

function createSkillSlots(): SkillStepSlot[] {
  return [1, 2, 3].map((stepOrder) => ({
    stepOrder,
    skillId: null,
    skipped: false,
    note: "",
  }));
}

export function createEmptyRecommendation(sortOrder: number): AttackRecommendationFormState {
  return {
    key: crypto.randomUUID(),
    title: "",
    description: "",
    sortOrder,
    petSlots: [],
    attackTeamMembers: createTeamMemberSlots(),
    skillSteps: createSkillSlots(),
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

function matchCatalogId(items: LoadoutItemAdmin[], name: string | null | undefined): number | null {
  if (!name?.trim()) {
    return null;
  }
  const found = items.find((item) => item.name === name.trim());
  return found ? found.id : null;
}

function matchPetCatalogId(items: PetCatalog[], name: string | null | undefined): number | null {
  if (!name?.trim()) {
    return null;
  }
  const found = items.find((item) => item.name === name.trim());
  return found ? found.id : null;
}

function toPetSlots(
  recommendation: EnemyTeamDetail["recommendations"][number],
  catalogs: LoadoutCatalogs
): PetSlotState[] {
  if (recommendation.pets?.length) {
    return recommendation.pets
      .map((pet) => ({
        key: crypto.randomUUID(),
        petId: pet.id ?? matchPetCatalogId(catalogs.catalogPets, pet.name),
      }))
      .filter((slot) => slot.petId != null);
  }
  const legacyId =
    recommendation.petId ?? matchPetCatalogId(catalogs.catalogPets, recommendation.petName);
  if (legacyId != null) {
    return [{ key: crypto.randomUUID(), petId: legacyId }];
  }
  return [];
}

export function enemyTeamDetailToForm(
  detail: EnemyTeamDetail,
  catalogs: LoadoutCatalogs = { catalogPets: [], equipments: [], rings: [] }
): EnemyTeamFormState {
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
          slot.description = member.description ?? "";
          slot.equipmentSlots = (member.equipments ?? [])
            .map((item) => ({
              key: crypto.randomUUID(),
              equipmentId: item.id ?? matchCatalogId(catalogs.equipments, item.name),
            }))
            .filter((item) => item.equipmentId != null);
          if (slot.equipmentSlots.length === 0) {
            const legacyId = matchCatalogId(catalogs.equipments, member.equipmentSetName);
            if (legacyId != null) {
              slot.equipmentSlots = [{ key: crypto.randomUUID(), equipmentId: legacyId }];
            }
          }
          slot.ringSlots = (member.rings ?? [])
            .map((item) => ({
              key: crypto.randomUUID(),
              ringId: item.id ?? matchCatalogId(catalogs.rings, item.name),
              enchantment: item.enchantment ?? "",
            }))
            .filter((item) => item.ringId != null);
          if (slot.ringSlots.length === 0) {
            const legacyId = matchCatalogId(catalogs.rings, member.ringName);
            if (legacyId != null) {
              slot.ringSlots = [
                {
                  key: crypto.randomUUID(),
                  ringId: legacyId,
                  enchantment: member.ringEnchantment ?? "",
                },
              ];
            }
          }
        }
      });

      return {
        key: String(recommendation.id),
        title: recommendation.title ?? "",
        description: recommendation.description ?? "",
        sortOrder: recommendation.sortOrder,
        petSlots: toPetSlots(recommendation, catalogs),
        attackTeamMembers,
        skillSteps: toFormSkillSlots(recommendation.skillSteps),
      };
    }),
  };
}

function normalizeOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toEnemyTeamMembers(slots: TeamMemberSlot[]): EnemyTeamMemberUpsert[] {
  return slots
    .filter((slot) => slot.characterId != null)
    .map((slot) => ({
      slotOrder: slot.slotOrder,
      heroId: slot.characterId as number,
    }));
}

function toAttackTeamMembers(slots: TeamMemberSlot[]): AttackTeamMemberUpsert[] {
  return slots
    .filter((slot) => slot.characterId != null)
    .map((slot) => ({
      slotOrder: slot.slotOrder,
      heroId: slot.characterId as number,
      description: normalizeOptionalText(slot.description),
      equipmentIds: slot.equipmentSlots
        .map((item) => item.equipmentId)
        .filter((id): id is number => id != null),
      rings: slot.ringSlots
        .filter((item) => item.ringId != null)
        .map((item) => ({
          ringId: item.ringId as number,
          enchantment: normalizeOptionalText(item.enchantment),
        })),
    }));
}

function toFormSkillSlots(
  steps: {
    stepOrder: number;
    skillId: number | null;
    skipped?: boolean;
    note: string | null;
    skillName?: string | null;
  }[]
): SkillStepSlot[] {
  const slots = createSkillSlots();
  const sorted = [...steps].sort((a, b) => a.stepOrder - b.stepOrder);

  if (USE_MANUAL_SKILL_INPUT) {
    for (const step of sorted) {
      const slot = slots.find((item) => item.stepOrder === step.stepOrder);
      if (!slot) {
        continue;
      }
      if (step.skillId != null) {
        slot.skillId = step.skillId;
        slot.note = step.note ?? "";
        slot.skipped = false;
        continue;
      }
      const manualText = step.note?.trim() || step.skillName?.trim() || "";
      if (manualText) {
        slot.note = manualText;
        slot.skillId = null;
        slot.skipped = false;
      }
    }
    return slots;
  }

  for (const step of sorted) {
    const slot = slots.find((item) => item.stepOrder === step.stepOrder);
    if (!slot) {
      continue;
    }
    const skipped = step.skipped === true || step.skillId == null;
    if (skipped) {
      slot.skipped = true;
      slot.skillId = null;
      slot.note = "";
      break;
    }
    slot.skillId = step.skillId;
    slot.skipped = false;
    slot.note = step.note ?? "";
  }
  return slots;
}

function toSkillSteps(steps: SkillStepSlot[]): SkillStepUpsert[] {
  if (USE_MANUAL_SKILL_INPUT) {
    return steps
      .filter((step) => step.note.trim().length > 0)
      .map((step) => ({
        stepOrder: step.stepOrder,
        skillId: null,
        note: normalizeOptionalText(step.note),
      }));
  }

  const saved: SkillStepUpsert[] = [];
  for (const step of steps) {
    if (step.skipped || step.skillId == null) {
      break;
    }
    saved.push({
      stepOrder: step.stepOrder,
      skillId: step.skillId,
      note: normalizeOptionalText(step.note),
    });
  }
  return saved;
}

export function enemyTeamFormToUpsertRequest(form: EnemyTeamFormState): EnemyTeamUpsertRequest {
  const recommendations: AttackRecommendationUpsert[] = form.recommendations.map(
    (recommendation, index) => ({
      title: normalizeOptionalText(recommendation.title),
      description: normalizeOptionalText(recommendation.description),
      sortOrder: recommendation.sortOrder ?? index,
      petIds: recommendation.petSlots
        .map((slot) => slot.petId)
        .filter((id): id is number => id != null),
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
    members: toEnemyTeamMembers(form.members),
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

    const petIds = recommendation.petSlots
      .map((slot) => slot.petId)
      .filter((id): id is number => id != null);
    const uniquePetIds = new Set(petIds);
    if (uniquePetIds.size !== petIds.length) {
      return `추천 공격팀 ${index + 1}: 같은 펫을 중복 선택할 수 없습니다.`;
    }

    if (!USE_MANUAL_SKILL_INPUT) {
      const validSteps = recommendation.skillSteps.filter((step) => step.skillId != null);
      const skillIds = new Set<number>();
      for (const step of validSteps) {
        if (skillIds.has(step.skillId as number)) {
          return `추천 공격팀 ${index + 1}: 같은 스킬을 중복 선택할 수 없습니다.`;
        }
        skillIds.add(step.skillId as number);
      }
    }
  }

  return null;
}
