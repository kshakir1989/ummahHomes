import { ListingStatus, type Listing } from "./types";

export type ListingPublishError = "FEE_REQUIRED" | "VALIDATION";

export function validateListingForPublish(
  listing: Listing,
): ListingPublishError | null {
  if (
    !listing.title.trim() ||
    !listing.description.trim() ||
    !listing.locationText.trim() ||
    listing.price <= 0
  ) {
    return "VALIDATION";
  }
  if (listing.type === "home_sale" && !listing.listingFeeCompleted) {
    return "FEE_REQUIRED";
  }
  return null;
}

export function canPublishListing(listing: Listing): boolean {
  return validateListingForPublish(listing) === null;
}

export function completeListingFeeStub(listing: Listing): Listing {
  if (listing.type !== "home_sale") {
    return listing;
  }
  return {
    ...listing,
    listingFeeCompleted: true,
    updatedAt: new Date().toISOString(),
  };
}

export function markListingBooked(listing: Listing): Listing {
  return {
    ...listing,
    status: ListingStatus.Booked,
    updatedAt: new Date().toISOString(),
  };
}

export function unpublishListing(listing: Listing): Listing {
  return {
    ...listing,
    status: ListingStatus.Draft,
    updatedAt: new Date().toISOString(),
  };
}

export function publishListing(listing: Listing): Listing {
  const error = validateListingForPublish(listing);
  if (error) {
    throw new Error(error);
  }
  return {
    ...listing,
    status: ListingStatus.Published,
    updatedAt: new Date().toISOString(),
  };
}
