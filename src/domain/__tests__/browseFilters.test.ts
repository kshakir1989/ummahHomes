import { describe, expect, it } from "@jest/globals";
import { buildSeedData } from "../../../data/seed";
import { ATLANTA_METRO_CITIES } from "../../../data/listing-catalog";
import { applyBrowseFilters } from "../browseFilters";

describe("browseFilters", () => {
  const seed = buildSeedData().listings;

  it("filters by listing type", () => {
    const filtered = applyBrowseFilters(seed, { types: ["home_sale"] });
    expect(filtered.every((listing) => listing.type === "home_sale")).toBe(true);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it("filters by city and zip prefix", () => {
    const atlanta = applyBrowseFilters(seed, { city: "Atlanta" });
    expect(atlanta.every((listing) => listing.city === "Atlanta")).toBe(true);

    const zipFiltered = applyBrowseFilters(seed, { zipCode: "30043" });
    expect(zipFiltered.every((listing) => listing.zipCode.startsWith("30043"))).toBe(
      true,
    );
  });

  it("filters by search query across title and location", () => {
    const sample = seed.find((listing) => listing.city === "Johns Creek");
    expect(sample).toBeDefined();
    const filtered = applyBrowseFilters(seed, { query: "Johns Creek" });
    expect(filtered.some((listing) => listing.id === sample?.id)).toBe(true);
  });

  it("only includes Atlanta metro cities in seed data", () => {
    for (const listing of seed) {
      expect(listing.state).toBe("GA");
      expect(ATLANTA_METRO_CITIES).toContain(listing.city);
      expect(listing.zipCode).toMatch(/^\d{5}$/);
    }
  });
});
