import { describe, expect, it } from "@jest/globals";
import { buildSeedData } from "../../../data/seed";
import { homeRouteForActiveRole, homeRouteForUser } from "../authRoutes";

describe("authRoutes", () => {
  const users = buildSeedData().users;

  it("routes dual-role users to the role picker", () => {
    const sellerBuyer = users.find((user) => user.id === "user-1");
    expect(homeRouteForUser(sellerBuyer!)).toBe("/role-picker");
  });

  it("routes single-role sellers to the dashboard", () => {
    expect(homeRouteForActiveRole(users.find((u) => u.id === "user-1")!, "seller")).toBe(
      "/dashboard",
    );
  });

  it("routes admins to the admin surface", () => {
    const admin = users.find((user) => user.roles.includes("admin"));
    expect(homeRouteForUser(admin!)).toBe("/admin");
  });

  it("routes buyers to the buyer dashboard", () => {
    const buyer = users.find((user) => user.id === "user-7");
    expect(homeRouteForUser(buyer!)).toBe("/buyer-dashboard");
  });

  it("routes renters to the renter dashboard", () => {
    const renter = users.find((user) => user.id === "user-9");
    expect(homeRouteForUser(renter!)).toBe("/renter-dashboard");
  });
});
