import { GuideImage } from "@/components/guild-war/GuideImage";
import type { AttackPetLoadout, TeamMember } from "@/types/guild-war";

type TeamLineupProps = {
  members: TeamMember[];
  /** 신규 다중 펫. 있으면 petName/petImageUrl보다 우선한다. */
  pets?: AttackPetLoadout[];
  petName?: string | null;
  petImageUrl?: string | null;
  size?: "sm" | "md";
  /** 추천 공격팀처럼 영웅 3명과 펫을 한 줄에서 띄워 보여줄 때 */
  separatePet?: boolean;
  /** true면 펫 슬롯을 그린다. 상대 방어팀은 false, 추천 공격팀만 true. */
  showPet?: boolean;
};

const sizeClass = {
  sm: "h-12 w-12",
  md: "h-16 w-16 sm:h-20 sm:w-20",
};

const petSizeClass = {
  sm: "h-10 w-10",
  md: "h-12 w-12 sm:h-16 sm:w-16",
};

function resolveDisplayPets(
  pets: AttackPetLoadout[] | undefined,
  petName: string | null | undefined,
  petImageUrl: string | null | undefined
): AttackPetLoadout[] {
  if (pets && pets.length > 0) {
    return pets;
  }
  if (petName) {
    return [{ id: null, name: petName, imageUrl: petImageUrl ?? null }];
  }
  return [];
}

export function TeamLineup({
  members,
  pets,
  petName,
  petImageUrl,
  size = "md",
  separatePet = false,
  showPet = false,
}: TeamLineupProps) {
  const frame = sizeClass[size];
  const petFrame = separatePet ? petSizeClass[size] : frame;
  const displayPets = resolveDisplayPets(pets, petName, petImageUrl);

  return (
    <div className="flex flex-wrap items-end gap-3">
      {members.map((member) => (
        <div key={member.slotOrder} className="flex flex-col items-center gap-1 text-center">
          <GuideImage
            src={member.characterImageUrl}
            alt={member.characterName}
            className={`${frame} rounded-lg border border-border`}
          />
          <span className="max-w-[4.5rem] truncate text-xs font-medium">{member.characterName}</span>
        </div>
      ))}
      {showPet && displayPets.length > 0 ? (
        <div
          className={`flex flex-wrap items-end gap-3 ${
            separatePet ? "ml-6 border-l border-border pl-6 sm:ml-10 sm:pl-10" : ""
          }`}
        >
          {displayPets.map((pet, index) => (
            <div
              key={pet.id ?? `legacy-pet-${index}`}
              className="flex flex-col items-center gap-1 text-center"
            >
              <GuideImage
                src={pet.imageUrl}
                alt={pet.name}
                className={`${petFrame} rounded-lg border border-border`}
                label="펫"
              />
              <span className="max-w-[4.5rem] truncate text-xs font-medium text-muted">
                {pet.name}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
