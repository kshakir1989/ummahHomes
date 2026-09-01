export type Role = "seller" | "buyer" | "renter" | "admin";

export type HouseholdType = "single" | "couple" | "family" | "group";

export type UserStatus = "active" | "suspended";

export type ListingType =
  | "home_sale"
  | "home_rent"
  | "room_rent"
  | "basement_rent";

export enum ListingStatus {
  Draft = "draft",
  Published = "published",
  Booked = "booked",
  Resolved = "resolved",
}

export enum RequestKind {
  Apply = "apply",
  Interest = "interest",
}

export enum RequestStatus {
  Submitted = "submitted",
  Accepted = "accepted",
  Denied = "denied",
  Withdrawn = "withdrawn",
  Unavailable = "unavailable",
}

export enum BgStubStatus {
  Pending = "pending",
  Passed = "passed",
  Failed = "failed",
  Declined = "declined",
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  roles: Role[];
  householdType: HouseholdType;
  financialBackground: string;
  status: UserStatus;
}

export interface Listing {
  id: string;
  ownerId: string;
  type: ListingType;
  title: string;
  description: string;
  locationText: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  currency: "USD";
  status: ListingStatus;
  /** Hero image — first entry in `imageUrls`. */
  imageUrl: string;
  imageUrls: string[];
  amenities: string[];
  requiresBackgroundCheck: boolean;
  listingFeeCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationInterest {
  id: string;
  listingId: string;
  seekerId: string;
  kind: RequestKind;
  status: RequestStatus;
  /** Seller may require BG per application (rent only). */
  backgroundCheckRequired: boolean;
  backgroundCheckStatus: BgStubStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageThread {
  id: string;
  applicationInterestId: string;
  participantIds: string[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

export interface AdminAction {
  id: string;
  actorId: string;
  targetType: "user" | "listing";
  targetId: string;
  action: string;
  createdAt: string;
}

export const RENT_LISTING_TYPES: ListingType[] = [
  "home_rent",
  "room_rent",
  "basement_rent",
];

export const SALE_LISTING_TYPES: ListingType[] = ["home_sale"];

export function isRentListing(type: ListingType): boolean {
  return RENT_LISTING_TYPES.includes(type);
}

export function isSaleListing(type: ListingType): boolean {
  return type === "home_sale";
}

export function requestKindForListingType(type: ListingType): RequestKind {
  return isSaleListing(type) ? RequestKind.Interest : RequestKind.Apply;
}
