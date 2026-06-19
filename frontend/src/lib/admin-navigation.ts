export type AdminNavItem = {
  key: string;
  label: string;
  href: string;
  /** 목록 외 하위 경로(등록·수정 등)에서도 활성 표시할 prefix */
  matchPaths?: string[];
};

export type AdminNavSection = {
  key: string;
  label: string;
  items: AdminNavItem[];
};

/** 섹션 없이 단독으로 노출되는 최상위 메뉴 */
export const ADMIN_TOP_NAV: AdminNavItem[] = [
  { key: "users", label: "회원 관리", href: "/admin/users" },
];

/**
 * 그룹 메뉴 — 항목 추가 시 해당 섹션 items 배열에만 등록하면 된다.
 */
export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    key: "community",
    label: "커뮤니티 관리",
    items: [
      { key: "notices", label: "공지 관리", href: "/admin/community/notices" },
      { key: "posts", label: "게시글 관리", href: "/admin/community/posts" },
    ],
  },
  {
    key: "guides",
    label: "가이드 관리",
    items: [
      {
        key: "guild-war-attack",
        label: "길드전 공격 가이드",
        href: "/admin/guides/guild-war/attack",
        matchPaths: ["/admin/guild-war/attack"],
      },
      // { key: "guild-war-defense", label: "길드전 방어 가이드", href: "/admin/guides/guild-war/defense" },
      // { key: "raid", label: "레이드 가이드", href: "/admin/guides/raid" },
    ],
  },
];

export function isAdminNavActive(pathname: string, item: AdminNavItem) {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
    return true;
  }

  return (item.matchPaths ?? []).some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
