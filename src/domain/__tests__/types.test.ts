import {
  describe,
  expect,
  it,
} from "@jest/globals";
import type {
  ApplicationInterest,
  Listing,
  ListingType,
  Role,
  User,
} from "../types";
import {
  BgStubStatus,
  ListingStatus,
  RequestKind,
  RequestStatus,
} from "../types";
import { LISTING_IMAGE_URLS } from "../../../data/listing-catalog";

describe("domain types", () => {
  it("defines four listing types", () => {
    const types: ListingType[] = [
      "home_sale",
      "home_rent",
      "room_rent",
      "basement_rent",
    ];
    expect(types).toHaveLength(4);
  });

  it("defines four roles", () => {
    const roles: Role[] = ["seller", "buyer", "renter", "admin"];
    expect(roles).toHaveLength(4);
  });

  it("accepts a valid user shape", () => {
    const user: User = {
      id: "u1",
      displayName: "Demo Seller",
      email: "seller@demo.local",
      roles: ["seller"],
      householdType: "family",
      financialBackground: "dual-income",
      status: "active",
    };
    expect(user.status).toBe("active");
  });

  it("accepts a valid listing shape", () => {
    const listing: Listing = {
      id: "l1",
      ownerId: "u1",
      type: "home_sale",
      title: "Cozy home",
      description: "Owner listed",
      locationText: "Atlanta, GA 30309",
      city: "Atlanta",
      state: "GA",
      zipCode: "30309",
      price: 350000,
      currency: "USD",
      status: ListingStatus.Draft,
      imageUrl: LISTING_IMAGE_URLS[0],
      imageUrls: [LISTING_IMAGE_URLS[0], LISTING_IMAGE_URLS[1]],
      amenities: ["Central AC", "Private parking"],
      requiresBackgroundCheck: false,
      listingFeeCompleted: false,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    expect(listing.currency).toBe("USD");
  });

  it("accepts a valid application interest shape", () => {
    const request: ApplicationInterest = {
      id: "r1",
      listingId: "l1",
      seekerId: "u2",
      kind: RequestKind.Interest,
      status: RequestStatus.Submitted,
      backgroundCheckRequired: false,
      backgroundCheckStatus: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    expect(request.kind).toBe(RequestKind.Interest);
    expect(BgStubStatus.Pending).toBe("pending");
  });
});
