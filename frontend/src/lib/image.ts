const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}
