"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

type GuestOnlyProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

/** 로그인 상태면 지정 경로로 보내고, 비로그인 사용자만 children을 렌더한다. */
export function GuestOnly({ children, redirectTo = "/" }: GuestOnlyProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(redirectTo);
    }
  }, [isLoggedIn, redirectTo, router]);

  if (isLoggedIn) {
    return <p className="text-center text-sm text-muted">이동 중...</p>;
  }

  return <>{children}</>;
}
