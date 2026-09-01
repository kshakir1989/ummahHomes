import type { User } from "./types";
import { getActiveRole, hasRole, needsRolePicker } from "../store/session";

export function homeRouteForUser(user: User): string {
  if (needsRolePicker(user)) {
    return "/role-picker";
  }
  return homeRouteForActiveRole(user, getActiveRole() ?? user.roles[0]);
}

export function homeRouteForActiveRole(
  user: User,
  role: User["roles"][number],
): string {
  if (role === "admin" && hasRole(user, "admin")) {
    return "/admin";
  }
  if (role === "seller" && hasRole(user, "seller")) {
    return "/dashboard";
  }
  if (role === "buyer" && hasRole(user, "buyer")) {
    return "/buyer-dashboard";
  }
  if (role === "renter" && hasRole(user, "renter")) {
    return "/renter-dashboard";
  }
  return "/browse";
}

export function browsePath(): string {
  return "/browse";
}

/** @deprecated Use browsePath() — combined catalog uses type filter chips. */
export function buyerBrowsePath(): string {
  return "/browse";
}

export function signInSuccessRoute(
  user: User,
  returnTo?: string | null,
): string {
  if (returnTo && returnTo.startsWith("/")) {
    return returnTo;
  }
  return homeRouteForUser(user);
}
