"use client";
"use no memo";

import { LoadoutItemSelect } from "@/components/admin/guild-war/LoadoutItemSelect";
import { Button } from "@/components/ui/Button";
import type { PetCatalog } from "@/types/guild-war";

export type PetSlotState = {
  key: string;
  petId: number | null;
};

type RecommendationPetPickerProps = {
  pets: PetCatalog[];
  slots: PetSlotState[];
  onChange: (slots: PetSlotState[]) => void;
};

/** 추천 공격팀 펫 다중 선택 — pets 카탈로그 */
export function RecommendationPetPicker({ pets, slots, onChange }: RecommendationPetPickerProps) {
  const usedPetIds = new Set(slots.map((slot) => slot.petId).filter((id): id is number => id != null));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-muted">펫 (선택)</p>
        <Button
          type="button"
          variant="secondary"
          className="px-2 py-1 text-xs"
          onClick={() =>
            onChange([...slots, { key: crypto.randomUUID(), petId: null }])
          }
        >
          + 펫 추가
        </Button>
      </div>

      {slots.length === 0 ? (
        <p className="text-xs text-muted">펫을 추가해 주세요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map((slot) => {
            const availablePets = pets.filter(
              (pet) => pet.id === slot.petId || !usedPetIds.has(pet.id)
            );

            return (
              <div key={slot.key} className="rounded-md border border-border p-2">
                <LoadoutItemSelect
                  label="펫 선택"
                  emptyLabel="펫 선택"
                  value={slot.petId}
                  items={availablePets}
                  onChange={(petId) =>
                    onChange(
                      slots.map((current) =>
                        current.key === slot.key ? { ...current, petId } : current
                      )
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 px-2 py-1 text-xs"
                  onClick={() => onChange(slots.filter((current) => current.key !== slot.key))}
                >
                  삭제
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
