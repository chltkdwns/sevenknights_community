"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { EnemyTeamSummary } from "@/types/guild-war";

type GuildWarAttackContextValue = {
  teams: EnemyTeamSummary[];
  loading: boolean;
  error: string;
};

const GuildWarAttackContext = createContext<GuildWarAttackContextValue | null>(null);

export function GuildWarAttackProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<EnemyTeamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest<EnemyTeamSummary[]>("/api/guild-war/attack/enemy-teams");
        if (!cancelled) {
          setTeams(data);
        }
      } catch {
        if (!cancelled) {
          setError("상대 방어팀 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ teams, loading, error }), [teams, loading, error]);

  return <GuildWarAttackContext.Provider value={value}>{children}</GuildWarAttackContext.Provider>;
}

export function useGuildWarAttackTeams() {
  const context = useContext(GuildWarAttackContext);
  if (!context) {
    throw new Error("useGuildWarAttackTeams는 GuildWarAttackProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
