import { describe, expect, it } from "@jest/globals";
import { buildSeedData, LISTING_TYPES } from "../../../data/seed";
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
});
