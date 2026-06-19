"use client";

import { usePathname } from "next/navigation";
import { isSidebarHiddenRoute } from "@/lib/layout-routes";
import { Sidebar } from "@/components/layout/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const hideSidebar = isSidebarHiddenRoute(pathname);

  return (
    <div
      className={`mx-auto flex w-full flex-1 gap-6 px-4 py-8 sm:px-6 ${
        hideSidebar ? "max-w-7xl" : "max-w-6xl"
      }`}
    >
      {!hideSidebar ? <Sidebar /> : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
