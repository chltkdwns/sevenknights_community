"use client";
"use no memo";

import { CharacterSlot } from "@/components/guild-war/CharacterSlot";
import type { LoadoutItemAdmin } from "@/types/guild-war";

type LoadoutItemSelectProps = {
  label: string;
  emptyLabel: string;
  value: number | null;
  items: LoadoutItemAdmin[];
  onChange: (id: number | null) => void;
};

/** 마스터 드롭다운. 선택하면 이미지+이름을 CharacterSlot으로 보여 준다. */

export function LoadoutItemSelect({
  label,
  emptyLabel,
  value,
  items,
  onChange,
}: LoadoutItemSelectProps) {
  const selected = items.find((item) => item.id === value);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted">{label}</label>
      <select
        value={value ?? ""}
        onChange={(event) => {
          const nextValue = event.target.value;
          onChange(nextValue ? Number(nextValue) : null);
        }}
        className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm outline-none transition focus:border-accent"
      >
        <option value="">{emptyLabel}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      {selected ? (
        <CharacterSlot
          size="sm"
          member={{
            slotOrder: 0,
            characterId: selected.id,
            characterName: selected.name,
            characterImageUrl: selected.imageUrl,
          }}
        />
      ) : null}
    </div>
  );
}
