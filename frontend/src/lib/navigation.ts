export type NavItem = {
  key: string;
  label: string;
  href: string;
};

export type NavSection = {
  key: string;
  label: string;
  items: NavItem[];
};

/** 사용자 작성 게시글 — BoardType 기반 게시판 */
export const COMMUNITY_NAV: NavSection = {
  key: "community",
  label: "커뮤니티",
  items: [
    { key: "notice", label: "공지게시판", href: "/board/notice" },
    { key: "free", label: "자유게시판", href: "/board/free" },
    { key: "guide-board", label: "공략게시판", href: "/board/guide" },
  ],
};

/**
 * 구조화된 가이드·도구 — 게시판과 별도 라우트(`/guides/**`).
 * 항목 추가 시 items 배열에만 등록하면 사이드바·헤더에 반영된다.
 */
export const GUIDE_NAV: NavSection = {
  key: "guides",
  label: "가이드",
  items: [
    { key: "guild-war", label: "길드전", href: "/guides/guild-war/attack" },
    // { key: "raid", label: "레이드", href: "/guides/raid" },
    // { key: "scenario-calc", label: "시나리오 효율 계산기", href: "/guides/scenario-calculator" },
    // { key: "event-calc", label: "이벤트 계산기", href: "/guides/event-calculator" },
  ],
};

export const SIDEBAR_SECTIONS: NavSection[] = [COMMUNITY_NAV, GUIDE_NAV];

export function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
