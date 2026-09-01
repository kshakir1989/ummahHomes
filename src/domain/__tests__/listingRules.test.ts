import { describe, expect, it } from "@jest/globals";
import {
  canPublishListing,
  completeListingFeeStub,
  markListingBooked,
  validateListingForPublish,
} from "../listingRules";
import { ListingStatus } from "../types";
import type { Listing } from "../types";

const baseListing = (): Listing => ({
  id: "l1",
  ownerId: "u1",
  type: "home_sale",
  title: "Title",
  description: "Description",
  locationText: "Atlanta, GA 30309",
  city: "Atlanta",
  state: "GA",
  zipCode: "30309",
  price: 100000,
  currency: "USD",
  status: ListingStatus.Draft,
  imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
  imageUrls: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
  ],
  amenities: ["Central AC"],
  requiresBackgroundCheck: false,
  listingFeeCompleted: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("listingRules", () => {
  it("blocks sale publish without fee stub", () => {
    const listing = baseListing();
    expect(canPublishListing(listing)).toBe(false);
    expect(validateListingForPublish(listing)).toBe("FEE_REQUIRED");
  });

  it("allows sale publish when fee completed", () => {
    const listing = { ...baseListing(), listingFeeCompleted: true };
    expect(canPublishListing(listing)).toBe(true);
  });

  it("allows rent publish without fee", () => {
    const listing = { ...baseListing(), type: "home_rent" as const };
    expect(canPublishListing(listing)).toBe(true);
  });

  it("marks listing booked", () => {
    const listing = {
      ...baseListing(),
      status: ListingStatus.Published,
      listingFeeCompleted: true,
    };
    const booked = markListingBooked(listing);
    expect(booked.status).toBe(ListingStatus.Booked);
  });

  it("completes fee stub on sale listing", () => {
    const listing = completeListingFeeStub(baseListing());
    expect(listing.listingFeeCompleted).toBe(true);
  });
});
