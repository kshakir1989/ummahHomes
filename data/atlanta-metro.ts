export interface MetroLocation {
  city: string;
  state: string;
  zipCode: string;
}

/** Owner-approved Atlanta metro area catalog for stage-1 demo. */
export const ATLANTA_METRO_LOCATIONS: MetroLocation[] = [
  { city: "Atlanta", state: "GA", zipCode: "30309" },
  { city: "Atlanta", state: "GA", zipCode: "30318" },
  { city: "Atlanta", state: "GA", zipCode: "30331" },
  { city: "Lawrenceville", state: "GA", zipCode: "30043" },
  { city: "Lawrenceville", state: "GA", zipCode: "30044" },
  { city: "Stone Mountain", state: "GA", zipCode: "30083" },
  { city: "Stone Mountain", state: "GA", zipCode: "30087" },
  { city: "Douglasville", state: "GA", zipCode: "30134" },
  { city: "Douglasville", state: "GA", zipCode: "30135" },
  { city: "Sandy Springs", state: "GA", zipCode: "30328" },
  { city: "Sandy Springs", state: "GA", zipCode: "30342" },
  { city: "Johns Creek", state: "GA", zipCode: "30022" },
  { city: "Johns Creek", state: "GA", zipCode: "30097" },
  { city: "Marietta", state: "GA", zipCode: "30060" },
  { city: "Marietta", state: "GA", zipCode: "30062" },
  { city: "Decatur", state: "GA", zipCode: "30030" },
  { city: "Decatur", state: "GA", zipCode: "30032" },
  { city: "Roswell", state: "GA", zipCode: "30075" },
  { city: "Alpharetta", state: "GA", zipCode: "30004" },
  { city: "Alpharetta", state: "GA", zipCode: "30009" },
  { city: "Smyrna", state: "GA", zipCode: "30080" },
  { city: "Brookhaven", state: "GA", zipCode: "30319" },
  { city: "Dunwoody", state: "GA", zipCode: "30338" },
  { city: "Tucker", state: "GA", zipCode: "30084" },
  { city: "Norcross", state: "GA", zipCode: "30071" },
  { city: "Peachtree City", state: "GA", zipCode: "30269" },
  { city: "Kennesaw", state: "GA", zipCode: "30144" },
];

export const ATLANTA_METRO_CITIES = [
  ...new Set(ATLANTA_METRO_LOCATIONS.map((location) => location.city)),
].sort();

export function formatMetroLocation(location: MetroLocation): string {
  return `${location.city}, ${location.state} ${location.zipCode}`;
}

export function metroLocationAt(index: number): MetroLocation & { locationText: string } {
  const location = ATLANTA_METRO_LOCATIONS[index % ATLANTA_METRO_LOCATIONS.length];
  return {
    ...location,
    locationText: formatMetroLocation(location),
  };
}

export function parseAtlantaMetroLocation(
  locationText: string,
): (MetroLocation & { locationText: string }) | null {
  const zipMatch = locationText.match(/\b(\d{5})\b/);
  const zipCode = zipMatch?.[1];
  const normalized = locationText.toLowerCase();

  const city = ATLANTA_METRO_CITIES.find((name) =>
    normalized.includes(name.toLowerCase()),
  );
  if (!city) {
    return null;
  }

  const matches = ATLANTA_METRO_LOCATIONS.filter((location) => location.city === city);
  if (matches.length === 0) {
    return null;
  }

  const match =
    (zipCode && matches.find((location) => location.zipCode === zipCode)) ||
    matches[0];

  return {
    ...match,
    locationText: formatMetroLocation(match),
  };
}
