"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { canAccessGuildWarGuide } from "@/lib/auth";

type GuildWarGuideGuardProps = {
  children: React.ReactNode;
};

/** 길드전 공략 페이지 가드. 실제 데이터 차단은 백엔드 권한 검사가 담당한다. */
export function GuildWarGuideGuard({ children }: GuildWarGuideGuardProps) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [authReady, isLoggedIn, router]);

  if (!authReady || !isLoggedIn) {
    return <p className="text-muted">권한을 확인하는 중...</p>;
  }

  if (!canAccessGuildWarGuide(user)) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-xl font-bold">길드전 공격 가이드</h1>
        <p className="mt-2 text-sm text-muted">
          관리자 승인 후 이용할 수 있습니다. 게임 닉네임으로 가입했는지 확인해 주세요.
        </p>
      </section>
    );
  }

  return children;
}
