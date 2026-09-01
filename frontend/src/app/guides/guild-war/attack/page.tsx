"use client";

import Link from "next/link";
import { TeamLineup } from "@/components/guild-war/TeamLineup";
import { useGuildWarAttackTeams } from "@/components/guild-war/GuildWarAttackProvider";

export default function GuildWarAttackGuidePage() {
  const { teams, loading, error } = useGuildWarAttackTeams();

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">길드전 공격 가이드</h1>
        <p className="mt-1 text-sm text-muted">
          상대 방어팀을 선택하면 추천 공격팀과 스킬 순서를 확인할 수 있습니다.
        </p>
      </div>

      {loading ? (
        <p className="text-muted">불러오는 중...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : teams.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
          등록된 상대 방어팀이 없습니다.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {teams.map((team) => (
            <li key={team.id}>
              <Link
                href={`/guides/guild-war/attack/${team.id}`}
                className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition hover:border-accent"
              >
                <h2 className="text-lg font-semibold">{team.title}</h2>
                <div className="mt-4">
                  <TeamLineup members={team.members} size="sm" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
