import { describe, expect, it } from "@jest/globals";
import { buildSeedData } from "../../../data/seed";
import { threadBackRouteForFrom, threadBackRouteForSession, resolveThreadBackRoute } from "../threadRoutes";

describe("threadRoutes", () => {
  const users = buildSeedData().users;

  it("routes buyers back to inbox", () => {
    const buyer = users.find((user) => user.id === "user-7");
    expect(threadBackRouteForSession(buyer!)).toBe("/inbox");
  });

  it("routes sellers back to seller inbox", () => {
    const seller = users.find((user) => user.id === "user-4");
    expect(threadBackRouteForSession(seller!)).toBe("/seller-inbox");
  });

  it("prefers explicit from query over session fallback", () => {
    const seller = users.find((user) => user.id === "user-1");
    expect(resolveThreadBackRoute("requests", seller)).toBe("/requests");
    expect(resolveThreadBackRoute("inbox", seller)).toBe("/inbox");
  });

  it("maps from query values", () => {
    expect(threadBackRouteForFrom("interests")).toBe("/my-interests");
  });
});
