export type SkillType = "SKILL_1" | "SKILL_2" | "AWAKENING";

export interface TeamMember {
  slotOrder: number;
  characterId: number;
  characterName: string;
  characterImageUrl: string;
}

export interface SkillStep {
  stepOrder: number;
  note: string | null;
  skillId: number;
  skillType: SkillType;
  skillName: string;
  skillImageUrl: string | null;
  characterId: number;
  characterName: string;
}

export interface AttackRecommendation {
  id: number;
  title: string | null;
  description: string | null;
  sortOrder: number;
  petName: string | null;
  petImageUrl: string | null;
  attackTeamMembers: TeamMember[];
  skillSteps: SkillStep[];
}

export interface EnemyTeamSummary {
  id: number;
  title: string;
  sortOrder: number;
  petName: string | null;
  petImageUrl: string | null;
  members: TeamMember[];
}

export interface EnemyTeamDetail {
  id: number;
  title: string;
  memo: string | null;
  sortOrder: number;
  petName: string | null;
  petImageUrl: string | null;
  members: TeamMember[];
  recommendations: AttackRecommendation[];
}
