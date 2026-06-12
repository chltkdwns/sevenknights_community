"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CharacterSlot } from "@/components/guild-war/CharacterSlot";
import { PetBadge } from "@/components/guild-war/PetBadge";
import { Button } from "@/components/ui/Button";
import { apiRequest } from "@/lib/api";
import type { EnemyTeamSummary } from "@/types/guild-war";

export default function GuildWarAttackGuidePage() {
  const [teams, setTeams] = useState<EnemyTeamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest<EnemyTeamSummary[]>(
          "/api/guild-war/attack/enemy-teams"
        );
        setTeams(data);
      } catch {
        setError("상대 방어팀 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">길드전 공격 가이드</h1>
        <p className="mt-1 text-sm text-muted">
          상대 방어팀·추천 공격 조합·스킬 순서를 구조화된 데이터로 제공합니다.
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
            <li
              key={team.id}
              className="flex flex-col rounded-xl border border-border bg-surface p-5"
            >
              <h2 className="text-lg font-semibold">{team.title}</h2>

              <div className="mt-3">
                <p className="mb-1 text-xs text-muted">상대팀 펫</p>
                <PetBadge petName={team.petName} petImageUrl={team.petImageUrl} />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs text-muted">상대 방어팀</p>
                <div className="flex justify-center gap-3 sm:justify-start">
                  {team.members.map((member) => (
                    <CharacterSlot key={member.slotOrder} member={member} size="sm" />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <Link href={`/guides/guild-war/attack/${team.id}`}>
                  <Button variant="secondary" fullWidth>
                    상세보기
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
