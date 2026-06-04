"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarMenu = {
  key: string;
  label: string;
  href: string;
};

const BOARD_MENUS: SidebarMenu[] = [
  { key: "notice", label: "공지게시판", href: "/board/notice" },
  { key: "free", label: "자유게시판", href: "/board/free" },
  { key: "guide", label: "공략게시판", href: "/board/guide" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:block md:w-56 lg:w-64">
        <div className="sticky top-20 rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-muted">커뮤니티 메뉴</h2>
          <nav className="flex flex-col gap-2">
            {BOARD_MENUS.map((menu) => {
              const active = isActive(pathname, menu.href);
              return (
                <Link
                  key={menu.key}
                  href={menu.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  {menu.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="mb-4 overflow-x-auto md:hidden">
        <nav className="flex min-w-max gap-2 rounded-xl border border-border bg-surface p-2">
          {BOARD_MENUS.map((menu) => {
            const active = isActive(pathname, menu.href);
            return (
              <Link
                key={menu.key}
                href={menu.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                }`}
              >
                {menu.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
