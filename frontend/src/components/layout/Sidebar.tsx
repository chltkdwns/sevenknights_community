"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, SIDEBAR_SECTIONS } from "@/lib/navigation";

function SidebarLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
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

export function Sidebar() {
  const pathname = usePathname();
  const flatMenus = SIDEBAR_SECTIONS.flatMap((section) => section.items);

  return (
    <>
      <aside className="hidden md:block md:w-56 lg:w-64">
        <div className="sticky top-20 space-y-4">
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
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>
      </aside>

      <div className="mb-4 overflow-x-auto md:hidden">
        <nav className="flex min-w-max gap-2 rounded-xl border border-border bg-surface p-2">
          {flatMenus.map((menu) => (
            <SidebarLink
              key={menu.key}
              href={menu.href}
              label={menu.label}
              active={isNavActive(pathname, menu.href)}
            />
          ))}
        </nav>
      </div>
    </>
  );
}
