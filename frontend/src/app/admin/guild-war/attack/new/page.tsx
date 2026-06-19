"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EnemyTeamForm } from "@/components/admin/guild-war/EnemyTeamForm";

export default function NewGuildWarAttackPage() {
  const [savedId, setSavedId] = useState<number | null>(null);
  const [savedMessage, setSavedMessage] = useState("");

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
        {savedMessage ? <p className="mb-4 text-sm text-accent">{savedMessage}</p> : null}

        <EnemyTeamForm
          mode={savedId ? "edit" : "create"}
          teamId={savedId ?? undefined}
          submitLabel={savedId ? "수정 저장" : "등록"}
          onSuccess={(id) => {
            if (!savedId) {
              setSavedId(id);
              setSavedMessage("등록되었습니다. 이어서 수정할 수 있습니다.");
              return;
            }
            setSavedMessage("저장되었습니다.");
          }}
        />
      </AdminPanel>
    </>
  );
}
