import {
  BgStubStatus,
  ListingStatus,
  RequestStatus,
  type ApplicationInterest,
  type Listing,
} from "./types";

const OPEN_STATUSES: RequestStatus[] = [
  RequestStatus.Submitted,
  RequestStatus.Accepted,
];

export function canCreateRequest(listing: Listing): boolean {
  return listing.status === ListingStatus.Published;
}

export function acceptRequest(request: ApplicationInterest): ApplicationInterest {
  return {
    ...request,
    status: RequestStatus.Accepted,
    updatedAt: new Date().toISOString(),
  };
}

export function denyRequest(request: ApplicationInterest): ApplicationInterest {
  return {
    ...request,
    status: RequestStatus.Denied,
    updatedAt: new Date().toISOString(),
  };
}

export function withdrawRequest(
  request: ApplicationInterest,
): ApplicationInterest {
  return {
    ...request,
    status: RequestStatus.Withdrawn,
    updatedAt: new Date().toISOString(),
  };
}

export function markRequestsUnavailableForListing(
  requests: ApplicationInterest[],
): ApplicationInterest[] {
  const now = new Date().toISOString();
  return requests.map((request) =>
    OPEN_STATUSES.includes(request.status)
      ? { ...request, status: RequestStatus.Unavailable, updatedAt: now }
      : request,
  );
}

export function isBackgroundCheckBlocking(
  listing: Listing,
  request: ApplicationInterest,
): boolean {
  if (!listing.requiresBackgroundCheck) {
    return false;
  }
  const status = request.backgroundCheckStatus;
  return status !== BgStubStatus.Passed;
}
