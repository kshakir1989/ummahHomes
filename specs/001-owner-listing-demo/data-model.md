# Data Model: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Storage**: Bundled JSON seed under `data/` + local mutable demo store (see `research.md`)

## Entities

### User

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Stable unique id |
| `displayName` | string | yes | Shown in Admin and messaging |
| `email` | string | yes | Demo sign-in identifier |
| `roles` | `Role[]` | yes | One or more of `seller`, `buyer`, `renter`, `admin` |
| `householdType` | `"single"` \| `"couple"` \| `"family"` \| `"group"` | yes | Demo diversity (SC-003) |
| `financialBackground` | string | yes | Short demo label (e.g. student, dual-income) — not credit data |
| `status` | `"active"` \| `"suspended"` | yes | Admin may suspend |

Exactly **one** user with `admin` in roles in the seed. At least **10** non-admin users spanning household types and varied `financialBackground`.

### Listing

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Stable unique id |
| `ownerId` | string | yes | → User (Seller) |
| `type` | `ListingType` | yes | See enum |
| `title` | string | yes | Required to publish |
| `description` | string | yes | Required to publish |
| `locationText` | string | yes | Free-text U.S. location for demo |
| `price` | number | yes | Sale price or monthly rent USD |
| `currency` | `"USD"` | yes | Always USD stage 1 |
| `status` | `ListingStatus` | yes | `draft` \| `published` \| `booked` |
| `requiresBackgroundCheck` | boolean | yes | Seller-controlled |
| `listingFeeCompleted` | boolean | yes | Sale only; must be true before first publish |
| `createdAt` | string (ISO) | yes | |
| `updatedAt` | string (ISO) | yes | |

**ListingType**: `home_sale` \| `home_rent` \| `room_rent` \| `basement_rent`  
**ListingStatus**: `draft` \| `published` \| `booked`

Seed MUST include ≥ **100** listings spanning all four types. Open catalog = `status === published` only.

### ApplicationInterest

Seeker request against a listing. UI label: **Apply** when listing is rent; **Express interest** when listing is sale.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | |
| `listingId` | string | yes | → Listing |
| `seekerId` | string | yes | → User (Buyer or Renter) |
| `kind` | `"apply"` \| `"interest"` | yes | Derived from listing type at create time |
| `status` | `RequestStatus` | yes | See transitions |
| `backgroundCheckStatus` | `BgStubStatus` \| null | no | Null if not required / not started |
| `createdAt` | string (ISO) | yes | |
| `updatedAt` | string (ISO) | yes | |

**RequestStatus**: `submitted` \| `accepted` \| `denied` \| `withdrawn` \| `unavailable`  
**BgStubStatus**: `pending` \| `passed` \| `failed` \| `declined`

Multiple `submitted` / `accepted` requests MAY exist on one listing until the listing is `booked`. Accepting one MUST NOT auto-deny others.

### MessageThread

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | |
| `applicationInterestId` | string | yes | → ApplicationInterest |
| `participantIds` | string[] | yes | Seller owner + seeker |

### Message

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | |
| `threadId` | string | yes | → MessageThread |
| `senderId` | string | yes | → User |
| `body` | string | yes | Plain text demo depth |
| `createdAt` | string (ISO) | yes | |

### ListingFeeStub

Logical step on sale listings (may be fields on Listing rather than separate rows).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `listingId` | string | yes | Sale listing only |
| `amountLabel` | string | yes | Placeholder e.g. `"$X (stub)"` |
| `completed` | boolean | yes | Maps to `listingFeeCompleted` |
| `completedAt` | string (ISO) \| null | no | |

### BackgroundCheckStub

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `applicationInterestId` | string | yes | |
| `status` | `BgStubStatus` | yes | Seeker-driven stub flow |
| `visibleToSeller` | boolean | yes | Result visibility at stub fidelity |

### AdminAction

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | |
| `actorId` | string | yes | Admin user |
| `targetType` | `"user"` \| `"listing"` | yes | |
| `targetId` | string | yes | |
| `action` | string | yes | e.g. `suspend_user`, `unpublish_listing`, `mark_booked` |
| `createdAt` | string (ISO) | yes | |

## Relationships

- User 1—* Listing (`ownerId`)
- Listing 1—* ApplicationInterest
- User 1—* ApplicationInterest (`seekerId`)
- ApplicationInterest 1—1 MessageThread
- MessageThread 1—* Message
- Listing 0—1 ListingFeeStub (sale only)
- ApplicationInterest 0—1 BackgroundCheckStub

## State transitions

### Listing

```text
draft --[publish; sale requires listingFeeCompleted]--> published
published --[unpublish / Admin moderate]--> draft   (or remain unpublished from catalog)
published --[Seller or Admin mark booked]--> booked
booked --> (terminal for open catalog; no Apply / Express interest)
```

### ApplicationInterest

```text
(create) --> submitted
submitted --[Seller accept]--> accepted
submitted --[Seller deny]--> denied
submitted|accepted --[seeker withdraw]--> withdrawn
* --[listing marked booked]--> unavailable   (remaining open requests)
```

Accepting one request does **not** transition the listing to `booked`.

### Background check stub

When `requiresBackgroundCheck` on listing:

```text
null/not started --[seeker starts stub]--> pending
pending --[stub complete]--> passed | failed
* --[seeker declines]--> declined  (blocks complete apply/interest until waived or completed)
```

## Validation rules (publish / actions)

- Cannot publish listing without required fields: type, title, description, locationText, price.
- Sale listing: cannot first-publish unless `listingFeeCompleted === true`.
- Cannot Apply / Express interest / message unless signed in.
- Cannot Apply on sale or Express interest on rent (`kind` must match listing type).
- Cannot create request on `booked` or non-`published` listing.
- Browse catalog: only `published` listings (no auth).

## Seed restore

A single **reset demo data** operation restores the canonical 100 / 10 / 1 dataset and clears mutable overlay state.
