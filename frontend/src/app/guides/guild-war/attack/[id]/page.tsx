"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AttackCharacterCard } from "@/components/guild-war/AttackCharacterCard";
import { GuideImage } from "@/components/guild-war/GuideImage";
import { TeamLineup } from "@/components/guild-war/TeamLineup";
import { getSkillTypeLabel } from "@/components/guild-war/skill-label";
import { apiRequest } from "@/lib/api";
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
    return <p className="text-danger">{error || "상대 방어팀을 찾을 수 없습니다."}</p>;
  }

  return (
    <section>
      <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{team.title}</h1>
        {team.memo ? <p className="mt-2 text-sm text-muted">{team.memo}</p> : null}

        <div className="mt-5 border-t border-border pt-5">
          <p className="mb-3 text-sm font-semibold text-muted">상대 방어팀</p>
          <TeamLineup members={team.members} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">추천 공격팀</h2>

        {team.recommendations.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface p-6 text-center text-muted">
            등록된 추천 공격팀이 없습니다.
          </p>
        ) : (
          <ul className="space-y-6">
            {team.recommendations.map((recommendation, index) => (
              <li
                key={recommendation.id}
                className="rounded-xl border border-border bg-surface p-5 sm:p-6"
              >
                <h3 className="text-base font-semibold">
                  {recommendation.title || `추천 공격팀 ${index + 1}`}
                </h3>
                {recommendation.description ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                    {recommendation.description}
                  </p>
                ) : null}

                <div className="mt-4">
                  <TeamLineup
                    members={recommendation.attackTeamMembers}
                    pets={recommendation.pets}
                    petName={recommendation.petName}
                    petImageUrl={recommendation.petImageUrl}
                    size="sm"
                    separatePet
                    showPet
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendation.attackTeamMembers.map((member) => (
                    <AttackCharacterCard key={member.slotOrder} member={member} />
                  ))}
                </div>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-2 text-sm font-semibold">스킬 사용 순서</p>
                  {(() => {
                    const visibleSkillSteps = recommendation.skillSteps.filter(
                      (step) =>
                        (step.skillId != null && !step.skipped) ||
                        Boolean(step.note?.trim() || step.skillName?.trim())
                    );
                    return visibleSkillSteps.length === 0 ? (
                    <p className="text-sm text-muted">등록된 스킬 순서가 없습니다.</p>
                  ) : (
                    <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-2">
                      {visibleSkillSteps.map((step, index) => {
                        const isManual = step.skillId == null;
                        const displayText = isManual
                          ? step.note?.trim() || step.skillName
                          : `${step.characterName} · ${step.skillName}`;

                        return (
                          <li
                            key={step.stepOrder}
                            className="flex min-w-0 flex-1 items-center gap-2"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                                {index + 1}
                              </span>
                              {!isManual ? (
                                <GuideImage
                                  src={step.skillImageUrl}
                                  alt={step.skillName || "스킬"}
                                  className="h-10 w-10 shrink-0 rounded-md border border-border"
                                  label="스킬"
                                />
                              ) : null}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">
                                  {displayText}
                                  {!isManual && step.skillType ? (
                                    <span className="ml-1 text-xs text-muted">
                                      ({getSkillTypeLabel(step.skillType)})
                                    </span>
                                  ) : null}
                                </p>
                                {!isManual && step.note ? (
                                  <p className="mt-0.5 truncate text-xs text-muted">{step.note}</p>
                                ) : null}
                              </div>
                            </div>
                            {index < visibleSkillSteps.length - 1 ? (
                              <span
                                className="hidden shrink-0 text-sm text-muted sm:inline"
                                aria-hidden
                              >
                                →
                              </span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ol>
                  );
                  })()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
