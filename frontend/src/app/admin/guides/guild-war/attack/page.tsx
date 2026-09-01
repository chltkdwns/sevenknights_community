"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/Button";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { EnemyTeamSummary } from "@/types/guild-war";

export default function AdminGuildWarAttackPage() {
  const [enemyTeams, setEnemyTeams] = useState<EnemyTeamSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const enemyTeamData = await apiRequest<EnemyTeamSummary[]>(
          "/api/guild-war/attack/enemy-teams"
        );
        setEnemyTeams(enemyTeamData);
      } catch (err) {
        setError(
          err instanceof ApiRequestError ? err.message : "가이드 목록을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AdminPanel
      title="길드전 공격 가이드"
      action={
        <Link href="/admin/guild-war/attack/new">
          <Button type="button">새로 등록</Button>
        </Link>
      }
    >
      {loading ? <p className="text-muted">불러오는 중...</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      {!loading && !error ? (
        enemyTeams.length === 0 ? (
          <p className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted">
            등록된 공개 가이드가 없습니다.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {enemyTeams.map((team) => (
              <li
                key={team.id}
                className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{team.title}</p>
                  <p className="text-xs text-muted">
                    정렬 {team.sortOrder} · 캐릭터 {team.members.length}명
                  </p>
                </div>
                <div className="flex gap-2">
                  {/* a 안에 button을 넣으면 브라우저가 전체 새로고침할 수 있다. 그때 AdminLayout이
                      서버 스냅샷(비로그인)으로 다시 붙으면 로그인 화면으로 쫓겨 난다. */}
                  <Link href={`/admin/guild-war/attack/${team.id}/edit`}>
                    <Button type="button" variant="secondary">
                      수정
                    </Button>
                  </Link>
                  <Link href={`/guides/guild-war/attack/${team.id}`}>
                    <Button type="button" variant="ghost">
                      미리보기
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </AdminPanel>
  );
}
