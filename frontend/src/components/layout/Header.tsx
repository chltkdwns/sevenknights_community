"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useMobileNav } from "@/components/layout/MobileNavProvider";
import { useAuth } from "@/hooks/useAuth";
import { clearAuth } from "@/lib/auth";
import { isAdminRoute } from "@/lib/admin-routes";
import { isSidebarHiddenRoute } from "@/lib/layout-routes";
import { GUIDE_NAV, isNavActive } from "@/lib/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { open, toggleNav } = useMobileNav();
  // 로그인·관리자처럼 좌측 사이트 사이드바가 없는 페이지에서는 햄버거를 두지 않는다.
  const showMobileMenu = !isSidebarHiddenRoute(pathname);

  const handleLogout = () => {
    clearAuth();
    router.push("/");
    router.refresh();
  };

  const onAdminRoute = isAdminRoute(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-6">
          {showMobileMenu ? (
            <button
              type="button"
              onClick={toggleNav}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-foreground md:hidden"
              aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={open}
              aria-controls="mobile-sidebar"
            >
              ☰
            </button>
          ) : null}
          <Link
            href="/"
            className="whitespace-nowrap text-lg font-bold tracking-tight text-accent md:shrink-0"
          >
            Seven Knights
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
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
        <nav className="flex shrink-0 items-center gap-3 whitespace-nowrap text-sm sm:gap-5">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                onAdminRoute ? (
                  <Link
                    href="/"
                    className="font-medium text-accent hover:text-accent-hover"
                  >
                    사이트로 돌아가기
                  </Link>
                ) : (
                  <Link href="/admin" className="text-accent hover:text-accent-hover">
                    관리자
                  </Link>
                )
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
              {/* 햄버거가 있는 좁은 화면에선 헤더가 넘치지 않도록 숨기고, sm부터 기존 버튼으로 표시한다. */}
              <Link
                href="/signup"
                className="hidden rounded-lg bg-accent px-3 py-1.5 font-semibold text-accent-foreground hover:bg-accent-hover sm:inline-flex"
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
