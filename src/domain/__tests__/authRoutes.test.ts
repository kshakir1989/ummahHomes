import { describe, expect, it } from "@jest/globals";
import { buildSeedData } from "../../../data/seed";
import { homeRouteForUser } from "../authRoutes";

describe("authRoutes", () => {
  const users = buildSeedData().users;

  it("routes sellers to the dashboard", () => {
    const seller = users.find((user) => user.roles.includes("seller"));
    expect(seller).toBeDefined();
    expect(homeRouteForUser(seller!)).toBe("/dashboard");
  });

  it("routes admins to the admin surface", () => {
    const admin = users.find((user) => user.roles.includes("admin"));
    expect(admin).toBeDefined();
    expect(homeRouteForUser(admin!)).toBe("/admin");
  });

  it("routes buyers and renters to browse", () => {
    const renter = users.find((user) => user.id === "user-9");
    const buyer = users.find((user) => user.id === "user-7");
    expect(homeRouteForUser(renter!)).toBe("/browse");
    expect(homeRouteForUser(buyer!)).toBe("/browse");
  });
});
