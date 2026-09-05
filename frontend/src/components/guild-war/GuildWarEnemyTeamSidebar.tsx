"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GuideImage } from "@/components/guild-war/GuideImage";
import { useGuildWarAttackTeams } from "@/components/guild-war/GuildWarAttackProvider";
import type { EnemyTeamSummary } from "@/types/guild-war";

type GuildWarEnemyTeamSidebarProps = {
  selectedTeamId?: number;
};

function matchesSearch(team: EnemyTeamSummary, query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return true;

  if (team.title.toLowerCase().includes(keyword)) {
    return true;
  }

  return team.members.some((member) => member.characterName.toLowerCase().includes(keyword));
}

function TeamSidebarItem({
  team,
  selected,
  onSelect,
}: {
  team: EnemyTeamSummary;
  selected: boolean;
  onSelect?: () => void;
}) {
  return (
    <Link
      href={`/guides/guild-war/attack/${team.id}`}
      onClick={onSelect}
      className={`block rounded-lg border px-3 py-2.5 transition ${
        selected
          ? "border-accent bg-accent/10"
          : "border-transparent hover:border-border hover:bg-surface-hover"
      }`}
    >
      <p className={`text-sm font-semibold ${selected ? "text-accent" : ""}`}>{team.title}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {team.members.map((member) => (
          <GuideImage
            key={member.slotOrder}
            src={member.characterImageUrl}
            alt={member.characterName}
            className="h-8 w-8 rounded-md border border-border"
          />
        ))}
      </div>
      <p className="mt-1 truncate text-[11px] text-muted">
        {team.members.map((member) => member.characterName).join(" / ") || "캐릭터 없음"}
      </p>
    </Link>
  );
}

export function GuildWarEnemyTeamSidebar({ selectedTeamId }: GuildWarEnemyTeamSidebarProps) {
  const { teams, loading, error } = useGuildWarAttackTeams();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredTeams = useMemo(
    () => teams.filter((team) => matchesSearch(team, query)),
    [teams, query]
  );

  const characterNames = useMemo(() => {
    const names = new Set<string>();
    teams.forEach((team) => {
      team.members.forEach((member) => names.add(member.characterName));
    });
    return [...names].sort((a, b) => a.localeCompare(b, "ko"));
  }, [teams]);

  const list = (
    <>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold">상대 캐릭터 검색</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          list="guild-war-character-search"
          placeholder="캐릭터 이름"
          className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm outline-none transition focus:border-accent"
        />
        <datalist id="guild-war-character-search">
          {characterNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>

      <div className="mt-4 border-t border-border pt-3">
        {loading ? (
          <p className="text-xs text-muted">불러오는 중...</p>
        ) : error ? (
          <p className="text-xs text-danger">{error}</p>
        ) : filteredTeams.length === 0 ? (
          <p className="text-xs text-muted">검색 결과가 없습니다.</p>
        ) : (
          <nav className="flex flex-col gap-1">
            {filteredTeams.map((team) => (
              <TeamSidebarItem
                key={team.id}
                team={team}
                selected={team.id === selectedTeamId}
                onSelect={() => setOpen(false)}
              />
            ))}
          </nav>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 xl:block">
        <div className="sticky top-20 rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold">상대 방어팀</h2>
          {list}
        </div>
      </aside>

      {/* 모바일에서는 우측 패널을 숨기고, md~xl 구간 기존 버튼은 유지한다. */}
      <div className="hidden md:block xl:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mb-4 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium"
        >
          상대 방어팀 목록 / 검색
        </button>
        {open ? (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
            <div className="flex h-full w-80 max-w-[90vw] flex-col bg-background p-4 shadow-lg">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">상대 방어팀</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-1 text-sm text-muted hover:text-foreground"
                >
                  닫기
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{list}</div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
