import { describe, expect, it } from "@jest/globals";
import {
  acceptRequest,
  canCreateRequest,
  denyRequest,
  markRequestsUnavailableForListing,
} from "../requestRules";
import { BgStubStatus, ListingStatus, RequestKind, RequestStatus } from "../types";
import type { ApplicationInterest, Listing } from "../types";

const listing = (): Listing => ({
  id: "l1",
  ownerId: "u1",
  type: "home_rent",
  title: "Room",
  description: "Nice room",
  locationText: "Atlanta, GA",
  price: 900,
  currency: "USD",
  status: ListingStatus.Published,
  requiresBackgroundCheck: false,
  listingFeeCompleted: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

const request = (): ApplicationInterest => ({
  id: "r1",
  listingId: "l1",
  seekerId: "u2",
  kind: RequestKind.Apply,
  status: RequestStatus.Submitted,
  backgroundCheckStatus: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

describe("requestRules", () => {
  it("allows multiple open submitted requests", () => {
    const accepted = acceptRequest(request());
    expect(accepted.status).toBe(RequestStatus.Accepted);
    const second = acceptRequest({ ...request(), id: "r2" });
    expect(second.status).toBe(RequestStatus.Accepted);
  });

  it("denies a request", () => {
    expect(denyRequest(request()).status).toBe(RequestStatus.Denied);
  });

  it("blocks request on booked listing", () => {
    expect(
      canCreateRequest({ ...listing(), status: ListingStatus.Booked }),
    ).toBe(false);
  });

  it("marks open requests unavailable when listing booked", () => {
    const requests = [
      request(),
      { ...request(), id: "r2", status: RequestStatus.Accepted },
      { ...request(), id: "r3", status: RequestStatus.Denied },
    ];
    const updated = markRequestsUnavailableForListing(requests);
    expect(updated[0].status).toBe(RequestStatus.Unavailable);
    expect(updated[1].status).toBe(RequestStatus.Unavailable);
    expect(updated[2].status).toBe(RequestStatus.Denied);
  });

  it("requires bg pass before completion when required", () => {
    const withBg = {
      ...request(),
      backgroundCheckStatus: BgStubStatus.Declined,
    };
    expect(withBg.backgroundCheckStatus).toBe(BgStubStatus.Declined);
  });
});
