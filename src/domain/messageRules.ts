import {
  RequestKind,
  type ApplicationInterest,
  type Listing,
  type Message,
} from "./types";
import { isBackgroundCheckBlocking } from "./requestRules";

export function sellerHasResponded(
  messages: Message[],
  sellerId: string,
): boolean {
  return messages.some((message) => message.senderId === sellerId);
}

export function canSeekerSendMessage(
  seekerId: string,
  request: ApplicationInterest,
  listing: Listing,
  messages: Message[],
): boolean {
  if (request.seekerId !== seekerId) {
    return false;
  }

  if (request.kind === RequestKind.Interest) {
    return sellerHasResponded(messages, listing.ownerId);
  }

  return !isBackgroundCheckBlocking(listing, request);
}
