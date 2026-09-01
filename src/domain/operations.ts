import {
  completeListingFeeStub,
  markListingBooked,
  publishListing,
  resolveListingSale,
  syncListingHeroImage,
  unpublishListing,
} from "./listingRules";
import {
  acceptRequest,
  canCreateRequest,
  denyRequest,
  withdrawRequest,
} from "./requestRules";
import {
  BgStubStatus,
  ListingStatus,
  RequestKind,
  RequestStatus,
  isRentListing,
  isSaleListing,
  requestKindForListingType,
  type ApplicationInterest,
  type Listing,
  type ListingType,
  type User,
} from "./types";
import { getDemoState, resetDemoData, updateDemoState } from "../store/demoStore";
import { getSession, hasRole, requireSession, signIn, signOut } from "../store/session";
import {
  listingAmenities,
  listingImageGallery,
  listingImageUrl,
  listingLocation,
} from "../../data/listing-catalog";
import { parseAtlantaMetroLocation } from "../../data/atlanta-metro";
import type { BrowseFilterCriteria } from "./browseFilters";
import { filterBrowseCatalog } from "./catalogBrowse";
import { canSeekerSendMessage } from "./messageRules";

export type DomainErrorCode =
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "FEE_REQUIRED"
  | "VALIDATION"
  | "NOT_PUBLISHED"
  | "LISTING_BOOKED"
  | "BG_REQUIRED"
  | "SELLER_RESPONSE_REQUIRED"
  | "INTEREST_EXISTS";

export class DomainError extends Error {
  constructor(public code: DomainErrorCode) {
    super(code);
  }
}

function findListing(id: string): Listing | undefined {
  return getDemoState().listings.find((l) => l.id === id);
}

function findRequest(id: string): ApplicationInterest | undefined {
  return getDemoState().requests.find((r) => r.id === id);
}

function assertOwnerOrAdmin(listing: Listing, user: User): void {
  if (listing.ownerId !== user.id && !hasRole(user, "admin")) {
    throw new DomainError("FORBIDDEN");
  }
}

