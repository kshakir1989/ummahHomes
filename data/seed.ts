import {
  ListingStatus,
  type HouseholdType,
  type Listing,
  type ListingType,
  type User,
} from "../src/domain/types";
import {
  listingAmenities,
  listingImageGallery,
  listingImageUrl,
  listingLocation,
  listingTitle,
} from "./listing-catalog";

export const SEED_VERSION = 5;

export const LISTING_TYPES: ListingType[] = [
  "home_sale",
  "home_rent",
  "room_rent",
  "basement_rent",
];

const HOUSEHOLDS: HouseholdType[] = ["single", "couple", "family", "group"];

const FINANCIAL_BACKGROUNDS = [
  "student",
  "dual-income",
  "single-income",
  "retired",
  "self-employed",
  "contractor",
  "healthcare",
  "tech",
  "service",
  "education",
];

const TYPE_LABEL: Record<ListingType, string> = {
  home_sale: "home for sale",
  home_rent: "home rental",
  room_rent: "room rental",
  basement_rent: "basement rental",
};

export interface SeedData {
  users: User[];
  listings: Listing[];
}

export function buildSeedData(): SeedData {
  const users: User[] = [];
  const admin: User = {
    id: "user-admin",
    displayName: "Demo Admin",
    email: "admin@demo.local",
    roles: ["admin"],
    householdType: "single",
    financialBackground: "operations",
    status: "active",
  };
  users.push(admin);

  for (let i = 1; i <= 10; i += 1) {
    const roles: User["roles"] =
      i <= 3
        ? ["seller", "buyer"]
        : i <= 6
          ? ["seller", "renter"]
          : i <= 8
            ? ["buyer"]
            : ["renter"];
    users.push({
      id: `user-${i}`,
      displayName: `Demo User ${i}`,
      email: `user${i}@demo.local`,
      roles,
      householdType: HOUSEHOLDS[i % HOUSEHOLDS.length],
      financialBackground: FINANCIAL_BACKGROUNDS[i - 1],
      status: "active",
    });
  }

  const listings: Listing[] = [];
  const sellers = users.filter((u) => u.roles.includes("seller"));
  const now = "2026-08-31T12:00:00.000Z";

  for (let i = 1; i <= 100; i += 1) {
    const type = LISTING_TYPES[(i - 1) % LISTING_TYPES.length];
    const owner = sellers[(i - 1) % sellers.length];
    const isSale = type === "home_sale";
    const location = listingLocation(i - 1);
    const amenities = listingAmenities(i);
    const gallery = listingImageGallery(i - 1);
    listings.push({
      id: `listing-${i}`,
      ownerId: owner.id,
      type,
      title: listingTitle(type, i - 1),
      description: `Owner-listed ${TYPE_LABEL[type]} in ${location.locationText}. Welcoming space in a walkable, community-minded neighborhood.`,
      locationText: location.locationText,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      price: isSale ? 285000 + i * 2200 : 950 + (i % 14) * 75,
      currency: "USD",
      status: ListingStatus.Published,
      imageUrl: gallery[0],
      imageUrls: gallery,
      amenities,
      requiresBackgroundCheck: i % 5 === 0,
      listingFeeCompleted: isSale,
      createdAt: now,
      updatedAt: now,
    });
  }

  return { users, listings };
}

export const seedData = buildSeedData();
