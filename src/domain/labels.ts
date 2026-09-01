import { isSaleListing, type ListingType } from "./types";

export function primarySeekerCtaLabel(type: ListingType): string {
  return isSaleListing(type) ? "Express interest" : "Apply";
}

export function requestKindLabel(kind: "apply" | "interest"): string {
  return kind === "interest" ? "Express interest" : "Apply";
}
