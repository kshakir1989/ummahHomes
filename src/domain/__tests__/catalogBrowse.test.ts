import { describe, expect, it } from "@jest/globals";
import { isListingVisibleInBrowse } from "../catalogBrowse";
import { resolveListingSale } from "../listingRules";
import { ListingStatus } from "../types";
import type { Listing } from "../types";

const saleListing = (status: ListingStatus): Listing => ({
  id: "l1",
  ownerId: "u1",
  type: "home_sale",
  title: "Sale",
  description: "Desc",
  locationText: "Atlanta, GA",
  city: "Atlanta",
  state: "GA",
  zipCode: "30309",
  price: 100000,
  currency: "USD",
  status,
  imageUrl: "https://example.com/1.jpg",
  imageUrls: ["https://example.com/1.jpg"],
  amenities: [],
  requiresBackgroundCheck: false,
  listingFeeCompleted: true,
  createdAt: "",
  updatedAt: "",
});

describe("catalogBrowse", () => {
  it("hides resolved listings from browse", () => {
    expect(isListingVisibleInBrowse(saleListing(ListingStatus.Resolved))).toBe(
      false,
    );
  });

  it("shows booked sale listings with badge path", () => {
    expect(isListingVisibleInBrowse(saleListing(ListingStatus.Booked))).toBe(
      true,
    );
  });
});

describe("resolveListingSale", () => {
  it("requires booked sale before resolve", () => {
    expect(() => resolveListingSale(saleListing(ListingStatus.Published))).toThrow();
  });

  it("marks booked sale as resolved", () => {
    const resolved = resolveListingSale(saleListing(ListingStatus.Booked));
    expect(resolved.status).toBe(ListingStatus.Resolved);
  });
});
