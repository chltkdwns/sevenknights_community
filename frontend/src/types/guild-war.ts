export type SkillType = "SKILL_1" | "SKILL_2" | "SKILL_3" | "AWAKENING" | "PASSIVE";

export interface TeamMember {
  slotOrder: number;
  characterId: number;
  characterName: string;
  characterImageUrl: string;
}

export interface CharacterSkill {
  id: number;
  skillType: SkillType;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

export interface AttackLoadoutItem {
  /** 마스터 ID. 구버전 표시만 있는 경우 null. */
  id: number | null;
  name: string | null;
  imageUrl: string | null;
}

export interface AttackRingLoadout extends AttackLoadoutItem {
  enchantment: string | null;
}

export interface AttackTeamMember extends TeamMember {
  equipments: AttackLoadoutItem[];
  rings: AttackRingLoadout[];
  /** 구버전 단일 장비. 새 데이터는 equipments를 우선한다. */
  equipmentImageUrl: string | null;
  equipmentSetName: string | null;
  ringImageUrl: string | null;
  ringName: string | null;
  ringEnchantment: string | null;
  description: string | null;
  skills: CharacterSkill[];
}

export interface SkillStep {
  stepOrder: number;
  skipped?: boolean;
  note: string | null;
  skillId: number | null;
  skillType: SkillType | null;
  skillName: string | null;
  skillImageUrl: string | null;
  characterId: number | null;
  characterName: string | null;
}

export interface AttackPetLoadout {
  id: number | null;
  name: string;
  imageUrl: string | null;
}

export interface AttackRecommendation {
  id: number;
  title: string | null;
  description: string | null;
  sortOrder: number;
  /** 구버전 단일 펫. 신규는 pets 배열을 우선한다. */
  petId: number | null;
  petName: string | null;
  petImageUrl: string | null;
  pets: AttackPetLoadout[];
  attackTeamMembers: AttackTeamMember[];
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

export interface LoadoutItemAdmin {
  id: number;
  name: string;
  imageUrl: string;
}

/** heroes 테이블 카탈로그 — 추천 공격팀 영웅 선택용 */
export interface HeroCatalog {
  id: number;
  name: string;
  slug: string;
  faction: string;
  imageUrl: string;
  isActive: boolean;
}

/** pets 테이블 카탈로그 — 추천 공격팀 펫 선택용 (gw_pets와 별개) */
export interface PetCatalog {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
}

export interface EnemyTeamMemberUpsert {
  heroId: number;
  slotOrder: number;
}

export interface AttackTeamMemberUpsert {
  heroId: number;
  slotOrder: number;
  description: string | null;
  equipmentIds: number[];
  /** 반지 마스터 ID + 세공 문자열. 반지 이름/이미지는 보내지 않는다. */
  rings: { ringId: number; enchantment: string | null }[];
}

export interface SkillStepUpsert {
  stepOrder: number;
  skillId: number | null;
  note: string | null;
}

export interface AttackRecommendationUpsert {
  title: string | null;
  description: string | null;
  sortOrder: number;
  /** @deprecated 구버전 단일 펫. 신규는 petIds를 쓴다. */
  petId?: number | null;
  petIds: number[];
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
