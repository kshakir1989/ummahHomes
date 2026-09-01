import type { Listing, ListingType } from "./types";

export interface BrowseFilterCriteria {
  query?: string;
  types?: ListingType[];
  city?: string;
  state?: string;
  zipCode?: string;
}

export const LISTING_TYPE_FILTER_OPTIONS: {
  value: ListingType;
  label: string;
}[] = [
  { value: "home_sale", label: "House for sale" },
  { value: "home_rent", label: "House for rent" },
  { value: "room_rent", label: "Room for rent" },
  { value: "basement_rent", label: "Basement for rent" },
];

export function applyBrowseFilters(
  listings: Listing[],
  filters: BrowseFilterCriteria,
): Listing[] {
  const query = filters.query?.trim().toLowerCase() ?? "";
  const city = filters.city?.trim().toLowerCase() ?? "";
  const state = filters.state?.trim().toLowerCase() ?? "";
  const zipCode = filters.zipCode?.trim() ?? "";
  const types = filters.types ?? [];

  return listings.filter((listing) => {
    if (types.length > 0 && !types.includes(listing.type)) {
      return false;
    }

    if (city && listing.city.toLowerCase() !== city) {
      return false;
    }

    if (state && listing.state.toLowerCase() !== state) {
      return false;
    }

    if (zipCode && !listing.zipCode.startsWith(zipCode)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      listing.title,
      listing.description,
      listing.locationText,
      listing.city,
      listing.state,
      listing.zipCode,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
