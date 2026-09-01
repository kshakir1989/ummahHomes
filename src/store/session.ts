import type { User } from "../domain/types";
import { getDemoState } from "./demoStore";

let currentUserId: string | null = null;

export function signIn(accountId: string): User {
  const user = getDemoState().users.find((u) => u.id === accountId);
  if (!user || user.status === "suspended") {
    throw new Error("AUTH_REQUIRED");
  }
  currentUserId = user.id;
  return user;
}

export function signOut(): void {
  currentUserId = null;
}

export function getSession(): User | null {
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
