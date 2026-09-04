"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { GuildWarAttackPreviewModal } from "@/components/admin/guild-war/GuildWarAttackPreviewModal";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import type { EnemyTeamAdminSummary } from "@/types/guild-war";

export default function AdminGuildWarAttackPage() {
  const { isLoggedIn, isAdmin } = useAuth();
  // AdminLayout과 동일하게 클라이언트에서 localStorage를 읽은 뒤에만 API를 호출한다.
  const [authReady, setAuthReady] = useState(false);
  const [enemyTeams, setEnemyTeams] = useState<EnemyTeamAdminSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [previewTeamId, setPreviewTeamId] = useState<number | null>(null);
  const [previewTeamTitle, setPreviewTeamTitle] = useState("");
  const teamsRef = useRef(enemyTeams);
  const orderAtDragStartRef = useRef<number[]>([]);
  const didReorderRef = useRef(false);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    teamsRef.current = enemyTeams;
  }, [enemyTeams]);

  const loadEnemyTeams = useCallback(async () => {
    // auth: true 요청은 401 시 api.ts가 clearAuth()를 호출해 헤더가 로그아웃으로 바뀐다.
    // AdminLayout 게이트 직후에도 토큰이 없으면 네트워크 401 대신 여기서 조기 종료한다.
    if (!getToken()) {
      setLoading(false);
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const enemyTeamData = await apiRequest<EnemyTeamAdminSummary[]>(
        "/api/admin/guild-war/attack/enemy-teams",
        { auth: true }
      );
      setEnemyTeams(enemyTeamData);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "가이드 목록을 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady || !isLoggedIn || !isAdmin) {
      return;
    }
    void loadEnemyTeams();
  }, [authReady, isLoggedIn, isAdmin, loadEnemyTeams]);

  function moveTeam(dragId: number, targetId: number) {
    if (dragId === targetId) {
      return;
    }
    setEnemyTeams((current) => {
      const next = [...current];
      const fromIndex = next.findIndex((team) => team.id === dragId);
      const toIndex = next.findIndex((team) => team.id === targetId);
      if (fromIndex < 0 || toIndex < 0) {
        return current;
      }
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      teamsRef.current = next;
      didReorderRef.current = true;
      return next;
    });
  }

  async function persistOrder(orderedTeams: EnemyTeamAdminSummary[]) {
    if (orderedTeams.length === 0) {
      return;
    }

    setReordering(true);
    setError("");
    try {
      await apiRequest<void>("/api/admin/guild-war/attack/enemy-teams/reorder", {
        method: "PUT",
        body: { orderedIds: orderedTeams.map((team) => team.id) },
        auth: true,
      });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "순서 저장에 실패했습니다.");
      await loadEnemyTeams();
    } finally {
      setReordering(false);
    }
  }

  function handleDragEnd() {
    const activeDragId = draggingId;
    const orderAtStart = orderAtDragStartRef.current;
    setDraggingId(null);

    // dragend는 클릭만 해도 발생할 수 있다. 실제 순서 변경이 없으면 reorder API를 호출하지 않는다.
    // (불필요한 admin API 401 → clearAuth() 연쇄를 막기 위함)
    if (activeDragId == null || !didReorderRef.current) {
      return;
    }

    const currentIds = teamsRef.current.map((team) => team.id);
    const unchanged =
      currentIds.length === orderAtStart.length &&
      currentIds.every((id, index) => id === orderAtStart[index]);
    if (unchanged) {
      return;
    }

    void persistOrder(teamsRef.current);
  }

  async function handleDelete(team: EnemyTeamAdminSummary) {
    const confirmed = window.confirm(
      `"${team.title}" 방어팀을 삭제할까요?\n연결된 추천 공격팀 데이터도 함께 삭제되며 되돌릴 수 없습니다.`
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(team.id);
    setError("");
    try {
      await apiRequest<void>(`/api/admin/guild-war/attack/enemy-teams/${team.id}`, {
        method: "DELETE",
        auth: true,
      });
      const nextTeams = enemyTeams.filter((item) => item.id !== team.id);
      setEnemyTeams(nextTeams);
      if (previewTeamId === team.id) {
        setPreviewTeamId(null);
        setPreviewTeamTitle("");
      }
      if (nextTeams.length > 0) {
        await persistOrder(nextTeams);
      }
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "방어팀 삭제에 실패했습니다."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <AdminPanel
        title="길드전 공격 가이드"
        action={
          <Link href="/admin/guild-war/attack/new">
            <Button type="button">새로 등록</Button>
          </Link>
        }
      >
        {loading ? <p className="text-muted">불러오는 중...</p> : null}
        {reordering ? <p className="text-sm text-muted">순서 저장 중...</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}

        {!loading && !error ? (
          enemyTeams.length === 0 ? (
            <p className="rounded-lg border border-border px-4 py-8 text-center text-sm text-muted">
              등록된 방어팀이 없습니다.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {enemyTeams.map((team) => (
                <li
                  key={team.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (draggingId != null && draggingId !== team.id) {
                      moveTeam(draggingId, team.id);
                    }
                  }}
                  className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between ${
                    draggingId === team.id ? "bg-background opacity-70" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    <button
                      type="button"
                      draggable
                      className="mt-0.5 shrink-0 cursor-grab touch-none rounded px-1 py-2 text-muted hover:bg-background active:cursor-grabbing"
                      aria-label={`${team.title} 순서 변경`}
                      onDragStart={(event) => {
                        setDraggingId(team.id);
                        orderAtDragStartRef.current = teamsRef.current.map((item) => item.id);
                        didReorderRef.current = false;
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={handleDragEnd}
                    >
                      ☰
                    </button>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/guild-war/attack/${team.id}/edit`}
                        className="font-medium text-foreground underline-offset-2 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        {team.title}
                      </Link>
                      <p className="text-xs text-muted">
                        {team.isPublished ? "공개" : "비공개"} · 캐릭터 {team.memberCount}명
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8 sm:pl-0">
                    <Link href={`/admin/guild-war/attack/${team.id}/edit`}>
                      <Button type="button" variant="secondary">
                        수정
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      variant="danger"
                      disabled={deletingId === team.id}
                      onClick={() => void handleDelete(team)}
                    >
                      {deletingId === team.id ? "삭제 중..." : "삭제"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={!team.isPublished}
                      onClick={() => {
                        setPreviewTeamId(team.id);
                        setPreviewTeamTitle(team.title);
                      }}
                    >
                      미리보기
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </AdminPanel>

      <GuildWarAttackPreviewModal
        teamId={previewTeamId}
        teamTitle={previewTeamTitle}
        onClose={() => {
          setPreviewTeamId(null);
          setPreviewTeamTitle("");
        }}
      />
    </>
  );
}
