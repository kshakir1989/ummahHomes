import { beforeEach, describe, expect, it } from "@jest/globals";
import { getDemoState, resetDemoData } from "../demoStore";
import { signIn, signOut, getSession } from "../session";
import { operations } from "../../domain/operations";
import { ListingStatus } from "../../domain/types";

describe("reset demo data", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("restores seed after mutations", () => {
    operations.signIn("user-1");
    const listing = operations.createListing({
      type: "home_rent",
      title: "Temp",
      description: "Temp",
      locationText: "Atlanta, GA",
      price: 1000,
    });
    operations.publishListing(listing.id);
    expect(
      getDemoState().listings.some((l) => l.id === listing.id),
    ).toBe(true);

    operations.resetDemoData();
    signOut();

    expect(getDemoState().listings).toHaveLength(100);
    expect(getDemoState().requests).toHaveLength(0);
    expect(getSession()).toBeNull();
    expect(
      getDemoState().listings.every((l) => l.status === ListingStatus.Published),
    ).toBe(true);
  });
});
