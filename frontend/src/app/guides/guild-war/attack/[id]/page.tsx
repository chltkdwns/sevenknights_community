"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CharacterSlot } from "@/components/guild-war/CharacterSlot";
import { PetBadge } from "@/components/guild-war/PetBadge";
import { getSkillTypeLabel } from "@/components/guild-war/skill-label";
import { apiRequest } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import type { EnemyTeamDetail } from "@/types/guild-war";

export default function GuildWarAttackDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [team, setTeam] = useState<EnemyTeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest<EnemyTeamDetail>(
          `/api/guild-war/attack/enemy-teams/${id}`
        );
        setTeam(data);
      } catch {
        setError("상대 방어팀 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <p className="text-muted">불러오는 중...</p>;
  }

  if (error || !team) {
    return (
      <div>
        <p className="text-danger">{error || "상대 방어팀을 찾을 수 없습니다."}</p>
        <Link
          href="/guides/guild-war/attack"
          className="mt-4 inline-block text-accent"
        >
          목록으로
        </Link>
      </div>
    );
  }

  return (
    <section>
      <Link
        href="/guides/guild-war/attack"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 목록
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{team.title}</h1>
        {team.memo ? (
          <p className="mt-2 text-sm text-muted">{team.memo}</p>
        ) : null}

        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-2 text-sm font-semibold text-muted">상대 방어팀</p>
          <div className="mb-4">
            <p className="mb-1 text-xs text-muted">펫</p>
            <PetBadge petName={team.petName} petImageUrl={team.petImageUrl} />
          </div>
          <div className="flex justify-center gap-4 sm:justify-start">
            {team.members.map((member) => (
              <CharacterSlot key={member.slotOrder} member={member} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">추천 공격팀</h2>

        {team.recommendations.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface p-6 text-center text-muted">
            등록된 추천 공격팀이 없습니다.
          </p>
        ) : (
          <ul className="space-y-4">
            {team.recommendations.map((recommendation, index) => (
              <li
                key={recommendation.id}
                className="rounded-xl border border-border bg-surface p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold">
                  {recommendation.title || `추천 ${index + 1}`}
                </h3>
                {recommendation.description ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                    {recommendation.description}
                  </p>
                ) : null}

                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-1 text-xs text-muted">추천팀 펫</p>
                  <PetBadge
                    petName={recommendation.petName}
                    petImageUrl={recommendation.petImageUrl}
                  />
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs text-muted">공격팀</p>
                  <div className="flex justify-center gap-4 sm:justify-start">
                    {recommendation.attackTeamMembers.map((member) => (
                      <CharacterSlot key={member.slotOrder} member={member} size="sm" />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs text-muted">스킬 사용 순서</p>
                  {recommendation.skillSteps.length === 0 ? (
                    <p className="text-sm text-muted">등록된 스킬 순서가 없습니다.</p>
                  ) : (
                    <ol className="space-y-2">
                      {recommendation.skillSteps.map((step) => {
                        const skillImageUrl = resolveImageUrl(step.skillImageUrl);
                        return (
                          <li
                            key={step.stepOrder}
                            className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                              {step.stepOrder}
                            </span>
                            {skillImageUrl ? (
                              <img
                                src={skillImageUrl}
                                alt={step.skillName}
                                className="h-10 w-10 shrink-0 rounded-md border border-border object-cover"
                              />
                            ) : null}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">
                                {step.characterName} · {step.skillName}
                                <span className="ml-1 text-xs text-muted">
                                  ({getSkillTypeLabel(step.skillType)})
                                </span>
                              </p>
                              {step.note ? (
                                <p className="mt-0.5 truncate text-xs text-muted">
                                  {step.note}
                                </p>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
