"use client";

import { FormEvent, useEffect, useState } from "react";
import { AttackRecommendationEditor } from "@/components/admin/guild-war/AttackRecommendationEditor";
import { TeamMemberPicker } from "@/components/admin/guild-war/TeamMemberPicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, ApiRequestError } from "@/lib/api";
import {
  createEmptyRecommendation,
  createEmptyEnemyTeamForm,
  enemyTeamDetailToForm,
  enemyTeamFormToUpsertRequest,
  type EnemyTeamFormState,
  validateEnemyTeamForm,
} from "@/lib/guild-war-admin";
import type { EnemyTeamDetail, GameCharacterAdmin } from "@/types/guild-war";

type EnemyTeamFormProps = {
  mode: "create" | "edit";
  teamId?: number;
  initialDetail?: EnemyTeamDetail;
  submitLabel: string;
  onSuccess: (id: number) => void;
};

export function EnemyTeamForm({
  mode,
  teamId,
  initialDetail,
  submitLabel,
  onSuccess,
}: EnemyTeamFormProps) {
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState<EnemyTeamFormState>(() =>
    initialDetail ? enemyTeamDetailToForm(initialDetail) : createEmptyEnemyTeamForm()
  );
  const [characters, setCharacters] = useState<GameCharacterAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialDetail) {
      setForm(enemyTeamDetailToForm(initialDetail));
    }
  }, [initialDetail]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      setError("로그인이 필요합니다.");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest<GameCharacterAdmin[]>("/api/admin/guild-war/characters", {
          auth: true,
        });
        setCharacters(data);
      } catch (err) {
        setError(
          err instanceof ApiRequestError
            ? err.message
            : "캐릭터 목록을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn]);

  const updateForm = (patch: Partial<EnemyTeamFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const addRecommendation = () => {
    updateForm({
      recommendations: [...form.recommendations, createEmptyRecommendation(form.recommendations.length)],
    });
  };

  const updateRecommendation = (key: string, nextRecommendation: EnemyTeamFormState["recommendations"][number]) => {
    updateForm({
      recommendations: form.recommendations.map((recommendation) =>
        recommendation.key === key ? nextRecommendation : recommendation
      ),
    });
  };

  const removeRecommendation = (key: string) => {
    updateForm({
      recommendations: form.recommendations.filter((recommendation) => recommendation.key !== key),
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateEnemyTeamForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = enemyTeamFormToUpsertRequest(form);
      const savedId =
        mode === "edit" && teamId
          ? await apiRequest<number>(`/api/admin/guild-war/attack/enemy-teams/${teamId}`, {
              method: "PUT",
              body: payload,
              auth: true,
            })
          : await apiRequest<number>("/api/admin/guild-war/attack/enemy-teams", {
              method: "POST",
              body: payload,
              auth: true,
            });
      onSuccess(savedId);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-muted">불러오는 중...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="상대 방어팀 제목"
          value={form.title}
          onChange={(event) => updateForm({ title: event.target.value })}
          required
        />
        <Input
          label="정렬 순서"
          type="number"
          min={0}
          value={form.sortOrder}
          onChange={(event) => updateForm({ sortOrder: Number(event.target.value) || 0 })}
        />
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-muted">메모 (선택)</span>
        <textarea
          value={form.memo}
          onChange={(event) => updateForm({ memo: event.target.value })}
          rows={2}
          className="rounded-lg border border-border bg-input-bg px-3 py-2.5 text-foreground outline-none transition focus:border-accent"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="펫 이름 (선택)"
          value={form.petName}
          onChange={(event) => updateForm({ petName: event.target.value })}
        />
        <Input
          label="펫 이미지 URL (선택)"
          value={form.petImageUrl}
          onChange={(event) => updateForm({ petImageUrl: event.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(event) => updateForm({ isPublished: event.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        <span className="font-medium">가이드 공개 (체크 시 사용자 페이지에 노출)</span>
      </label>

      <div className="rounded-xl border border-border bg-background p-5">
        <TeamMemberPicker
          title="상대 방어팀 캐릭터"
          slots={form.members}
          characters={characters}
          onChange={(members) => updateForm({ members })}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">추천 공격팀</h2>
          <Button type="button" variant="secondary" onClick={addRecommendation}>
            추천팀 추가
          </Button>
        </div>

        {form.recommendations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            추천 공격팀을 추가해 주세요.
          </p>
        ) : (
          <div className="space-y-4">
            {form.recommendations.map((recommendation, index) => (
              <AttackRecommendationEditor
                key={recommendation.key}
                index={index}
                recommendation={recommendation}
                characters={characters}
                onChange={(nextRecommendation) => updateRecommendation(recommendation.key, nextRecommendation)}
                onRemove={() => removeRecommendation(recommendation.key)}
              />
            ))}
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "저장 중..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
