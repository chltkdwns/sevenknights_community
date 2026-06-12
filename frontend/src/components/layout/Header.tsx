"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { clearAuth, getAuthChangedEventName, getStoredUser } from "@/lib/auth";
import { GUIDE_NAV, isNavActive } from "@/lib/navigation";
import type { User } from "@/types";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
    };

    syncUser();

    const authEventName = getAuthChangedEventName();
    window.addEventListener("storage", syncUser);
    window.addEventListener(authEventName, syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(authEventName, syncUser);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-accent">
            Seven Knights
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <span className="text-xs font-semibold text-muted">{GUIDE_NAV.label}</span>
            {GUIDE_NAV.items.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`text-sm transition ${
                    active
                      ? "font-semibold text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="flex items-center gap-3 text-sm sm:gap-5">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="text-accent hover:text-accent-hover">
                  관리자
                </Link>
              ) : null}
              <span className="hidden text-muted sm:inline">
                {user.nickname}님
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-muted hover:text-foreground"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-foreground">
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-3 py-1.5 font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
