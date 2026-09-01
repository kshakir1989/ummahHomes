import { describe, expect, it } from "@jest/globals";
import { buildSeedData, LISTING_TYPES } from "../../../data/seed";
import { LISTING_IMAGE_URLS } from "../../../data/listing-catalog";
import { ListingStatus } from "../../domain/types";

describe("seed invariants", () => {
  const seed = buildSeedData();

  it("has at least 100 listings", () => {
    expect(seed.listings.length).toBeGreaterThanOrEqual(100);
  });

  it("has 10 non-admin users plus one admin", () => {
    expect(seed.users.filter((u) => u.roles.includes("admin"))).toHaveLength(1);
    expect(seed.users.filter((u) => !u.roles.includes("admin"))).toHaveLength(10);
  });

  it("covers all four listing types", () => {
    const types = new Set(seed.listings.map((l) => l.type));
    for (const type of LISTING_TYPES) {
      expect(types.has(type)).toBe(true);
    }
  });

  it("spans household diversity", () => {
    const households = new Set(seed.users.map((u) => u.householdType));
    expect(households.size).toBeGreaterThanOrEqual(3);
  });

  it("defaults catalog listings to published", () => {
    expect(
      seed.listings.every((l) => l.status === ListingStatus.Published),
    ).toBe(true);
  });

  it("uses Atlanta metro locations with photos and amenities", () => {
    const allowedImages = new Set<string>(LISTING_IMAGE_URLS);
    for (const listing of seed.listings) {
      expect(listing.locationText).not.toMatch(/Demo City/i);
      expect(listing.state).toBe("GA");
      expect(listing.zipCode).toMatch(/^\d{5}$/);
      expect(listing.imageUrl.startsWith("https://images.unsplash.com/")).toBe(
        true,
      );
      expect(listing.imageUrl).toContain("w=1600");
      expect(listing.imageUrl).toContain("q=85");
      expect(allowedImages.has(listing.imageUrl)).toBe(true);
      expect(listing.amenities.length).toBeGreaterThanOrEqual(3);
    }
  });
});
