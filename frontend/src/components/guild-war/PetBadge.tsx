import { resolveImageUrl } from "@/lib/image";

type PetBadgeProps = {
  petName: string | null;
  petImageUrl?: string | null;
};

export function PetBadge({ petName, petImageUrl }: PetBadgeProps) {
  if (!petName) {
    return <span className="text-sm text-muted">펫 없음</span>;
  }

  const imageUrl = resolveImageUrl(petImageUrl);

  return (
    <div className="flex items-center gap-2">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={petName}
          className="h-8 w-8 rounded-md border border-border object-cover"
        />
      ) : null}
      <span className="text-sm text-foreground">{petName}</span>
    </div>
  );
}
