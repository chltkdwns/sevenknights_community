"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileNav } from "@/components/layout/MobileNavProvider";
import { isNavActive, SIDEBAR_SECTIONS } from "@/lib/navigation";

function SidebarLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {SIDEBAR_SECTIONS.map((section) => (
        <div
          key={section.key}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <h2 className="mb-3 text-sm font-semibold text-muted">
            {section.label}
          </h2>
          <nav className="flex flex-col gap-2">
            {section.items.map((menu) => (
              <SidebarLink
                key={menu.key}
                href={menu.href}
                label={menu.label}
                active={isNavActive(pathname, menu.href)}
                onClick={onNavigate}
              />
            ))}
          </nav>
        </div>
      ))}
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { open, closeNav } = useMobileNav();

  return (
    <>
      <aside className="hidden md:block md:w-56 lg:w-64">
        <div className="sticky top-20 space-y-4">
          <SidebarNav pathname={pathname} />
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="메뉴 닫기"
            onClick={closeNav}
          />
          <aside
            id="mobile-sidebar"
            className="relative z-10 flex h-full w-[min(18rem,85vw)] flex-col bg-background p-4 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="메뉴"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">메뉴</p>
              <button
                type="button"
                onClick={closeNav}
                className="rounded-md px-2 py-1 text-sm text-muted hover:text-foreground"
              >
                닫기
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
              <SidebarNav pathname={pathname} onNavigate={closeNav} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
