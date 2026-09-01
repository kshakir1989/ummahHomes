import {
  ListingStatus,
  RENT_LISTING_TYPES,
  SALE_LISTING_TYPES,
  isRentListing,
  isSaleListing,
  type Listing,
  type ListingType,
  type User,
} from "./types";
import type { BrowseFilterCriteria } from "./browseFilters";
import { applyBrowseFilters } from "./browseFilters";
import { hasRole } from "../store/session";

export function isListingVisibleInBrowse(listing: Listing): boolean {
  if (
    listing.status === ListingStatus.Draft ||
    listing.status === ListingStatus.Resolved
  ) {
    return false;
  }
  if (listing.status === ListingStatus.Published) {
    return true;
  }
  if (listing.status === ListingStatus.Booked) {
    return isSaleListing(listing.type);
  }
  return false;
}

export function listingTypesForUser(user: User | null): ListingType[] | undefined {
  if (!user) {
    return undefined;
  }
  const types: ListingType[] = [];
  if (hasRole(user, "buyer")) {
    types.push(...SALE_LISTING_TYPES);
  }
  if (hasRole(user, "renter")) {
    types.push(...RENT_LISTING_TYPES);
  }
  if (types.length === 0) {
    return undefined;
  }
  return [...new Set(types)];
}

export function filterBrowseCatalog(
  listings: Listing[],
  filters: BrowseFilterCriteria,
  user: User | null,
): Listing[] {
  const visible = listings.filter(isListingVisibleInBrowse);
  const roleTypes = listingTypesForUser(user);
  const scoped =
    roleTypes === undefined
      ? visible
      : visible.filter((listing) => roleTypes.includes(listing.type));
  return applyBrowseFilters(scoped, filters);
}

export function renterNeedsBackgroundCheckBanner(
  listing: Listing,
  request: { backgroundCheckRequired: boolean; backgroundCheckStatus: string | null },
): boolean {
  return (
    isRentListing(listing.type) &&
    request.backgroundCheckRequired &&
    request.backgroundCheckStatus !== "passed"
  );
}
