import { CharacterSlot } from "@/components/guild-war/CharacterSlot";
import type { GameCharacterAdmin } from "@/types/guild-war";
import type { TeamMemberSlot } from "@/lib/guild-war-admin";

type CharacterSelectProps = {
  label: string;
  value: number | null;
  characters: GameCharacterAdmin[];
  onChange: (characterId: number | null) => void;
};

export function CharacterSelect({ label, value, characters, onChange }: CharacterSelectProps) {
  const selected = characters.find((character) => character.id === value);

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
        <option value="">캐릭터 선택</option>
        {characters.map((character) => (
          <option key={character.id} value={character.id}>
            {character.name}
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

type TeamMemberPickerProps = {
  title: string;
  slots: TeamMemberSlot[];
  characters: GameCharacterAdmin[];
  onChange: (slots: TeamMemberSlot[]) => void;
};

export function TeamMemberPicker({ title, slots, characters, onChange }: TeamMemberPickerProps) {
  const updateSlot = (slotOrder: number, characterId: number | null) => {
    onChange(
      slots.map((slot) => (slot.slotOrder === slotOrder ? { ...slot, characterId } : slot))
    );
  };

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-muted">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {slots.map((slot) => (
          <CharacterSelect
            key={slot.slotOrder}
            label={`${slot.slotOrder}번 슬롯`}
            value={slot.characterId}
            characters={characters}
            onChange={(characterId) => updateSlot(slot.slotOrder, characterId)}
          />
        ))}
      </div>
    </div>
  );
}
