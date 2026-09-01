import { describe, expect, it, beforeEach } from "@jest/globals";
import { getDemoState, resetDemoData } from "../demoStore";
import { signIn, signOut, getSession } from "../session";

describe("session", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("signs in an active demo user", () => {
    const user = getDemoState().users.find((u) => u.id === "user-1");
    expect(user).toBeDefined();
    signIn("user-1");
    expect(getSession()?.id).toBe("user-1");
  });

  it("clears session on sign out", () => {
    signIn("user-1");
    signOut();
    expect(getSession()).toBeNull();
  });

  it("exposes roles from signed-in user", () => {
    signIn("user-admin");
    expect(getSession()?.roles).toContain("admin");
  });

  it("rejects suspended users", () => {
    expect(() => signIn("user-missing")).toThrow();
  });
});
