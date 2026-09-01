const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Next.js public 정적 경로는 API 호스트를 붙이지 않는다.
  if (url.startsWith("/images/")) {
    return url;
  }
  return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}
