"use client";
"use no memo";

import { LoadoutItemSelect } from "@/components/admin/guild-war/LoadoutItemSelect";
import { HeroSelect } from "@/components/admin/guild-war/HeroSelect";
import { CharacterSlot } from "@/components/guild-war/CharacterSlot";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { GameCharacterAdmin, HeroCatalog, LoadoutItemAdmin } from "@/types/guild-war";
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
  characters?: GameCharacterAdmin[];
  heroes?: HeroCatalog[];
  onChange: (slots: TeamMemberSlot[]) => void;
  /** true면 추천 공격팀 슬롯: 설명 + 장비/반지 다중 입력. 상대 방어팀은 false. */
  showGear?: boolean;
  idPrefix?: string;
  equipmentCatalog?: LoadoutItemAdmin[];
  ringCatalog?: LoadoutItemAdmin[];
};

export function TeamMemberPicker({
  title,
  slots,
  characters = [],
  heroes,
  onChange,
  showGear = false,
  idPrefix = "slot",
  equipmentCatalog = [],
  ringCatalog = [],
}: TeamMemberPickerProps) {
  const updateSlot = (slotOrder: number, patch: Partial<TeamMemberSlot>) => {
    onChange(slots.map((slot) => (slot.slotOrder === slotOrder ? { ...slot, ...patch } : slot)));
  };

  const useHeroCatalog = heroes != null;

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-muted">{title}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {slots.map((slot) => (
          <div key={slot.slotOrder} className="space-y-3">
            {useHeroCatalog ? (
              <HeroSelect
                label={`${slot.slotOrder}번 슬롯`}
                value={slot.characterId}
                heroes={heroes}
                onChange={(characterId) => updateSlot(slot.slotOrder, { characterId })}
              />
            ) : (
              <CharacterSelect
                label={`${slot.slotOrder}번 슬롯`}
                value={slot.characterId}
                characters={characters}
                onChange={(characterId) => updateSlot(slot.slotOrder, { characterId })}
              />
            )}
            {showGear ? (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-muted">설명 (선택)</span>
                <textarea
                  id={`${idPrefix}-desc-${slot.slotOrder}`}
                  value={slot.description}
                  rows={3}
                  placeholder="예: 첫 번째 턴에 스킬 사용"
                  onChange={(event) =>
                    updateSlot(slot.slotOrder, { description: event.target.value })
                  }
                  className="rounded-lg border border-border bg-input-bg px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
                />
              </label>
            ) : null}
            {showGear ? (
              // 장비/반지는 1개가 아니라 행을 추가하는 방식. 저장은 마스터 ID만 보낸다.
              <div className="space-y-4 rounded-lg border border-border p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-muted">추천 장비</p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      onClick={() =>
                        updateSlot(slot.slotOrder, {
                          equipmentSlots: [
                            ...slot.equipmentSlots,
                            { key: crypto.randomUUID(), equipmentId: null, customName: "" },
                          ],
                        })
                      }
                    >
                      + 추가
                    </Button>
                  </div>
                  {slot.equipmentSlots.length === 0 ? (
                    <p className="text-xs text-muted">추천 장비를 추가해 주세요.</p>
                  ) : (
                    slot.equipmentSlots.map((item) => (
                      <div key={item.key} className="rounded-md border border-border p-2">
                        <LoadoutItemSelect
                          label="추천 장비 선택"
                          emptyLabel="추천 장비 선택"
                          value={item.equipmentId}
                          items={equipmentCatalog}
                          onChange={(equipmentId) =>
                            updateSlot(slot.slotOrder, {
                              equipmentSlots: slot.equipmentSlots.map((current) =>
                                current.key === item.key
                                  ? { ...current, equipmentId, customName: "" }
                                  : current
                              ),
                            })
                          }
                        />
                        <Input
                          id={`${idPrefix}-equipment-custom-${slot.slotOrder}-${item.key}`}
                          label="직접 입력"
                          value={item.customName}
                          placeholder="드롭다운에 없는 장비명"
                          disabled={item.equipmentId != null}
                          onChange={(event) =>
                            updateSlot(slot.slotOrder, {
                              equipmentSlots: slot.equipmentSlots.map((current) =>
                                current.key === item.key
                                  ? {
                                      ...current,
                                      equipmentId: null,
                                      customName: event.target.value,
                                    }
                                  : current
                              ),
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="mt-2 px-2 py-1 text-xs"
                          onClick={() =>
                            updateSlot(slot.slotOrder, {
                              equipmentSlots: slot.equipmentSlots.filter(
                                (current) => current.key !== item.key
                              ),
                            })
                          }
                        >
                          삭제
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-muted">추천 반지</p>
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-2 py-1 text-xs"
                      onClick={() =>
                        updateSlot(slot.slotOrder, {
                          ringSlots: [
                            ...slot.ringSlots,
                            { key: crypto.randomUUID(), ringId: null, customName: "", enchantment: "" },
                          ],
                        })
                      }
                    >
                      + 추가
                    </Button>
                  </div>
                  {slot.ringSlots.length === 0 ? (
                    <p className="text-xs text-muted">추천 반지를 추가해 주세요.</p>
                  ) : (
                    slot.ringSlots.map((item) => (
                      <div key={item.key} className="space-y-2 rounded-md border border-border p-2">
                        <LoadoutItemSelect
                          label="추천 반지 선택"
                          emptyLabel="추천 반지 선택"
                          value={item.ringId}
                          items={ringCatalog}
                          onChange={(ringId) =>
                            updateSlot(slot.slotOrder, {
                              ringSlots: slot.ringSlots.map((current) =>
                                current.key === item.key
                                  ? { ...current, ringId, customName: "" }
                                  : current
                              ),
                            })
                          }
                        />
                        <Input
                          id={`${idPrefix}-ring-custom-${slot.slotOrder}-${item.key}`}
                          label="직접 입력"
                          value={item.customName}
                          placeholder="드롭다운에 없는 반지명"
                          disabled={item.ringId != null}
                          onChange={(event) =>
                            updateSlot(slot.slotOrder, {
                              ringSlots: slot.ringSlots.map((current) =>
                                current.key === item.key
                                  ? {
                                      ...current,
                                      ringId: null,
                                      customName: event.target.value,
                                    }
                                  : current
                              ),
                            })
                          }
                        />
                        <Input
                          id={`${idPrefix}-ring-enchant-${slot.slotOrder}-${item.key}`}
                          label="세공"
                          value={item.enchantment}
                          placeholder="직접 입력"
                          onChange={(event) =>
                            updateSlot(slot.slotOrder, {
                              ringSlots: slot.ringSlots.map((current) =>
                                current.key === item.key
                                  ? { ...current, enchantment: event.target.value }
                                  : current
                              ),
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() =>
                            updateSlot(slot.slotOrder, {
                              ringSlots: slot.ringSlots.filter((current) => current.key !== item.key),
                            })
                          }
                        >
                          삭제
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
