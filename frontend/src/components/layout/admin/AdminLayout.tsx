"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/layout/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  // useAuth 서버 스냅샷은 항상 비로그인이다. 이 플래그 없이 첫 effect에서 /login으로 보내면
  // localStorage에 토큰이 있어도 로그아웃된 것처럼 보인다. 클라이언트에서 한 번 읽은 뒤에만 판정한다.
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }
    if (!isLoggedIn || !isAdmin) {
      router.replace("/login");
    }
  }, [authReady, isLoggedIn, isAdmin, router]);

  if (!authReady || !isLoggedIn || !isAdmin) {
    return <p className="text-muted">권한을 확인하는 중...</p>;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[auto_1fr]">
      <AdminSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
