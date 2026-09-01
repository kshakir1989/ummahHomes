# Domain Operations Contract: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Audience**: In-app demo store / services (no public HTTP API required in stage 1)  
**Style**: Operation name → preconditions → effects

## Auth

| Operation | Preconditions | Effects |
|-----------|---------------|---------|
| `signIn(accountId)` | Account exists and not suspended | Session user set; roles available |
| `signOut()` | Any | Session cleared |
| `requireSession()` | Used by gated ops | Fail with `AUTH_REQUIRED` if no session |

## Listings

| Operation | Preconditions | Effects |
|-----------|---------------|---------|
| `createListing(input)` | Session has `seller` | Listing `draft`; owner = session |
| `updateListing(id, patch)` | Owner or Admin | Fields updated; `updatedAt` |
| `completeListingFeeStub(id)` | Owner; type `home_sale` | `listingFeeCompleted = true` |
| `publishListing(id)` | Owner; required fields; if sale then fee completed | `status = published` |
| `unpublishListing(id)` | Owner or Admin; was published | Leaves open catalog (`draft` or equivalent unpublished) |
| `markListingBooked(id)` | Owner **or** Admin; not already booked | `status = booked`; remaining open requests → `unavailable` |
| `listPublished(filters?)` | None | Returns published only |
| `getListing(id)` | None for published; owner/admin may see own drafts | Detail |

## Applications / interest

| Operation | Preconditions | Effects |
|-----------|---------------|---------|
| `createRequest(listingId)` | Session; listing published; not booked; seeker role matches type | `apply` or `interest` by listing type; `submitted`; create thread |
| `acceptRequest(id)` | Listing owner | Request `accepted`; **does not** book listing; **does not** deny others |
| `denyRequest(id)` | Listing owner | Request `denied` |
| `withdrawRequest(id)` | Seeker owner of request | Request `withdrawn` |
| `startBackgroundCheckStub(id)` | Seeker; listing requires BG | Stub `pending` |
| `completeBackgroundCheckStub(id, result)` | Seeker; stub started | `passed` / `failed` |
| `declineBackgroundCheckStub(id)` | Seeker | `declined`; request cannot complete until waived/completed |

## Messaging

| Operation | Preconditions | Effects |
|-----------|---------------|---------|
| `sendMessage(threadId, body)` | Session is participant | Message appended; readable by other participant |
| `listMessages(threadId)` | Session is participant | Ordered messages |

## Admin

| Operation | Preconditions | Effects |
|-----------|---------------|---------|
| `listUsers()` | Admin | All seed + mutable users |
| `listAllListings()` | Admin | All statuses |
| `suspendUser(id)` | Admin | User `suspended`; record AdminAction |
| `adminUnpublishListing(id)` | Admin | Unpublish + AdminAction |
| `adminMarkBooked(id)` | Admin | Same effects as `markListingBooked` + AdminAction |

## Demo data

| Operation | Preconditions | Effects |
|-----------|---------------|---------|
| `resetDemoData()` | Prefer Admin or local-only control | Restore 100 listings / 10 users / 1 admin; clear overlay |

## Error codes (demo)

| Code | When |
|------|------|
| `AUTH_REQUIRED` | Gated action without session |
| `FORBIDDEN` | Wrong role / not owner |
| `FEE_REQUIRED` | Sale first publish without fee stub |
| `VALIDATION` | Missing required listing fields |
| `NOT_PUBLISHED` | Request on non-published listing |
| `LISTING_BOOKED` | Request or apply on booked listing |
| `BG_REQUIRED` | Complete request blocked while BG declined/incomplete |
