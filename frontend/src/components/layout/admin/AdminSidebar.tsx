"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_NAV_SECTIONS,
  ADMIN_TOP_NAV,
  type AdminNavItem,
  isAdminNavActive,
} from "@/lib/admin-navigation";

function AdminNavLink({ item, active }: { item: AdminNavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`block rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-accent font-semibold text-accent-foreground"
          : "text-muted hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      {item.label}
    </Link>
  );
}

function AdminSidebarNav({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-4">
      <div className="flex flex-col gap-1">
        {ADMIN_TOP_NAV.map((item) => (
          <AdminNavLink
            key={item.key}
            item={item}
            active={isAdminNavActive(pathname, item)}
          />
        ))}
      </div>

      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.key}>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted">
            {section.label}
          </h3>
          <div className="flex flex-col gap-1 pl-2">
            {section.items.map((item) => (
              <AdminNavLink
                key={item.key}
                item={item}
                active={isAdminNavActive(pathname, item)}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const flatItems = [
    ...ADMIN_TOP_NAV,
    ...ADMIN_NAV_SECTIONS.flatMap((section) => section.items),
  ];

  return (
    <>
      <aside className="hidden md:block md:w-56 lg:w-60">
        <div className="sticky top-20 rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-4 text-sm font-semibold text-foreground">관리자 메뉴</h2>
          <AdminSidebarNav pathname={pathname} />
          <div className="mt-6 border-t border-border pt-4">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground"
            >
              ← 사이트로 돌아가기
            </Link>
          </div>
        </div>
      </aside>

      <div className="mb-4 overflow-x-auto md:hidden">
        <nav className="flex min-w-max gap-2 rounded-xl border border-border bg-surface p-2">
          {flatItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                isAdminNavActive(pathname, item)
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
