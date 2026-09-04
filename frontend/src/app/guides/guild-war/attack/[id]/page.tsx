"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GuildWarAttackGuideContent } from "@/components/guild-war/GuildWarAttackGuideContent";
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
      <GuildWarAttackGuideContent team={team} />
    </section>
  );
}
