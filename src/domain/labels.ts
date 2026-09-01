import { isSaleListing, RequestKind, type ListingType } from "./types";

export function primarySeekerCtaLabel(type: ListingType): string {
  return isSaleListing(type) ? "Express interest" : "Apply";
}

export function requestKindLabel(kind: RequestKind | string): string {
  const labels: Record<string, string> = {
    [RequestKind.Apply]: "Apply",
    [RequestKind.Interest]: "Interest",
  };
  return labels[kind] ?? kind;
}

export function requestStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: "Submitted",
    accepted: "Accepted",
    denied: "Denied",
    withdrawn: "Withdrawn",
    unavailable: "Unavailable",
  };
  return labels[status] ?? status;
}
