"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/layout/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.replace("/login");
    }
  }, [isLoggedIn, isAdmin, router]);

  if (!isLoggedIn || !isAdmin) {
    return <p className="text-muted">권한을 확인하는 중...</p>;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[auto_1fr]">
      <AdminSidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
