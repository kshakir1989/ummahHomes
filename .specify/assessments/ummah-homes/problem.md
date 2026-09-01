# Problem Definition: U.S. owner-listed homes, rooms, and basements

- **Slug**: ummah-homes
- **Created**: 2026-08-31
- **Inputs used**: intake.md | research.md

## Problem Statement

People who want to sell or rent a whole home, room, or basement in the United States at a community level, and people looking for those options, still rely on a mix of large portals, agents, and informal groups. Owner-listed inventory (especially rooms and basements) is hard to find and manage in one place with clear listing, inquiry, and screening flow. Without a focused owner-listed channel, seekers and listers keep that friction.

## Affected Users & Stakeholders

- **Users — Seller (lister)**: owns or controls a whole home for sale or rent, or a room/basement for rent; needs to create and manage listings and decide who to accept or deny (background checks and other valid reasons). — [source: intake.md, research owner notes]
- **Users — Buyer**: seeks a whole home for purchase; needs to find owner-listed homes and track interest. — [source: intake.md, research owner notes]
- **Users — Renter**: seeks a whole home, room, or basement to rent; needs to find listings and manage bookings/applications. — [source: intake.md, research owner notes]
- **Stakeholders — Owner (Khalil)**: funds and decides product direction, stage gates, and when paid hosting unlocks. — [source: intake.md]
- **Stakeholders — Platform admin**: needs to manage users and listings once the product exists. — [source: intake.md]
- **Stakeholders — Existing portals / agents**: competitors and substitutes seekers use today. — [source: research.md]

## Goals

- Make owner-listed U.S. homes (sale and rent), rooms (rent), and basements (rent) discoverable in one English-language product.
- Let Sellers create and manage those listing types without MLS/agent feeds.
- Let Buyers and Renters find listings and manage inquiries/bookings appropriate to sale vs rent.
- Let listers screen applicants via background checks and other valid reasons, without a platform religious eligibility rule.
- Ship stage 1 as a Cheap Path **demo** (test data, owner feedback) before unlocking paid hosting for production.
- Stage 1 surfaces: web + admin + Seller + Buyer/Renter panels, plus **demoable** iOS and Android clients (local/simulator/device demo OK; App Store / Play publish not required in stage 1). Prefer web first for feel, then confirm the same product scales to mobile.
- Make the company app and website easy to find and use.

## Non-Goals

- MLS / IDX / agent-feed inventory (owner-listed only).
- Platform-enforced religious (or other protected-class) eligibility rules.
- Paid production hosting/backend in stage 1.
- App Store / Google Play production publish in stage 1 (demoable builds only).
- Matching Zillow-scale national live inventory or MLS-backed for-sale catalogs.
- Legal advice or jurisdiction-by-jurisdiction housing-law productization in this assessment (counsel later).

## Success Metrics

- **Stage 1 (demo)**: owner can walk Seller, Buyer, Renter, and Admin flows on **web**, and can demo the seeker/lister feel on **iOS and Android** (simulator or device) with test data, then give a go/no-go on unlocking paid path. (baseline: no product; qualitative)
- **Listing coverage (demo)**: test catalog of **100 listings** across sale, whole-home rent, room, and basement; **10** test users (single, couples, families, groups; varied finances) and **1** admin. (baseline: 0) — [source: decision.md owner notes]
- **Stage 1 capability success** (after demo, supporting community needs) — all of:
  1. Web app lets users list living spaces
  2. Applicant vetting is implemented
  3. Clear communication channels between listers and applicants
  4. Admin can manage listings and applicants
  5. Listers can manage their listings and applicants
  6. Applicants can apply to listings and communicate with listers
- **Demand evidence**: owner-reported multi-year community-group listing/offer chatter. (baseline: informal channels only) — [source: decision.md]

## Cost of Inaction

Seekers and listers continue with general portals, agents, and informal community groups. Owner-listed rooms and basements stay fragmented. No ummahHomes demo exists to validate whether a staged, owner-listed marketplace is worth unlocking paid hosting.

## Open Questions

- First real supply city after demo: **Atlanta, Georgia** (resolved).
- Background checks: platform-run; paid by renter/buyer; Seller optional (vendor/cost later).
- Bookings: platform listing for sale/rent; **listing fee for sale**; “booked” = sold or rented (fee amount / payment rails later).
- Demo stubs: concept-level only for payments/messaging/background checks; do not balloon in stage 1.
- Admin panel and dashboard: **one surface** (resolved).
- Fair housing: listers accept/deny on valid reasons; counsel before production.
- [NEEDS CLARIFICATION: listing fee amount and when it is charged (demo stub vs production)]
- [NEEDS CLARIFICATION: messaging channel in demo (in-app only vs stub)]
