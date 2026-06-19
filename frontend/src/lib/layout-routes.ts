import { isAdminRoute } from "@/lib/admin-routes";

const AUTH_PAGE_PATHS = new Set(["/login", "/signup"]);

/** 좌측 Sidebar를 숨기는 경로 — 관리자·로그인·회원가입 */
export function isSidebarHiddenRoute(pathname: string) {
  return isAdminRoute(pathname) || AUTH_PAGE_PATHS.has(pathname);
}

/** 로그인한 사용자가 접근하면 안 되는 게스트 전용 페이지 */
export function isGuestAuthRoute(pathname: string) {
  return AUTH_PAGE_PATHS.has(pathname);
}
