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
      locationText: "Atlanta, GA 30309",
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
      locationText: "Atlanta, GA 30309",
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
      locationText: "Atlanta, GA 30309",
      price: 900,
    });
    const published = operations.publishListing(listing.id);
    const unpublished = operations.unpublishListing(published.id);
    expect(unpublished.status).toBe(ListingStatus.Draft);
  });

  it("lists only the signed-in seller listings", () => {
    operations.signIn("user-1");
    operations.createListing({ type: "home_rent", title: "Mine" });
    const mine = operations.listMyListings();
    expect(mine.every((listing) => listing.ownerId === "user-1")).toBe(true);
    expect(mine.some((listing) => listing.title === "Mine")).toBe(true);
  });

  it("deletes an owned listing", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({ type: "room_rent", title: "Delete me" });
    operations.deleteListing(listing.id);
    expect(operations.listMyListings().some((l) => l.id === listing.id)).toBe(
      false,
    );
  });

  it("blocks owners from creating requests on their own listings", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({
      type: "home_sale",
      title: "My sale",
      description: "Desc",
      locationText: "Atlanta, GA 30309",
      price: 300000,
    });
    operations.completeListingFeeStub(listing.id);
    operations.publishListing(listing.id);
    expect(() => operations.createRequest(listing.id)).toThrow("FORBIDDEN");
  });
});
