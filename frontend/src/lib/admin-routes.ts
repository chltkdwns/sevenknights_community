/** `/admin` 하위 경로 여부 — 레이아웃·헤더 분기에 공통 사용 */
export function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
