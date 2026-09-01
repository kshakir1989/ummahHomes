# Research: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Input**: `spec.md` + constitution Cheap Path + assess Option B

## Decision 1 — Single Expo TypeScript app (web + iOS + Android)

- **Decision**: Build stage 1 as one Expo (React Native) + TypeScript app with Expo Router, targeting **web first**, then local iOS/Android demos from the same codebase.
- **Rationale**: Spec requires web feel plus demoable iOS/Android without store publish (FR-014). One codebase minimizes Cheap Path cost and keeps Seller/seeker flows recognizable across surfaces. Sibling monorepo app `$Value` already uses Expo, so tooling familiarity stays in-repo.
- **Alternatives considered**:
  - Separate Next.js web + native shells — more repos/surfaces; worse for demo parity.
  - Web-only then rewrite mobile — fails Option B mobile demo requirement.
  - Three native stacks — unjustified complexity under Cheap Path.

## Decision 2 — Bundled JSON seed + local mutable store

- **Decision**: Ship a restorable demo seed (`data/` JSON: listings, users, admin) and a local in-app store (memory + optional AsyncStorage/file persistence for the session) for mutations. Reset restores the seed (100 listings / 10 users / 1 admin).
- **Rationale**: FR-012/FR-013 require Cheap Path demo data with no paid hosting. Bundled JSON matches how `$Value` ships catalog data and makes reset deterministic.
- **Alternatives considered**:
  - Hosted Postgres/Supabase — violates Cheap Path until paid unlock.
  - SQLite only — fine later; JSON seed is enough for stage-1 restore and review.

## Decision 3 — Demo auth (picker / seeded credentials)

- **Decision**: No production IdP. Sign-in is a demo account picker or fixed seed credentials covering Seller, Buyer, Renter, Admin (and dual-role accounts if present in seed).
- **Rationale**: Spec assumptions allow simple demo accounts; browse remains public without login.
- **Alternatives considered**: Auth0/Clerk/Firebase Auth — paid/config overhead; deferred to paid unlock.

## Decision 4 — Stubs for fee, background check, messaging

- **Decision**: Listing-fee stub (sale, before first publish), background-check stub (seeker-paid concept), and in-app message threads are **local UI + store state** only—no real payment, screening vendor, or push/email.
- **Rationale**: Spec FR-007/FR-008/FR-010 and assess out-of-scope production vendors.
- **Alternatives considered**: Stripe + real BG vendor — blocked by Cheap Path and out of stage-1 scope.

## Decision 5 — Admin web-primary; mobile core seeker/lister

- **Decision**: Full Admin surface on **web**. iOS/Android demos prioritize browse, list create/edit, Apply / Express interest, and messaging; Admin deep manage may be web-only in stage 1.
- **Rationale**: Spec User Story 4 and assumptions.
- **Alternatives considered**: Full Admin parity on mobile — rabbit hole called out in concept.md.

## Decision 6 — Validation / testing for stage 1 (owner-locked)

- **Decision**:
  - **Web acceptance**: Playwright + Gherkin (`playwright-bdd` pattern as in `$Value`) — `.feature` files document web behavior.
  - **Mobile acceptance**: Detox + Gherkin for iOS/Android core seeker/lister flows — `.feature` files document mobile behavior.
  - **Unit**: Jest for domain/store logic.
  - **Process**: TDD for all development (failing test → implement → refactor). `quickstart.md` remains the human demo script; automation is the gate for “done.”
- **Rationale**: Owner locked the stack (2026-08-31). Gherkin keeps acceptance readable; Playwright covers web-primary Admin + full flows; Detox covers local mobile demos without store publish. Aligns with constitution VI.
- **Alternatives considered**:
  - Manual-only quickstart — rejected by owner.
  - Playwright for mobile webviews only — weaker native feel coverage than Detox.
  - Detox without Gherkin — loses living documentation parity with web.

## Decision 7 — DRY across surfaces and tests

- **Decision**: Shared `src/domain` + `src/store` for all surfaces. Shared Gherkin scenarios under `features/` for behavior that is identical on web and mobile; platform-specific step definitions (`features/steps/web/`, `features/steps/mobile/`) and Admin-only features for web. No duplicated Apply/Express interest rules in UI layers.
- **Rationale**: Constitution VII; one product language; prevents web/mobile drift.
- **Alternatives considered**: Separate web and mobile business logic — rejected (DRY / Option B parity).

## Decision 8 — Project layout inside `apps/ummahHomes`

- **Decision**: App source at `apps/ummahHomes/` root (Expo convention: `app/`, `src/`, `data/`, `features/`), with Spec Kit artifacts under `specs/001-owner-listing-demo/`.
- **Rationale**: Matches monorepo “one app directory” and Cheap Path single project; Gherkin lives next to the app like `$Value`.
- **Alternatives considered**: `apps/ummahHomes/web` + `apps/ummahHomes/mobile` monorepo split — unnecessary for Expo universal.

## Decision 9 — Figma-first UI/UX foundation (owner-locked 2A)

- **Decision**: Before story UI implementation, complete Phase 2b: create a Figma **design file** with web frames (all stage-1 screens) and mobile core frames (390×844); record file and node URLs in `contracts/ui-design.md`; owner sets `Review: approved`; then extract tokens to `src/ui/theme.ts` and build shared primitives.
- **Rationale**: Constitution VIII; monorepo `templates/spec-ui-design/`; separates functional (`ui-behavior.md`) from visual (`ui-design.md`) contracts; matches `$Value` Figma-first pattern generalized for web-primary ummahHomes.
- **Alternatives considered**:
  - Code UI without Figma — rejected by owner (1B/2A).
  - Tokens-only without frames — rejected; 2A requires full frame set.

## Open items (carried, not blocking plan)

- Exact listing-fee placeholder dollar amount (label as stub in UI).
- Background-check vendor after paid unlock.
- Fair-housing counsel before production.
- Whether dual-role users appear in the seed set (allowed by spec; seed design chooses).
