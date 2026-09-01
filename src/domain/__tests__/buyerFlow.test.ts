import { beforeEach, describe, expect, it } from "@jest/globals";
import { operations } from "../operations";
import { ListingStatus, RequestKind, RequestStatus } from "../types";
import { getDemoState, resetDemoData } from "../../store/demoStore";
import { signOut } from "../../store/session";
import { canSeekerSendMessage } from "../messageRules";

describe("buyer flow", () => {
  beforeEach(() => {
    resetDemoData();
    signOut();
  });

  it("lists sale and booked homes in buyer catalog", () => {
    const sale = getDemoState().listings.find((l) => l.type === "home_sale")!;
    operations.signIn(sale.ownerId);
    operations.markListingBooked(sale.id);
    signOut();

    operations.signIn("user-7");
    const catalog = operations.listBuyerCatalog({});
    expect(catalog.some((l) => l.id === sale.id)).toBe(true);
    expect(catalog.every((l) => l.type === "home_sale")).toBe(true);
  });

  it("stores the buyer interest note in the conversation thread", () => {
    operations.signIn("user-7");
    const sale = getDemoState().listings.find(
      (l) => l.type === "home_sale" && l.status === ListingStatus.Published,
    )!;
    const request = operations.createRequest(sale.id, {
      initialMessage: "We are interested in a tour.",
    });
    const thread = operations.getThreadForRequest(request.id)!;
    const messages = operations.listMessages(thread.id);
    expect(messages).toHaveLength(1);
    expect(messages[0]?.body).toBe("We are interested in a tour.");
    expect(messages[0]?.senderId).toBe("user-7");
  });

  it("blocks buyer messaging until seller responds", () => {
    operations.signIn("user-7");
    const sale = getDemoState().listings.find(
      (l) => l.type === "home_sale" && l.status === ListingStatus.Published,
    )!;
    const request = operations.createRequest(sale.id);
    expect(request.kind).toBe(RequestKind.Interest);
    const thread = operations.getThreadForRequest(request.id)!;

    expect(() => operations.sendMessage(thread.id, "Hello seller")).toThrow(
      "SELLER_RESPONSE_REQUIRED",
    );

    signOut();
    operations.signIn(sale.ownerId);
    operations.sendMessage(thread.id, "Thanks for your interest");

    signOut();
    operations.signIn("user-7");
    expect(() => operations.sendMessage(thread.id, "Thank you")).not.toThrow();
  });

  it("prevents duplicate open interests", () => {
    operations.signIn("user-7");
    const sale = getDemoState().listings.find((l) => l.type === "home_sale")!;
    operations.createRequest(sale.id);
    expect(() => operations.createRequest(sale.id)).toThrow("INTEREST_EXISTS");
  });
});

describe("messageRules", () => {
  it("requires seller response before buyer can send on interest", () => {
    const listing = getDemoState().listings.find((l) => l.type === "home_sale")!;
    const request = {
      id: "request-1",
      listingId: listing.id,
      seekerId: "user-7",
      kind: RequestKind.Interest,
      status: RequestStatus.Submitted,
      backgroundCheckRequired: false,
      backgroundCheckStatus: null,
      createdAt: "",
      updatedAt: "",
    };
    expect(
      canSeekerSendMessage("user-7", request, listing, []),
    ).toBe(false);
    expect(
      canSeekerSendMessage("user-7", request, listing, [
        {
          id: "m1",
          threadId: "t1",
          senderId: listing.ownerId,
          body: "Hi",
          createdAt: "",
        },
      ]),
    ).toBe(true);
  });
});
