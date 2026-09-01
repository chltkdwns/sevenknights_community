"use client";
// React Compiler가 조건부 early-return과 훅 순서를 어긋나게 만드는 것을 막는다.
"use no memo";

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
import type { EnemyTeamDetail, HeroCatalog, LoadoutItemAdmin, PetCatalog } from "@/types/guild-war";

type EnemyTeamFormProps = {
  mode: "create" | "edit";
  teamId?: number;
  initialDetail?: EnemyTeamDetail;
  /** 최초 POST 성공 시 부모가 edit 모드로 전환할 때 등에 사용. 생략 가능. */
  onSuccess?: (id: number) => void;
};

export function EnemyTeamForm({
  mode,
  teamId,
  initialDetail,
  onSuccess,
}: EnemyTeamFormProps) {
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState<EnemyTeamFormState>(createEmptyEnemyTeamForm);
  const [heroes, setHeroes] = useState<HeroCatalog[]>([]);
  const [catalogPets, setCatalogPets] = useState<PetCatalog[]>([]);
  const [equipments, setEquipments] = useState<LoadoutItemAdmin[]>([]);
  const [rings, setRings] = useState<LoadoutItemAdmin[]>([]);
  // 새로 추가한 카드만 기본 펼침. 수정 화면은 첫 추천팀만 펼친다.
  const [lastAddedRecommendationKey, setLastAddedRecommendationKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
        const catalogResults = await Promise.allSettled([
          apiRequest<HeroCatalog[]>("/api/admin/catalog/heroes", { auth: true }),
          apiRequest<PetCatalog[]>("/api/admin/catalog/pets", { auth: true }),
          apiRequest<LoadoutItemAdmin[]>("/api/admin/guild-war/equipments", { auth: true }),
          apiRequest<LoadoutItemAdmin[]>("/api/admin/guild-war/rings", { auth: true }),
        ]);

        const heroData = catalogResults[0].status === "fulfilled" ? catalogResults[0].value : [];
        const petData = catalogResults[1].status === "fulfilled" ? catalogResults[1].value : [];
        const equipmentData = catalogResults[2].status === "fulfilled" ? catalogResults[2].value : [];
        const ringData = catalogResults[3].status === "fulfilled" ? catalogResults[3].value : [];
        setHeroes(heroData);
        setCatalogPets(petData);
        setEquipments(equipmentData);
        setRings(ringData);

        const catalogFailed = catalogResults.some((result) => result.status === "rejected");
        if (catalogFailed) {
          setError("영웅/펫/장비/반지 목록 일부를 불러오지 못했습니다. 다시 열어 주세요.");
        }

        if (initialDetail) {
          setForm(
            enemyTeamDetailToForm(initialDetail, {
              catalogPets: petData,
              equipments: equipmentData,
              rings: ringData,
            })
          );
        }
      } catch (err) {
        setError(
          err instanceof ApiRequestError
            ? err.message
            : "관리 데이터를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoggedIn, initialDetail]);

  const updateForm = (patch: Partial<EnemyTeamFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const addRecommendation = () => {
    const next = createEmptyRecommendation(form.recommendations.length);
    setLastAddedRecommendationKey(next.key);
    updateForm({
      recommendations: [...form.recommendations, next],
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
    setSuccessMessage("");

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
      onSuccess?.(savedId);
      setSuccessMessage("저장되었습니다.");
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
        {/* 상대 방어팀: 영웅 3명만. 펫·반지는 추천 공격팀(AttackRecommendationEditor)에서만 다룬다. */}
        <TeamMemberPicker
          title="상대 방어팀 캐릭터"
          slots={form.members}
          heroes={heroes}
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
                heroes={heroes}
                pets={catalogPets}
                equipments={equipments}
                rings={rings}
                defaultExpanded={
                  lastAddedRecommendationKey === recommendation.key ||
                  (lastAddedRecommendationKey == null && index === 0)
                }
                onChange={(nextRecommendation) => updateRecommendation(recommendation.key, nextRecommendation)}
                onRemove={() => removeRecommendation(recommendation.key)}
              />
            ))}
          </div>
        )}
      </div>

      {successMessage ? <p className="text-sm text-accent">{successMessage}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
