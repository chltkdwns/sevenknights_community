"use client";
"use no memo";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CharacterSlot } from "@/components/guild-war/CharacterSlot";
import type { HeroCatalog } from "@/types/guild-war";

type HeroSelectProps = {
  label: string;
  value: number | null;
  heroes: HeroCatalog[];
  onChange: (heroId: number | null) => void;
};

function filterHeroes(heroes: HeroCatalog[], query: string): HeroCatalog[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return heroes;
  }
  return heroes.filter(
    (hero) =>
      hero.name.toLowerCase().includes(normalized) ||
      hero.slug.toLowerCase().includes(normalized)
  );
}

/** heroes 카탈로그 영웅 선택 — 이름·slug 검색 지원 */
export function HeroSelect({ label, value, heroes, onChange }: HeroSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = heroes.find((hero) => hero.id === value);
  const filteredHeroes = useMemo(() => filterHeroes(heroes, search), [heroes, search]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const handleSelect = (heroId: number) => {
    onChange(heroId);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      <label className="text-xs font-medium text-muted">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        className="flex items-center justify-between rounded-lg border border-border bg-input-bg px-3 py-2 text-left text-sm outline-none transition focus:border-accent"
      >
        <span className={selected ? "text-foreground" : "text-muted"}>
          {selected ? `${selected.name} (${selected.faction})` : "영웅 선택"}
        </span>
        <span className="text-muted" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-background shadow-lg">
          <div className="border-b border-border p-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="영웅 이름 검색"
              autoFocus
              className="w-full rounded-md border border-border bg-input-bg px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <ul
            id={listboxId}
            role="listbox"
            className="max-h-56 overflow-y-auto py-1"
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                  setSearch("");
                }}
                className="w-full px-3 py-2 text-left text-sm text-muted hover:bg-background"
              >
                선택 해제
              </button>
            </li>
            {filteredHeroes.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">검색 결과가 없습니다.</li>
            ) : (
              filteredHeroes.map((hero) => (
                <li key={hero.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={hero.id === value}
                    onClick={() => handleSelect(hero.id)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-background ${
                      hero.id === value ? "bg-background font-medium text-accent" : ""
                    }`}
                  >
                    {hero.name}
                    <span className="ml-1 text-xs text-muted">({hero.faction})</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {selected ? (
        <div className="flex flex-col items-center gap-1">
          <CharacterSlot
            size="sm"
            member={{
              slotOrder: 0,
              characterId: selected.id,
              characterName: selected.name,
              characterImageUrl: selected.imageUrl,
            }}
          />
          <span className="text-xs text-muted">{selected.faction}</span>
        </div>
      ) : null}
    </div>
  );
}
