"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EnemyTeamForm } from "@/components/admin/guild-war/EnemyTeamForm";
import { apiRequest } from "@/lib/api";
import type { EnemyTeamDetail } from "@/types/guild-war";

export default function EditGuildWarAttackPage() {
  const params = useParams();
  const id = Number(params.id);
  const [team, setTeam] = useState<EnemyTeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

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
        setError("상대 방어팀 정보를 불러오지 못했습니다. 공개된 가이드만 수정할 수 있습니다.");
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
      <>
        <Link
          href="/admin/guides/guild-war/attack"
          className="mb-4 inline-block text-sm text-muted hover:text-foreground"
        >
          ← 길드전 공격 가이드 목록
        </Link>
        <AdminPanel>
          <p className="text-danger">{error || "상대 방어팀을 찾을 수 없습니다."}</p>
        </AdminPanel>
      </>
    );
  }

  return (
    <>
      <Link
        href="/admin/guides/guild-war/attack"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 길드전 공격 가이드 목록
      </Link>

      <AdminPanel
        title="길드전 공격 가이드 수정"
        action={
          <Link
            href={`/guides/guild-war/attack/${id}`}
            className="text-sm text-accent hover:text-accent-hover"
          >
            사용자 페이지 미리보기
          </Link>
        }
      >
        {savedMessage ? <p className="mb-4 text-sm text-accent">{savedMessage}</p> : null}

        <EnemyTeamForm
          mode="edit"
          teamId={id}
          initialDetail={team}
          submitLabel="수정 저장"
          onSuccess={() => {
            setSavedMessage("저장되었습니다.");
          }}
        />
      </AdminPanel>
    </>
  );
}
