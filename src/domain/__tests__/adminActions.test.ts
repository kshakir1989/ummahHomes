import { beforeEach, describe, expect, it } from "@jest/globals";
import { operations } from "../operations";
import { ListingStatus } from "../types";
import { getDemoState, resetDemoData } from "../../store/demoStore";
import { signOut } from "../../store/session";

describe("admin actions", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("lists users and listings for admin", () => {
    operations.signIn("user-admin");
    expect(operations.listUsers().length).toBeGreaterThanOrEqual(11);
    expect(operations.listAllListings().length).toBeGreaterThanOrEqual(100);
  });

  it("suspends a user and records AdminAction", () => {
    operations.signIn("user-admin");
    operations.suspendUser("user-1");
    expect(getDemoState().users.find((u) => u.id === "user-1")!.status).toBe(
      "suspended",
    );
    expect(
      getDemoState().adminActions.some((a) => a.action === "suspend_user"),
    ).toBe(true);
  });

  it("unpublishes a listing as admin", () => {
    operations.signIn("user-admin");
    const listing = getDemoState().listings.find(
      (l) => l.status === ListingStatus.Published,
    )!;
    const updated = operations.adminUnpublishListing(listing.id);
    expect(updated.status).toBe(ListingStatus.Draft);
  });

  it("marks a listing booked as admin", () => {
    operations.signIn("user-admin");
    const listing = getDemoState().listings.find(
      (l) => l.status === ListingStatus.Published,
    )!;
    const updated = operations.adminMarkBooked(listing.id);
    expect(updated.status).toBe(ListingStatus.Booked);
    expect(
      getDemoState().adminActions.some((a) => a.action === "mark_booked"),
    ).toBe(true);
  });

  it("forbids admin ops for non-admin", () => {
    operations.signIn("user-1");
    expect(() => operations.listUsers()).toThrow("FORBIDDEN");
  });
});
