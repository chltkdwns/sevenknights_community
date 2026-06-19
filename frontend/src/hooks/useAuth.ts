"use client";

import { useSyncExternalStore } from "react";
import {
  getAuthChangedEventName,
  getStoredUser,
  getToken,
} from "@/lib/auth";
import type { User } from "@/types";

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

/** SSR·hydration 시 React가 동일 참조를 요구하므로 모듈 레벨에서 한 번만 생성 */
const SERVER_AUTH_SNAPSHOT: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isAdmin: false,
};

let clientAuthSnapshot: AuthState = SERVER_AUTH_SNAPSHOT;

function subscribe(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const authEventName = getAuthChangedEventName();
  window.addEventListener(authEventName, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(authEventName, listener);
    window.removeEventListener("storage", listener);
  };
}

function usersEqual(a: User | null, b: User | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.role === b.role &&
    a.username === b.username &&
    a.nickname === b.nickname &&
    a.email === b.email
  );
}

function buildAuthSnapshot(): AuthState {
  const user = getStoredUser();
  const token = getToken();
  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && !!user && user.role === "ADMIN";

  if (
    clientAuthSnapshot.token === token &&
    clientAuthSnapshot.isLoggedIn === isLoggedIn &&
    clientAuthSnapshot.isAdmin === isAdmin &&
    usersEqual(clientAuthSnapshot.user, user)
  ) {
    return clientAuthSnapshot;
  }

  clientAuthSnapshot = { user, token, isLoggedIn, isAdmin };
  return clientAuthSnapshot;
}

function getAuthSnapshot(): AuthState {
  return buildAuthSnapshot();
}

function getServerAuthSnapshot(): AuthState {
  return SERVER_AUTH_SNAPSHOT;
}

/** localStorage 인증 상태를 구독해 Header·AdminLayout 등에서 동일한 값을 쓴다. */
export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getAuthSnapshot, getServerAuthSnapshot);
}
