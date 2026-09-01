import type { User } from "../domain/types";
import { getDemoState } from "./demoStore";

const SESSION_KEY = "ummahHomes.demoSessionUserId";
const ACTIVE_ROLE_KEY = "ummahHomes.demoActiveRole";

export type ActiveRole = User["roles"][number];

let currentUserId: string | null = readStoredSession();
let currentActiveRole: ActiveRole | null = readStoredActiveRole();

function readStoredSession(): string | null {
  if (typeof globalThis.sessionStorage !== "undefined") {
    return globalThis.sessionStorage.getItem(SESSION_KEY);
  }
  return null;
}

function readStoredActiveRole(): ActiveRole | null {
  if (typeof globalThis.sessionStorage !== "undefined") {
    const value = globalThis.sessionStorage.getItem(ACTIVE_ROLE_KEY);
    if (
      value === "seller" ||
      value === "buyer" ||
      value === "renter" ||
      value === "admin"
    ) {
      return value;
    }
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

function writeStoredActiveRole(role: ActiveRole | null): void {
  if (typeof globalThis.sessionStorage !== "undefined") {
    if (role) {
      globalThis.sessionStorage.setItem(ACTIVE_ROLE_KEY, role);
    } else {
      globalThis.sessionStorage.removeItem(ACTIVE_ROLE_KEY);
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
  if (user.roles.length === 1) {
    setActiveRole(user.roles[0]);
  } else {
    clearActiveRole();
  }
  return user;
}

export function signOut(): void {
  currentUserId = null;
  clearActiveRole();
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

export function setActiveRole(role: ActiveRole): void {
  const session = getSession();
  if (!session || !hasRole(session, role)) {
    throw new Error("FORBIDDEN_ROLE");
  }
  currentActiveRole = role;
  writeStoredActiveRole(role);
}

export function getActiveRole(): ActiveRole | null {
  if (!currentActiveRole) {
    currentActiveRole = readStoredActiveRole();
  }
  const session = getSession();
  if (!session) {
    return null;
  }
  if (currentActiveRole && hasRole(session, currentActiveRole)) {
    return currentActiveRole;
  }
  if (session.roles.length === 1) {
    return session.roles[0];
  }
  return null;
}

export function clearActiveRole(): void {
  currentActiveRole = null;
  writeStoredActiveRole(null);
}

export function needsRolePicker(user: User): boolean {
  return user.roles.length > 1;
}
