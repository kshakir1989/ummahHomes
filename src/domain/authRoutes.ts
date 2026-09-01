import type { User } from "./types";
import { hasRole } from "../store/session";

export function homeRouteForUser(user: User): string {
  if (hasRole(user, "admin")) {
    return "/admin";
  }
  if (hasRole(user, "seller")) {
    return "/dashboard";
  }
  return "/browse";
}
