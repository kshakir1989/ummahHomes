import { buildSeedData } from "../../data/seed";
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

let state: DemoState = createInitialState();

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

export function getDemoState(): DemoState {
  return state;
}

export function resetDemoData(): void {
  state = createInitialState();
}

export function setDemoState(next: DemoState): void {
  state = next;
}

export function updateDemoState(mutator: (draft: DemoState) => void): void {
  const draft = structuredClone(state);
  mutator(draft);
  state = draft;
}
