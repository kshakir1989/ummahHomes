import type { User } from "./types";
import { getActiveRole, hasRole } from "../store/session";

export function threadBackRouteForFrom(from?: string): string {
  if (from === "requests") {
    return "/requests";
  }
  if (from === "interests") {
    return "/my-interests";
  }
  if (from === "applications") {
    return "/my-applications";
  }
  if (from === "inbox") {
    return "/inbox";
  }
  if (from === "renter-inbox") {
    return "/renter-inbox";
  }
  if (from === "seller-inbox") {
    return "/seller-inbox";
  }
  return "";
}

export function threadBackRouteForSession(user: User): string {
  const role = getActiveRole();
  if (role === "buyer" && hasRole(user, "buyer")) {
    return "/inbox";
  }
  if (role === "renter" && hasRole(user, "renter")) {
    return "/renter-inbox";
  }
  if (role === "seller" && hasRole(user, "seller")) {
    return "/seller-inbox";
  }
  if (hasRole(user, "buyer")) {
    return "/inbox";
  }
  if (hasRole(user, "seller")) {
    return "/seller-inbox";
  }
  if (hasRole(user, "renter")) {
    return "/renter-inbox";
  }
  return "/browse";
}

export function resolveThreadBackRoute(from?: string, user?: User | null): string {
  const fromRoute = threadBackRouteForFrom(from);
  if (fromRoute) {
    return fromRoute;
  }
  if (user) {
    return threadBackRouteForSession(user);
  }
  return "/browse";
}
