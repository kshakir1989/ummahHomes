import { describe, expect, it } from "@jest/globals";
import {
  primarySeekerCtaLabel,
  requestKindLabel,
  requestStatusLabel,
} from "../labels";
import { RequestKind, RequestStatus } from "../types";

describe("domain labels", () => {
  it("maps seeker CTA labels by listing type", () => {
    expect(primarySeekerCtaLabel("home_sale")).toBe("Express interest");
    expect(primarySeekerCtaLabel("home_rent")).toBe("Apply");
  });

  it("maps request kind labels", () => {
    expect(requestKindLabel(RequestKind.Apply)).toBe("Apply");
    expect(requestKindLabel(RequestKind.Interest)).toBe("Interest");
  });

  it("maps request status labels", () => {
    expect(requestStatusLabel(RequestStatus.Submitted)).toBe("Submitted");
    expect(requestStatusLabel(RequestStatus.Unavailable)).toBe("Unavailable");
  });
});