let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export const operations = {
  signIn,
  signOut,
  requireSession,

  createListing(input: {
    type: ListingType;
    title?: string;
    description?: string;
    locationText?: string;
    price?: number;
    requiresBackgroundCheck?: boolean;
  }): Listing {
    const session = requireSession();
    if (!hasRole(session, "seller")) {
      throw new DomainError("FORBIDDEN");
    }
    const now = new Date().toISOString();
    const seedIndex = getDemoState().listings.length;
    const resolved =
      (input.locationText && parseAtlantaMetroLocation(input.locationText)) ||
      listingLocation(seedIndex);
    const gallery = listingImageGallery(seedIndex);
    const listing: Listing = {
      id: nextId("listing"),
      ownerId: session.id,
      type: input.type,
      title: input.title ?? "",
      description: input.description ?? "",
      locationText: input.locationText ?? resolved.locationText,
      city: resolved.city,
      state: resolved.state,
      zipCode: resolved.zipCode,
      price: input.price ?? 0,
      currency: "USD",
      status: ListingStatus.Draft,
      imageUrl: gallery[0],
      imageUrls: gallery,
      amenities: listingAmenities(seedIndex),
      requiresBackgroundCheck: input.requiresBackgroundCheck ?? false,
      listingFeeCompleted: input.type !== "home_sale",
      createdAt: now,
      updatedAt: now,
    };
    updateDemoState((draft) => {
      draft.listings.push(listing);
    });
    return listing;
  },

  updateListing(id: string, patch: Partial<Listing>): Listing {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing) {
      throw new DomainError("VALIDATION");
    }
    assertOwnerOrAdmin(listing, session);
    const patchWithLocation = { ...patch };
    if (patch.locationText) {
      const resolved = parseAtlantaMetroLocation(patch.locationText);
      if (resolved) {
        patchWithLocation.city = resolved.city;
        patchWithLocation.state = resolved.state;
        patchWithLocation.zipCode = resolved.zipCode;
        patchWithLocation.locationText = resolved.locationText;
      }
    }
    const updated = syncListingHeroImage({
      ...listing,
      ...patchWithLocation,
      updatedAt: new Date().toISOString(),
    });
    updateDemoState((draft) => {
      const index = draft.listings.findIndex((l) => l.id === id);
      draft.listings[index] = updated;
    });
    return updated;
  },

  completeListingFeeStub(id: string): Listing {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing || listing.ownerId !== session.id || listing.type !== "home_sale") {
      throw new DomainError("FORBIDDEN");
    }
    const updated = completeListingFeeStub(listing);
    updateDemoState((draft) => {
      const index = draft.listings.findIndex((l) => l.id === id);
      draft.listings[index] = updated;
    });
    return updated;
  },

  publishListing(id: string): Listing {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing || listing.ownerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    try {
      const updated = publishListing(listing);
      updateDemoState((draft) => {
        const index = draft.listings.findIndex((l) => l.id === id);
        draft.listings[index] = updated;
      });
      return updated;
    } catch (error) {
      if (error instanceof Error && error.message === "FEE_REQUIRED") {
        throw new DomainError("FEE_REQUIRED");
      }
      throw new DomainError("VALIDATION");
    }
  },

  unpublishListing(id: string): Listing {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing) {
      throw new DomainError("VALIDATION");
    }
    assertOwnerOrAdmin(listing, session);
    const updated = unpublishListing(listing);
    updateDemoState((draft) => {
      const index = draft.listings.findIndex((l) => l.id === id);
      draft.listings[index] = updated;
    });
    return updated;
  },

  markListingBooked(id: string): Listing {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing) {
      throw new DomainError("VALIDATION");
    }
    assertOwnerOrAdmin(listing, session);
    const updated = markListingBooked(listing);
    const now = new Date().toISOString();
    updateDemoState((draft) => {
      const index = draft.listings.findIndex((l) => l.id === id);
      draft.listings[index] = updated;
      draft.requests = draft.requests.map((request) =>
        request.listingId === id &&
        (request.status === RequestStatus.Submitted ||
          request.status === RequestStatus.Accepted)
          ? { ...request, status: RequestStatus.Unavailable, updatedAt: now }
          : request,
      );
    });
    return updated;
  },

  resolveListingSale(id: string): Listing {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing) {
      throw new DomainError("VALIDATION");
    }
    assertOwnerOrAdmin(listing, session);
    try {
      const updated = resolveListingSale(listing);
      updateDemoState((draft) => {
        const index = draft.listings.findIndex((l) => l.id === id);
        draft.listings[index] = updated;
      });
      return updated;
    } catch {
      throw new DomainError("VALIDATION");
    }
  },

  setListingBackgroundCheck(listingId: string, required: boolean): Listing {
    const session = requireSession();
    const listing = findListing(listingId);
    if (!listing || listing.ownerId !== session.id || !isRentListing(listing.type)) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = {
      ...listing,
      requiresBackgroundCheck: required,
      updatedAt: new Date().toISOString(),
    };
    updateDemoState((draft) => {
      const index = draft.listings.findIndex((l) => l.id === listingId);
      draft.listings[index] = updated;
    });
    return updated;
  },

  requireBackgroundCheckForApplications(
    listingId: string,
    scope: { mode: "all" } | { mode: "selected"; requestIds: string[] },
  ): ApplicationInterest[] {
    const session = requireSession();
    const listing = findListing(listingId);
    if (!listing || listing.ownerId !== session.id || !isRentListing(listing.type)) {
      throw new DomainError("FORBIDDEN");
    }
    const openStatuses = [RequestStatus.Submitted, RequestStatus.Accepted];
    const now = new Date().toISOString();
    const updated: ApplicationInterest[] = [];
    updateDemoState((draft) => {
      draft.listings = draft.listings.map((item) =>
        item.id === listingId
          ? {
              ...item,
              requiresBackgroundCheck: true,
              updatedAt: now,
            }
          : item,
      );
      draft.requests = draft.requests.map((request) => {
        if (request.listingId !== listingId || request.kind !== RequestKind.Apply) {
          return request;
        }
        const eligible =
          scope.mode === "all"
            ? openStatuses.includes(request.status)
            : scope.requestIds.includes(request.id);
        if (!eligible) {
          return request;
        }
        const next = {
          ...request,
          backgroundCheckRequired: true,
          updatedAt: now,
        };
        updated.push(next);
        return next;
      });
    });
    return updated;
  },

  listPublished(filters?: BrowseFilterCriteria): Listing[] {
    const session = getSession();
    return filterBrowseCatalog(getDemoState().listings, filters ?? {}, session);
  },

  listBuyerCatalog(filters?: BrowseFilterCriteria): Listing[] {
    const session = requireSession();
    if (!hasRole(session, "buyer")) {
      throw new DomainError("FORBIDDEN");
    }
    return filterBrowseCatalog(getDemoState().listings, {
      ...(filters ?? {}),
      types: ["home_sale"],
    }, session);
  },

  listMyApplications(): ApplicationInterest[] {
    const session = requireSession();
    if (!hasRole(session, "renter")) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState()
      .requests.filter(
        (r) => r.seekerId === session.id && r.kind === RequestKind.Apply,
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  getMyApplicationForListing(listingId: string): ApplicationInterest | null {
    const session = getSession();
    if (!session) {
      return null;
    }
    return (
      getDemoState().requests.find(
        (r) =>
          r.listingId === listingId &&
          r.seekerId === session.id &&
          r.kind === RequestKind.Apply &&
          r.status !== RequestStatus.Withdrawn,
      ) ?? null
    );
  },

  listMyInterests(): ApplicationInterest[] {
    const session = requireSession();
    if (!hasRole(session, "buyer")) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState()
      .requests.filter(
        (r) => r.seekerId === session.id && r.kind === RequestKind.Interest,
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  getMyInterestForListing(listingId: string): ApplicationInterest | null {
    const session = getSession();
    if (!session) {
      return null;
    }
    return (
      getDemoState().requests.find(
        (r) =>
          r.listingId === listingId &&
          r.seekerId === session.id &&
          r.kind === RequestKind.Interest &&
          r.status !== RequestStatus.Withdrawn,
      ) ?? null
    );
  },

  getThreadForRequest(requestId: string) {
    return getDemoState().threads.find(
      (t) => t.applicationInterestId === requestId,
    );
  },

  listMyThreads() {
    const session = requireSession();
    const state = getDemoState();
    return state.threads
      .filter((thread) => thread.participantIds.includes(session.id))
      .map((thread) => {
        const request = state.requests.find(
          (r) => r.id === thread.applicationInterestId,
        );
        const listing = request
          ? state.listings.find((l) => l.id === request.listingId)
          : undefined;
        const messages = state.messages
          .filter((m) => m.threadId === thread.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        return {
          thread,
          request,
          listing,
          lastMessage: messages[0] ?? null,
        };
      })
      .filter((entry) => entry.request && entry.listing)
      .sort((a, b) =>
        (b.lastMessage?.createdAt ?? b.request!.updatedAt).localeCompare(
          a.lastMessage?.createdAt ?? a.request!.updatedAt,
        ),
      );
  },

  listMyListings(): Listing[] {
    const session = requireSession();
    if (!hasRole(session, "seller")) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState()
      .listings.filter((l) => l.ownerId === session.id)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  deleteListing(id: string): void {
    const session = requireSession();
    const listing = findListing(id);
    if (!listing || listing.ownerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const requestIds = new Set(
      getDemoState()
        .requests.filter((r) => r.listingId === id)
        .map((r) => r.id),
    );
    const threadIds = new Set(
      getDemoState()
        .threads.filter((t) => requestIds.has(t.applicationInterestId))
        .map((t) => t.id),
    );
    updateDemoState((draft) => {
      draft.listings = draft.listings.filter((l) => l.id !== id);
      draft.requests = draft.requests.filter((r) => r.listingId !== id);
      draft.threads = draft.threads.filter(
        (t) => !requestIds.has(t.applicationInterestId),
      );
      draft.messages = draft.messages.filter((m) => !threadIds.has(m.threadId));
    });
  },

  getListing(id: string): Listing {
    const listing = findListing(id);
    if (!listing) {
      throw new DomainError("VALIDATION");
    }
    const session = getSession();
    if (
      listing.status !== ListingStatus.Published &&
      listing.status !== ListingStatus.Booked &&
      listing.status !== ListingStatus.Resolved &&
      (!session ||
        (listing.ownerId !== session.id && !hasRole(session, "admin")))
    ) {
      throw new DomainError("NOT_PUBLISHED");
    }
    return listing;
  },

  createRequest(
    listingId: string,
    options?: { initialMessage?: string },
  ): ApplicationInterest {
    const session = requireSession();
    const listing = findListing(listingId);
    if (!listing || !canCreateRequest(listing)) {
      throw new DomainError(listing?.status === ListingStatus.Booked ? "LISTING_BOOKED" : "NOT_PUBLISHED");
    }
    if (listing.ownerId === session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const kind = requestKindForListingType(listing.type);
    if (kind === RequestKind.Apply && !hasRole(session, "renter")) {
      throw new DomainError("FORBIDDEN");
    }
    if (kind === RequestKind.Interest && !hasRole(session, "buyer")) {
      throw new DomainError("FORBIDDEN");
    }
    const existing = getDemoState().requests.find(
      (r) =>
        r.listingId === listingId &&
        r.seekerId === session.id &&
        r.kind === kind &&
        r.status !== RequestStatus.Withdrawn &&
        r.status !== RequestStatus.Denied,
    );
    if (existing) {
      throw new DomainError("INTEREST_EXISTS");
    }
    const now = new Date().toISOString();
    const request: ApplicationInterest = {
      id: nextId("request"),
      listingId,
      seekerId: session.id,
      kind,
      status: RequestStatus.Submitted,
      backgroundCheckRequired:
        kind === RequestKind.Apply && listing.requiresBackgroundCheck,
      backgroundCheckStatus: null,
      createdAt: now,
      updatedAt: now,
    };
    const thread = {
      id: nextId("thread"),
      applicationInterestId: request.id,
      participantIds: [listing.ownerId, session.id],
    };
    const trimmedNote = options?.initialMessage?.trim() ?? "";
    const initialMessage =
      kind === RequestKind.Interest && trimmedNote
        ? {
            id: nextId("message"),
            threadId: thread.id,
            senderId: session.id,
            body: trimmedNote,
            createdAt: now,
          }
        : null;
    updateDemoState((draft) => {
      draft.requests.push(request);
      draft.threads.push(thread);
      if (initialMessage) {
        draft.messages.push(initialMessage);
      }
    });
    return request;
  },

  acceptRequest(id: string): ApplicationInterest {
    const session = requireSession();
    const request = findRequest(id);
    const listing = request ? findListing(request.listingId) : undefined;
    if (!request || !listing || listing.ownerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = acceptRequest(request);
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === id);
      draft.requests[index] = updated;
    });
    return updated;
  },

  denyRequest(id: string): ApplicationInterest {
    const session = requireSession();
    const request = findRequest(id);
    const listing = request ? findListing(request.listingId) : undefined;
    if (!request || !listing || listing.ownerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = denyRequest(request);
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === id);
      draft.requests[index] = updated;
    });
    return updated;
  },

  withdrawRequest(id: string): ApplicationInterest {
    const session = requireSession();
    const request = findRequest(id);
    if (!request || request.seekerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = withdrawRequest(request);
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === id);
      draft.requests[index] = updated;
    });
    return updated;
  },

  startBackgroundCheckStub(requestId: string): ApplicationInterest {
    const session = requireSession();
    const request = findRequest(requestId);
    const listing = request ? findListing(request.listingId) : undefined;
    if (!request || !listing || request.seekerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = {
      ...request,
      backgroundCheckStatus: BgStubStatus.Pending,
      updatedAt: new Date().toISOString(),
    };
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === requestId);
      draft.requests[index] = updated;
    });
    return updated;
  },

  completeBackgroundCheckStub(
    requestId: string,
    result: "passed" | "failed",
  ): ApplicationInterest {
    const session = requireSession();
    const request = findRequest(requestId);
    if (!request || request.seekerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = {
      ...request,
      backgroundCheckStatus:
        result === "passed" ? BgStubStatus.Passed : BgStubStatus.Failed,
      updatedAt: new Date().toISOString(),
    };
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === requestId);
      draft.requests[index] = updated;
    });
    return updated;
  },

  declineBackgroundCheckStub(requestId: string): ApplicationInterest {
    const session = requireSession();
    const request = findRequest(requestId);
    if (!request || request.seekerId !== session.id) {
      throw new DomainError("FORBIDDEN");
    }
    const updated = {
      ...request,
      backgroundCheckStatus: BgStubStatus.Declined,
      updatedAt: new Date().toISOString(),
    };
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === requestId);
      draft.requests[index] = updated;
    });
    return updated;
  },

  sendMessage(threadId: string, body: string) {
    const session = requireSession();
    const thread = getDemoState().threads.find((t) => t.id === threadId);
    if (!thread || !thread.participantIds.includes(session.id)) {
      throw new DomainError("FORBIDDEN");
    }
    const request = findRequest(thread.applicationInterestId);
    const listing = request ? findListing(request.listingId) : undefined;
    const existingMessages = getDemoState().messages.filter(
      (m) => m.threadId === threadId,
    );
    if (request && listing && session.id === request.seekerId) {
      if (!canSeekerSendMessage(session.id, request, listing, existingMessages)) {
        if (request.kind === RequestKind.Interest) {
          throw new DomainError("SELLER_RESPONSE_REQUIRED");
        }
        throw new DomainError("BG_REQUIRED");
      }
    }
    const message = {
      id: nextId("message"),
      threadId,
      senderId: session.id,
      body,
      createdAt: new Date().toISOString(),
    };
    updateDemoState((draft) => {
      draft.messages.push(message);
    });
    return message;
  },

  listMessages(threadId: string) {
    const session = requireSession();
    const thread = getDemoState().threads.find((t) => t.id === threadId);
    if (!thread || !thread.participantIds.includes(session.id)) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState()
      .messages.filter((m) => m.threadId === threadId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  listUsers(): User[] {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState().users;
  },

  listAllListings(): Listing[] {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState().listings;
  },

  suspendUser(id: string) {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    updateDemoState((draft) => {
      const user = draft.users.find((u) => u.id === id);
      if (user) {
        user.status = "suspended";
      }
      draft.adminActions.push({
        id: nextId("action"),
        actorId: session.id,
        targetType: "user",
        targetId: id,
        action: "suspend_user",
        createdAt: new Date().toISOString(),
      });
    });
  },

  adminUnpublishListing(id: string): Listing {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    const listing = operations.unpublishListing(id);
    updateDemoState((draft) => {
      draft.adminActions.push({
        id: nextId("action"),
        actorId: session.id,
        targetType: "listing",
        targetId: id,
        action: "unpublish_listing",
        createdAt: new Date().toISOString(),
      });
    });
    return listing;
  },

  listAllRequests(): ApplicationInterest[] {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    return getDemoState().requests.sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  },

  adminAcceptRequest(id: string): ApplicationInterest {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    const request = findRequest(id);
    if (!request) {
      throw new DomainError("VALIDATION");
    }
    const updated = acceptRequest(request);
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === id);
      draft.requests[index] = updated;
      draft.adminActions.push({
        id: nextId("action"),
        actorId: session.id,
        targetType: "user",
        targetId: request.seekerId,
        action: "accept_request",
        createdAt: new Date().toISOString(),
      });
    });
    return updated;
  },

  adminDenyRequest(id: string): ApplicationInterest {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    const request = findRequest(id);
    if (!request) {
      throw new DomainError("VALIDATION");
    }
    const updated = denyRequest(request);
    updateDemoState((draft) => {
      const index = draft.requests.findIndex((r) => r.id === id);
      draft.requests[index] = updated;
      draft.adminActions.push({
        id: nextId("action"),
        actorId: session.id,
        targetType: "user",
        targetId: request.seekerId,
        action: "deny_request",
        createdAt: new Date().toISOString(),
      });
    });
    return updated;
  },

  adminResolveListingSale(id: string): Listing {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    const listing = operations.resolveListingSale(id);
    updateDemoState((draft) => {
      draft.adminActions.push({
        id: nextId("action"),
        actorId: session.id,
        targetType: "listing",
        targetId: id,
        action: "resolve_sale",
        createdAt: new Date().toISOString(),
      });
    });
    return listing;
  },

  adminMarkBooked(id: string): Listing {
    const session = requireSession();
    if (!hasRole(session, "admin")) {
      throw new DomainError("FORBIDDEN");
    }
    const listing = operations.markListingBooked(id);
    updateDemoState((draft) => {
      draft.adminActions.push({
        id: nextId("action"),
        actorId: session.id,
        targetType: "listing",
        targetId: id,
        action: "mark_booked",
        createdAt: new Date().toISOString(),
      });
    });
    return listing;
  },

  resetDemoData,
};

export function seekerRoleMatchesListing(
  user: User,
  listing: Listing,
): boolean {
  if (isSaleListing(listing.type)) {
    return hasRole(user, "buyer");
  }
  if (isRentListing(listing.type)) {
    return hasRole(user, "renter");
  }
  return false;
}
