import type { User } from "@/types";

const TOKEN_KEY = "sk_community_token";
const USER_KEY = "sk_community_user";
const AUTH_CHANGED_EVENT = "sk-community-auth-changed";

function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function saveAuth(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChanged();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function isAdminUser(): boolean {
  const user = getStoredUser();
  const token = getToken();
  return !!token && !!user && user.role === "ADMIN";
}

/** 길드전 공격 가이드는 승인된 길드원(MEMBER)과 관리자만 볼 수 있다. */
export function canAccessGuildWarGuide(user: User | null): boolean {
  return !!user && (user.role === "MEMBER" || user.role === "ADMIN");
}

export function getAuthChangedEventName(): string {
  return AUTH_CHANGED_EVENT;
}
