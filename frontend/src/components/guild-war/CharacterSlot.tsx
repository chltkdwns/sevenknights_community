import { resolveImageUrl } from "@/lib/image";
import type { TeamMember } from "@/types/guild-war";

type CharacterSlotProps = {
  member: TeamMember;
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
};

export function CharacterSlot({ member, size = "md" }: CharacterSlotProps) {
  const imageUrl = resolveImageUrl(member.characterImageUrl);

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div
        className={`${sizeClass[size]} overflow-hidden rounded-lg border border-border bg-background`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={member.characterName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted">
            ?
          </div>
        )}
      </div>
      <span className="max-w-[5rem] truncate text-xs font-medium sm:max-w-[6rem]">
        {member.characterName}
      </span>
    </div>
  );
}
