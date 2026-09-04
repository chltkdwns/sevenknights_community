"use client";

import { useEffect, useState } from "react";
import { GuildWarAttackGuideContent } from "@/components/guild-war/GuildWarAttackGuideContent";
import { Button } from "@/components/ui/Button";
import { apiRequest, ApiRequestError } from "@/lib/api";
import type { EnemyTeamDetail } from "@/types/guild-war";

type GuildWarAttackPreviewModalProps = {
  teamId: number | null;
  teamTitle: string;
  onClose: () => void;
};

/** 관리자 목록에서 공개 가이드와 동일한 본문을 모달로 미리본다. */
export function GuildWarAttackPreviewModal({
  teamId,
  teamTitle,
  onClose,
}: GuildWarAttackPreviewModalProps) {
  const [team, setTeam] = useState<EnemyTeamDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (teamId == null) {
      setTeam(null);
      setError("");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest<EnemyTeamDetail>(
          `/api/guild-war/attack/enemy-teams/${teamId}`
        );
        setTeam(data);
      } catch (err) {
        setTeam(null);
        setError(
          err instanceof ApiRequestError
            ? err.message
            : "미리보기 데이터를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [teamId]);

  if (teamId == null) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guild-war-preview-title"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-5xl rounded-xl border border-border bg-background shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-5 py-4 sm:px-6">
          <h2 id="guild-war-preview-title" className="text-lg font-semibold">
            미리보기 · {teamTitle}
          </h2>
          <Button type="button" variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>

        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-6 sm:px-6">
          {loading ? <p className="text-muted">불러오는 중...</p> : null}
          {error ? <p className="text-danger">{error}</p> : null}
          {!loading && !error && team ? <GuildWarAttackGuideContent team={team} /> : null}
        </div>
      </div>
    </div>
  );
}
