# UI Behavior Contract: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Audience**: Web (primary) + iOS/Android demo builds  
**Visual contract**: [ui-design.md](./ui-design.md) (Figma frames + node URLs — implement UI against **both** contracts)  
**Non-goals**: Real payments, real BG vendor, push/email, MLS, store publish

## Surfaces

| Surface | Stage-1 depth |
|---------|----------------|
| Web | Full: entry, browse, auth, Seller, Buyer/Renter, Admin |
| iOS / Android | Core: browse, auth, create/edit listing, Apply / Express interest, messaging |

## Screens / flows

### Company / product entry (web)

| Element | Contract |
|---------|----------|
| Brand | Product name centered in hero header; scales on narrow viewports |
| Nav | View Homes, Sign In, Sign Up stacked top-right; equal button width; label text centered |
| Purpose | One short sentence: owner-listed U.S. homes, rooms, basements |
| CTAs | Reach **Browse** and **Sign in** within three obvious steps (SC-005) |

### Browse (public)

| Element | Contract |
|---------|----------|
| Auth | No sign-in required to view published listings |
| Catalog | Published listings; booked **sale** listings show with badge until resolved; resolved/draft hidden |
| Types | One grid with type filter chips (sale + rent when role allows) |
| Detail | Price, location text, type, description; actions gated below |

### Sign-in gate

| Element | Contract |
|---------|----------|
| Trigger | Apply, Express interest, or Message while signed out |
| Behavior | Prompt to sign in; after success, return with **Continue** prompt on listing detail |
| Dual role | Role picker on every sign-in when account has 2+ roles |
| Method | Demo account picker or seed credentials |

### Seller — listings

| Element | Contract |
|---------|----------|
| Create | Four types; draft until publish |
| Sale fee stub | Visible stub; **must complete before first publish**; publish blocked otherwise |
| Publish | Blocked if required fields missing |
| Manage | Edit, unpublish, delete; photos (hero + gallery); BG toggle on rent listings; resolve booked sale |
| Inbox | Seller `/seller-inbox`; Buyer `/inbox`; Renter `/renter-inbox` |
| Booked | Seller can mark listing booked (sold/rented); leaves open catalog |

### Seeker — rent vs sale

| Listing | Primary action label | Notes |
|---------|----------------------|-------|
| Rent types | **Apply** | Creates `kind=apply` |
| Sale | **Express interest** | Creates `kind=interest` |

| Element | Contract |
|---------|----------|
| Multi-open | Many open requests allowed until listing booked |
| Accept | Seller accept/deny; accept does **not** auto-deny others; does **not** mark booked |
| BG stub | Rent only; seller enables per listing (form or requests with all/selected scope); mid-thread banner in inbox |
| Renter hub | `/renter-dashboard`, `/my-applications` (withdraw), `/renter-inbox`, shared `/thread` |
| Message | Thread tied to application/interest; both parties can read/send |

### Admin (web)

| Element | Contract |
|---------|----------|
| Single surface | Users and listings in one Admin area |
| Actions | Suspend user; unpublish listing; mark booked; **resolve sale**; moderate applicants; search listings |
| Reset demo | **Dev builds only** (`__DEV__`); button on admin surface |
| Visibility | Changes visible to other roles immediately in demo store |

## Empty / error

| Condition | Behavior |
|-----------|----------|
| Unsigned Apply/Interest/Message | Sign-in prompt |
| Publish without fee (sale) | Block with clear fee-stub message |
| Publish missing fields | Block with missing-field message |
| Request on booked listing | Action unavailable |
| Demo reset | Restores 100 listings / 10 users / 1 admin |

## Executable mapping

- Living documentation: Gherkin under `apps/ummahHomes/features/` (see `contracts/testing.md`).
- **Web**: Playwright + Gherkin MUST stay aligned with this contract before behavior is done.
- **Mobile**: Detox + Gherkin MUST cover core seeker/lister flows from this contract.
- **TDD**: failing scenario/unit test before implementation (constitution VI).
- Human walkthrough: `quickstart.md` (demo script; not a substitute for automation).

