import type { User } from "../domain/types";
import { getDemoState } from "./demoStore";

const SESSION_KEY = "ummahHomes.demoSessionUserId";

let currentUserId: string | null = readStoredSession();

function readStoredSession(): string | null {
  if (typeof globalThis.sessionStorage !== "undefined") {
    return globalThis.sessionStorage.getItem(SESSION_KEY);
  }
  return null;
}

function writeStoredSession(accountId: string | null): void {
  if (typeof globalThis.sessionStorage !== "undefined") {
    if (accountId) {
      globalThis.sessionStorage.setItem(SESSION_KEY, accountId);
    } else {
      globalThis.sessionStorage.removeItem(SESSION_KEY);
    }
  }
}

export function signIn(accountId: string): User {
  const user = getDemoState().users.find((u) => u.id === accountId);
  if (!user || user.status === "suspended") {
    throw new Error("AUTH_REQUIRED");
  }
  currentUserId = user.id;
  writeStoredSession(user.id);
  return user;
}

export function signOut(): void {
  currentUserId = null;
  writeStoredSession(null);
}

export function getSession(): User | null {
  if (!currentUserId) {
    currentUserId = readStoredSession();
  }
  if (!currentUserId) {
    return null;
  }
  return getDemoState().users.find((u) => u.id === currentUserId) ?? null;
}

export function requireSession(): User {
  const session = getSession();
  if (!session) {
    throw new Error("AUTH_REQUIRED");
  }
  return session;
}

export function hasRole(user: User, role: User["roles"][number]): boolean {
  return user.roles.includes(role);
}
