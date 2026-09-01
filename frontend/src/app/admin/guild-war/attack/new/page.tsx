"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EnemyTeamForm } from "@/components/admin/guild-war/EnemyTeamForm";

export default function NewGuildWarAttackPage() {
  const [savedId, setSavedId] = useState<number | null>(null);

  return (
    <>
      <Link
        href="/admin/guides/guild-war/attack"
        className="mb-4 inline-block text-sm text-muted hover:text-foreground"
      >
        ← 길드전 공격 가이드 목록
      </Link>

      <AdminPanel
        title={savedId ? "길드전 공격 가이드 수정" : "길드전 공격 가이드 등록"}
      >
        <EnemyTeamForm
          mode={savedId ? "edit" : "create"}
          teamId={savedId ?? undefined}
          onSuccess={(id) => {
            if (!savedId) {
              setSavedId(id);
            }
          }}
        />
      </AdminPanel>
    </>
  );
}
