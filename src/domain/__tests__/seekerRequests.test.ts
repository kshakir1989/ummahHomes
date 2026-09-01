import { beforeEach, describe, expect, it } from "@jest/globals";
import { operations } from "../operations";
import { BgStubStatus, ListingStatus, RequestKind, RequestStatus } from "../types";
import { getDemoState, resetDemoData } from "../../store/demoStore";
import { signOut } from "../../store/session";

describe("seeker requests", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("creates apply request for rent listings", () => {
    operations.signIn("user-9");
    const rent = getDemoState().listings.find((l) => l.type === "home_rent")!;
    const request = operations.createRequest(rent.id);
    expect(request.kind).toBe(RequestKind.Apply);
    expect(request.status).toBe(RequestStatus.Submitted);
  });

  it("creates interest request for sale listings", () => {
    operations.signIn("user-7");
    const sale = getDemoState().listings.find((l) => l.type === "home_sale")!;
    const request = operations.createRequest(sale.id);
    expect(request.kind).toBe(RequestKind.Interest);
  });

  it("allows multiple open requests on one listing", () => {
    const rent = getDemoState().listings.find((l) => l.type === "home_rent")!;
    operations.signIn("user-9");
    const first = operations.createRequest(rent.id);
    operations.signOut();
    operations.signIn("user-10");
    const second = operations.createRequest(rent.id);
    expect(first.status).toBe(RequestStatus.Submitted);
    expect(second.status).toBe(RequestStatus.Submitted);
  });

  it("marks open requests unavailable when listing is booked", () => {
    const rent = getDemoState().listings.find((l) => l.type === "home_rent")!;
    operations.signIn("user-9");
    const request = operations.createRequest(rent.id);
    operations.signOut();
    operations.signIn(rent.ownerId);
    operations.markListingBooked(rent.id);
    const updated = getDemoState().requests.find((r) => r.id === request.id)!;
    expect(updated.status).toBe(RequestStatus.Unavailable);
    expect(operations.getListing(rent.id).status).toBe(ListingStatus.Booked);
  });

  it("blocks createRequest on booked listing", () => {
    const rent = getDemoState().listings.find((l) => l.type === "home_rent")!;
    operations.signIn(rent.ownerId);
    operations.markListingBooked(rent.id);
    operations.signOut();
    operations.signIn("user-9");
    expect(() => operations.createRequest(rent.id)).toThrow("LISTING_BOOKED");
  });

  it("gates messaging when BG stub is declined", () => {
    const listing = getDemoState().listings.find(
      (l) => l.type === "home_rent" && l.requiresBackgroundCheck,
    )!;
    operations.signIn("user-9");
    const request = operations.createRequest(listing.id);
    operations.startBackgroundCheckStub(request.id);
    operations.declineBackgroundCheckStub(request.id);
    const thread = getDemoState().threads.find(
      (t) => t.applicationInterestId === request.id,
    )!;
    expect(() => operations.sendMessage(thread.id, "hello")).toThrow("BG_REQUIRED");
    expect(
      getDemoState().requests.find((r) => r.id === request.id)!.backgroundCheckStatus,
    ).toBe(BgStubStatus.Declined);
  });
});
