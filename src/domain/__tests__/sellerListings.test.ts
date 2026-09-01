import { beforeEach, describe, expect, it } from "@jest/globals";
import { operations } from "../operations";
import { ListingStatus } from "../types";
import { resetDemoData } from "../../store/demoStore";
import { signOut } from "../../store/session";

describe("seller listings", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("creates a draft listing for seller", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({ type: "home_rent" });
    expect(listing.status).toBe(ListingStatus.Draft);
    expect(listing.ownerId).toBe("user-1");
  });

  it("blocks sale publish until fee stub completed", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({
      type: "home_sale",
      title: "Sale home",
      description: "Desc",
      locationText: "Atlanta, GA",
      price: 250000,
    });
    expect(() => operations.publishListing(listing.id)).toThrow("FEE_REQUIRED");
  });

  it("publishes sale listing after fee stub", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({
      type: "home_sale",
      title: "Sale home",
      description: "Desc",
      locationText: "Atlanta, GA",
      price: 250000,
    });
    operations.completeListingFeeStub(listing.id);
    const published = operations.publishListing(listing.id);
    expect(published.status).toBe(ListingStatus.Published);
  });

  it("unpublishes a published listing", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({
      type: "room_rent",
      title: "Room",
      description: "Desc",
      locationText: "Atlanta, GA",
      price: 900,
    });
    const published = operations.publishListing(listing.id);
    const unpublished = operations.unpublishListing(published.id);
    expect(unpublished.status).toBe(ListingStatus.Draft);
  });
});
