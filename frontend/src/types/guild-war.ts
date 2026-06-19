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

export interface SkillAdmin {
  id: number;
  skillType: SkillType;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

export interface GameCharacterAdmin {
  id: number;
  name: string;
  imageUrl: string;
  skills: SkillAdmin[];
}

export interface EnemyTeamMemberUpsert {
  characterId: number;
  slotOrder: number;
}

export interface AttackTeamMemberUpsert {
  characterId: number;
  slotOrder: number;
}

export interface SkillStepUpsert {
  stepOrder: number;
  skillId: number;
  note: string | null;
}

export interface AttackRecommendationUpsert {
  title: string | null;
  description: string | null;
  sortOrder: number;
  petName: string | null;
  petImageUrl: string | null;
  attackTeamMembers: AttackTeamMemberUpsert[];
  skillSteps: SkillStepUpsert[];
}

export interface EnemyTeamUpsertRequest {
  title: string;
  memo: string | null;
  sortOrder: number;
  isPublished: boolean;
  petName: string | null;
  petImageUrl: string | null;
  members: EnemyTeamMemberUpsert[];
  recommendations: AttackRecommendationUpsert[];
}
