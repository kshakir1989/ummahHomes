import {
  ATLANTA_METRO_CITIES,
  metroLocationAt,
  parseAtlantaMetroLocation,
} from "./atlanta-metro";

/** Verified Unsplash housing photography (see assets/listings/ATTRIBUTION.md). */
const LISTING_IMAGE_BASE = [
  "photo-1600596542815-ffad4c1539a9",
  "photo-1600585154340-be6161a56a0c",
  "photo-1564013799919-ab600027ffc6",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600566753190-17f0baa2a6c3",
  "photo-1600573472592-401b489a3cdc",
  "photo-1613490493576-7fde63acd811",
  "photo-1512917774080-9991f1c4c750",
  "photo-1582268611958-ebfd161ef9cf",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1600585152915-d208bec867a1",
  "photo-1600607687644-c7171b42498f",
  "photo-1600585154526-990dced4db0d",
  "photo-1568605114967-8130f3a36994",
  "photo-1600607687920-4e2a09cf159d",
] as const;

const LISTING_IMAGE_WIDTH = 1600;
const LISTING_IMAGE_QUALITY = 85;

function unsplashImageUrl(photoId: string, width = LISTING_IMAGE_WIDTH): string {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=${LISTING_IMAGE_QUALITY}`;
}

/** Curated, HTTP-verified listing photos at consistent high resolution. */
export const LISTING_IMAGE_URLS = LISTING_IMAGE_BASE.map((photoId) =>
  unsplashImageUrl(photoId),
);

/** Hero — welcoming home exterior at golden hour. */
export const MARKETING_HERO_IMAGE = unsplashImageUrl(
  "photo-1600596542815-ffad4c1539a9",
  2400,
);

/** Full-width drone aerial of a suburban neighborhood. */
export const MARKETING_DRONE_NEIGHBORHOOD = unsplashImageUrl(
  "photo-1524813686514-a57563d77965",
  2400,
);

export const MARKETING_COMMUNITY_IMAGE = unsplashImageUrl(
  "photo-1600585154526-990dced4db0d",
  1800,
);

export const MARKETING_SAFE_HOME_IMAGE = unsplashImageUrl(
  "photo-1600585152915-d208bec867a1",
  1800,
);

export const AMENITY_POOL = [
  "In-unit laundry",
  "Central AC",
  "Private parking",
  "Pet friendly",
  "Fenced yard",
  "Near masjid",
  "Secure entry",
  "Hardwood floors",
  "Updated kitchen",
  "Natural light",
  "Community room",
  "Walkable neighborhood",
  "Dedicated office nook",
  "Storage included",
  "Smoke-free building",
] as const;

const SALE_TITLES = [
  "Owner-listed family home",
  "Move-in ready residence",
  "Spacious corner lot home",
  "Renovated owner listing",
  "Quiet street single-family",
];

const RENT_HOME_TITLES = [
  "Whole-home rental",
  "Family-friendly home lease",
  "Bright owner-listed home",
  "Garden-level home rental",
  "Updated owner-managed home",
];

const ROOM_TITLES = [
  "Private room in shared home",
  "Furnished room rental",
  "Quiet room with shared kitchen",
  "Owner-listed room",
  "Room in family home",
];

const BASEMENT_TITLES = [
  "Finished basement suite",
  "Private basement apartment",
  "Walk-out basement rental",
  "Owner-listed basement unit",
  "Separate-entry basement",
];

export function listingImageUrl(index: number): string {
  return LISTING_IMAGE_URLS[index % LISTING_IMAGE_URLS.length];
}

export function listingTitle(type: string, index: number): string {
  const pool =
    type === "home_sale"
      ? SALE_TITLES
      : type === "home_rent"
        ? RENT_HOME_TITLES
        : type === "room_rent"
          ? ROOM_TITLES
          : BASEMENT_TITLES;
  return pool[index % pool.length];
}

export function listingAmenities(index: number): string[] {
  const count = 3 + (index % 3);
  const picked: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const amenity = AMENITY_POOL[(index + i * 3) % AMENITY_POOL.length];
    if (!picked.includes(amenity)) {
      picked.push(amenity);
    }
  }
  return picked;
}

export function listingLocation(index: number) {
  return metroLocationAt(index);
}

export { ATLANTA_METRO_CITIES, parseAtlantaMetroLocation };
