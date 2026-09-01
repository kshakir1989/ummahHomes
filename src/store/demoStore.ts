import { buildSeedData } from "../../data/seed";
import { listingImageGallery } from "../../data/listing-catalog";
import type {
  AdminAction,
  ApplicationInterest,
  Listing,
  Message,
  MessageThread,
  User,
} from "../domain/types";

export interface DemoState {
  users: User[];
  listings: Listing[];
  requests: ApplicationInterest[];
  threads: MessageThread[];
  messages: Message[];
  adminActions: AdminAction[];
}

const STATE_KEY = "ummahHomes.demoState.v5";

let state: DemoState = loadState();

function createInitialState(): DemoState {
  const seed = buildSeedData();
  return {
    users: structuredClone(seed.users),
    listings: structuredClone(seed.listings),
    requests: [],
    threads: [],
    messages: [],
    adminActions: [],
  };
}

function normalizeState(raw: DemoState): DemoState {
  return {
    ...raw,
    listings: raw.listings.map((listing, index) => ({
      ...listing,
      imageUrls:
        listing.imageUrls?.length > 0
          ? listing.imageUrls
          : listing.imageUrl
            ? [listing.imageUrl, ...listingImageGallery(index).slice(1)]
            : listingImageGallery(index),
      imageUrl:
        listing.imageUrl ||
        listing.imageUrls?.[0] ||
        listingImageGallery(index)[0],
    })),
    requests: raw.requests.map((request) => ({
      ...request,
      backgroundCheckRequired: request.backgroundCheckRequired ?? false,
    })),
  };
}

function loadState(): DemoState {
  if (typeof globalThis.sessionStorage !== "undefined") {
    const raw = globalThis.sessionStorage.getItem(STATE_KEY);
    if (raw) {
      try {
        return normalizeState(JSON.parse(raw) as DemoState);
      } catch {
        // fall through to fresh seed
      }
    }
  }
  return createInitialState();
}

function persistState(): void {
  if (typeof globalThis.sessionStorage !== "undefined") {
    globalThis.sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  }
}

export function getDemoState(): DemoState {
  return state;
}

export function resetDemoData(): void {
  state = createInitialState();
  persistState();
}

export function setDemoState(next: DemoState): void {
  state = next;
  persistState();
}

export function updateDemoState(mutator: (draft: DemoState) => void): void {
  const draft = structuredClone(state);
  mutator(draft);
  state = draft;
  persistState();
}
