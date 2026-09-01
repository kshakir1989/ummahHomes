import { beforeEach, describe, expect, it } from "@jest/globals";
import { operations } from "../operations";
import { getDemoState, resetDemoData } from "../../store/demoStore";
import { signOut } from "../../store/session";

describe("messaging", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("sends and lists messages for thread participants", () => {
    const listing = getDemoState().listings.find(
      (l) => l.type === "home_rent" && !l.requiresBackgroundCheck,
    )!;
    operations.signIn("user-9");
    const request = operations.createRequest(listing.id);
    const thread = getDemoState().threads.find(
      (t) => t.applicationInterestId === request.id,
    )!;
    operations.sendMessage(thread.id, "Interested in viewing");
    operations.signOut();
    operations.signIn(listing.ownerId);
    operations.sendMessage(thread.id, "Happy to schedule");
    const messages = operations.listMessages(thread.id);
    expect(messages).toHaveLength(2);
    expect(messages[0].body).toBe("Interested in viewing");
    expect(messages[1].body).toBe("Happy to schedule");
  });

  it("forbids messaging for non-participants", () => {
    const listing = getDemoState().listings.find(
      (l) => l.type === "home_rent" && !l.requiresBackgroundCheck,
    )!;
    operations.signIn("user-9");
    const request = operations.createRequest(listing.id);
    const thread = getDemoState().threads.find(
      (t) => t.applicationInterestId === request.id,
    )!;
    operations.signOut();
    operations.signIn("user-4");
    expect(() => operations.sendMessage(thread.id, "spy")).toThrow("FORBIDDEN");
  });
});
