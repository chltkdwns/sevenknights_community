import { GuideImage } from "@/components/guild-war/GuideImage";
import type { AttackLoadoutItem, AttackRingLoadout, AttackTeamMember } from "@/types/guild-war";
type AttackCharacterCardProps = {
  member: AttackTeamMember;
};

function displayName(item: AttackLoadoutItem, fallback: string) {
  return item.name?.trim() || fallback;
}

export function AttackCharacterCard({ member }: AttackCharacterCardProps) {
  // 스킬 목록은 아래 "스킬 사용 순서" 영역에서만 보여 준다. 여기서는 영웅·장비·반지만 표시.
  const equipments: AttackLoadoutItem[] =
    member.equipments && member.equipments.length > 0
      ? member.equipments
      : member.equipmentImageUrl || member.equipmentSetName
        ? [
            {
              id: null,
              name: member.equipmentSetName,
              imageUrl: member.equipmentImageUrl,
            },
          ]
        : [];

  const rings: AttackRingLoadout[] =
    member.rings && member.rings.length > 0
      ? member.rings
      : member.ringImageUrl || member.ringName || member.ringEnchantment
        ? [
            {
              id: null,
              name: member.ringName,
              imageUrl: member.ringImageUrl,
              enchantment: member.ringEnchantment,
            },
          ]
        : [];

  return (
    <article className="rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col items-center gap-2">
        <GuideImage
          src={member.characterImageUrl}
          alt={member.characterName}
          className="h-24 w-24 rounded-xl border border-border"
        />
        <h4 className="text-sm font-semibold">{member.characterName}</h4>
        {member.description?.trim() ? (
          // 설명이 없는 캐릭터는 사용자 화면에서 설명 영역을 표시하지 않음
          <p className="w-full whitespace-pre-wrap text-center text-xs text-muted">
            {member.description.trim()}
          </p>
        ) : null}
      </div>

      <div className="mt-4 space-y-3 border-t border-border pt-3">
        <div>
          <p className="mb-2 text-center text-[11px] font-medium text-muted">장비</p>
          {equipments.length === 0 ? (
            <p className="text-center text-[11px] text-muted">등록된 장비가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {equipments.map((item, index) => (
                <div
                  key={`${item.id ?? "legacy"}-${index}`}
                  className="flex w-16 flex-col items-center gap-1 text-center"
                >
                  <GuideImage
                    src={item.imageUrl}
                    alt={displayName(item, "장비")}
                    className="h-12 w-12 rounded-md border border-border"
                    label="장비"
                  />
                  <span className="w-full truncate text-[11px] font-medium">
                    {displayName(item, "장비")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-center text-[11px] font-medium text-muted">반지</p>
          {rings.length === 0 ? (
            <p className="text-center text-[11px] text-muted">등록된 반지가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {rings.map((item, index) => (
                <div
                  key={`${item.id ?? "legacy"}-${index}`}
                  className="flex w-20 flex-col items-center gap-1 text-center"
                >
                  <GuideImage
                    src={item.imageUrl}
                    alt={displayName(item, "반지")}
                    className="h-12 w-12 rounded-md border border-border"
                    label="반지"
                  />
                  <span className="w-full truncate text-[11px] font-medium">
                    {displayName(item, "반지")}
                  </span>
                  {item.enchantment ? (
                    <p className="text-[10px] leading-snug text-muted">세공: {item.enchantment}</p>
                  ) : (
                    <p className="text-[10px] text-muted">세공: -</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
