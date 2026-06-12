import type { SkillType } from "@/types/guild-war";

const SKILL_TYPE_LABEL: Record<SkillType, string> = {
  SKILL_1: "1스킬",
  SKILL_2: "2스킬",
  AWAKENING: "각성",
};

export function getSkillTypeLabel(skillType: SkillType) {
  return SKILL_TYPE_LABEL[skillType];
}
