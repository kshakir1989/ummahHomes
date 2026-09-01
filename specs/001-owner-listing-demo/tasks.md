# Tasks: Stage-1 owner listing demo

**Input**: Design documents from `/specs/001-owner-listing-demo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (including **ui-design.md**), quickstart.md

**Tests**: REQUIRED (constitution VI TDD — Jest unit; Playwright+Gherkin web; Detox+Gherkin mobile)

**UI gate**: Story **UI** tasks require Phase 2b complete — `contracts/ui-design.md` → `Review: approved` and node URLs for each screen in scope.

**Organization**: Phases by user story; within each story write failing tests before implementation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete work)
- **[Story]**: US1–US5 map to spec user stories
- Paths are under `apps/ummahHomes/` unless noted

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Expo app shell and locked test tooling

- [x] T001 Create Expo TypeScript app skeleton with Expo Router dirs `app/`, `src/domain/`, `src/store/`, `src/ui/`, `data/`, `features/`, `e2e/` per `specs/001-owner-listing-demo/plan.md`
- [x] T002 Initialize `package.json` / `app.json` with Expo, Expo Router, React Native Web, and npm scripts `test:unit`, `test:e2e`, `test:e2e:mobile` in `apps/ummahHomes/package.json`
- [x] T003 [P] Configure Jest for TypeScript domain/store tests in `apps/ummahHomes/jest.config.js` and `apps/ummahHomes/tsconfig.json`
- [x] T004 [P] Configure Playwright + playwright-bdd (Gherkin) in `apps/ummahHomes/playwright.config.ts` and `apps/ummahHomes/features/` mirroring `$Value` pattern
- [x] T005 [P] Scaffold Detox + Gherkin mobile harness in `apps/ummahHomes/e2e/` and `apps/ummahHomes/features/steps/mobile/`
- [x] T006 [P] Add `.gitignore` entries for Expo, Playwright, Detox, and Jest artifacts in `apps/ummahHomes/.gitignore`

---

## Phase 2: Foundational — Domain (Blocking)

**Purpose**: Shared domain, seed, store, auth — MUST complete before user stories

**⚠️ CRITICAL**: No story **UI** work until Phase 2b (Figma approved). This phase is domain + minimal placeholders only.

- [x] T007 [P] Add failing Jest tests for User/Listing/ApplicationInterest types and enums in `apps/ummahHomes/src/domain/__tests__/types.test.ts`
- [x] T008 Implement shared domain types and constants in `apps/ummahHomes/src/domain/types.ts` to pass T007
- [x] T009 [P] Add failing Jest tests for listing publish/fee/booked transitions in `apps/ummahHomes/src/domain/__tests__/listingRules.test.ts`
- [x] T010 Implement listing domain rules in `apps/ummahHomes/src/domain/listingRules.ts` to pass T009
- [x] T011 [P] Add failing Jest tests for request accept/deny/multi-open/unavailable rules in `apps/ummahHomes/src/domain/__tests__/requestRules.test.ts`
- [x] T012 Implement request/interest domain rules in `apps/ummahHomes/src/domain/requestRules.ts` to pass T011
- [x] T013 [P] Create seed generators/fixtures targeting ≥100 listings / 10 users / 1 admin in `apps/ummahHomes/data/seed.ts` (or `data/*.json`)
- [x] T014 [P] Add failing Jest seed invariant tests (counts, four types, household diversity) in `apps/ummahHomes/src/store/__tests__/seed.invariants.test.ts`
- [x] T015 Implement demo store load/reset + mutable overlay in `apps/ummahHomes/src/store/demoStore.ts` to pass T014
- [x] T016 [P] Add failing Jest tests for `signIn` / `signOut` / role session in `apps/ummahHomes/src/store/__tests__/session.test.ts`
- [x] T017 Implement demo session/auth in `apps/ummahHomes/src/store/session.ts` to pass T016
- [x] T018 Implement domain operations façade matching `contracts/domain-operations.md` in `apps/ummahHomes/src/domain/operations.ts` (wire to store; unit-test gaps covered by T009–T016)
- [x] T019 Create Expo Router shell routes for `(public)`, `(auth)`, `(seller)`, `(seeker)`, `(admin)` in `apps/ummahHomes/app/` with **text-only placeholder** screens (no styled UI)

**Checkpoint**: `npm run test:unit` green; app boots with placeholders; seed reset works — proceed to Phase 2b

---

## Phase 2b: UI/UX Foundation (Blocking)

**Purpose**: Figma frames + approved visual contract — MUST complete before ANY story **UI** implementation

**⚠️ CRITICAL**: No styled screens, `src/ui/theme.ts`, or shared UI primitives until `Review: approved` in ui-design.md

- [x] T020 Scaffold `specs/001-owner-listing-demo/contracts/ui-design.md` with frame inventory + `Review: draft` (see monorepo `templates/spec-ui-design/`)
- [x] T021 Create/link Figma **design file** for ummahHomes stage-1; record design file URL in `contracts/ui-design.md`
- [x] T022 [P] Draw **web** frames for all Screen IDs in `contracts/ui-design.md`
- [x] T023 [P] Draw **mobile** core frames (390×844) for mobile Screen IDs in `contracts/ui-design.md`
- [x] T024 Record every frame **node URL** in `contracts/ui-design.md`; confirm testID prefix table matches `contracts/testing.md`
- [x] T025 **Owner review** — update `contracts/ui-design.md` to `Review: approved` (blocks all story UI until done)
- [x] T026 Extract design tokens to `apps/ummahHomes/src/ui/theme.ts` from Figma variables / ui-design.md
- [x] T027 Build shared UI primitives in `apps/ummahHomes/src/ui/` from tokens (buttons, inputs, layout, listing card) — DRY

**Checkpoint**: ui-design.md approved; all in-scope frames linked; theme + primitives ready — story UI tasks may begin

---

## Phase 3: User Story 1 — Seller creates and manages listings (Priority: P1) 🎯 MVP

**Goal**: Seller creates all four listing types, completes sale fee stub before publish, edits/unpublishes

**Independent Test**: Create each listing type, block sale publish without fee stub, publish with stub, edit/unpublish; catalog shows published state

**UI prerequisite**: Phase 2b approved; node URLs for `seller-listing-form`, `seller-fee-stub`, `seller-requests`, `browse`

### Tests for User Story 1 (TDD — fail first)

- [x] T028 [P] [US1] Add failing Jest tests for `createListing`, `completeListingFeeStub`, `publishListing`, `unpublishListing` in `apps/ummahHomes/src/domain/__tests__/sellerListings.test.ts`
- [x] T029 [P] [US1] Add failing Gherkin scenarios for Seller create/fee/publish/edit in `apps/ummahHomes/features/seller-listings.feature`
- [x] T030 [US1] Add failing Playwright web step stubs for T029 in `apps/ummahHomes/features/steps/web/seller.steps.ts`

### Implementation for User Story 1

- [x] T031 [US1] Implement seller listing operations in `apps/ummahHomes/src/domain/operations.ts` / store to pass T028
- [x] T032 [US1] Build Seller create/edit listing screens in `apps/ummahHomes/app/(seller)/` per Figma `seller-listing-form` + `seller-fee-stub` nodes
- [x] T033 [US1] Wire published listings into public browse data path in `apps/ummahHomes/app/(public)/` per Figma `browse` node
- [x] T034 [US1] Complete Playwright steps and make `features/seller-listings.feature` green via `npm run test:e2e`

**Checkpoint**: US1 independently demoable on web; unit + web Gherkin green for Seller flows

---

## Phase 4: User Story 2 — Renter/Buyer finds, applies, communicates (Priority: P1)

**Goal**: Public browse; sign-in gate; Apply vs Express interest; multi-open; BG stub; messaging; booked closes requests

**UI prerequisite**: Phase 2b; node URLs for browse, listing-detail, sign-in, seeker-request, seeker-bg-stub, message-thread

### Tests for User Story 2 (TDD — fail first)

- [x] T035 [P] [US2] Add failing Jest tests for createRequest kind-by-type, multi-open, markBooked→unavailable, BG stub gates in `apps/ummahHomes/src/domain/__tests__/seekerRequests.test.ts`
- [x] T036 [P] [US2] Add failing Jest tests for message thread send/list in `apps/ummahHomes/src/domain/__tests__/messaging.test.ts`
- [x] T037 [P] [US2] Add failing Gherkin for public browse + auth gate in `apps/ummahHomes/features/browse-auth.feature`
- [x] T038 [P] [US2] Add failing Gherkin for Apply / Express interest / accept / multi-open in `apps/ummahHomes/features/seeker-requests.feature`
- [x] T039 [P] [US2] Add failing Gherkin for BG stub + messaging + booked in `apps/ummahHomes/features/vet-message-booked.feature`
- [x] T040 [US2] Add failing Playwright web steps for T037–T039 in `apps/ummahHomes/features/steps/web/seeker.steps.ts` and `apps/ummahHomes/features/steps/web/browse.steps.ts`

### Implementation for User Story 2

- [x] T041 [US2] Implement request, BG stub, booked cascade, and messaging operations to pass T035–T036 in `apps/ummahHomes/src/domain/` and `apps/ummahHomes/src/store/`
- [x] T042 [US2] Build browse + listing detail screens in `apps/ummahHomes/app/(public)/` per Figma `browse` + `listing-detail`
- [x] T043 [US2] Build demo sign-in picker/gate in `apps/ummahHomes/app/(auth)/` per Figma `sign-in`
- [x] T044 [US2] Build seeker Apply / Express interest + Seller accept/deny UI per Figma `seeker-request` + `seller-requests`
- [x] T045 [US2] Build message thread UI per Figma `message-thread` using shared thread component in `apps/ummahHomes/src/ui/`
- [x] T046 [US2] Implement Seller/Admin mark-booked control on listing manage views in `apps/ummahHomes/app/(seller)/`
- [x] T047 [US2] Make web Gherkin features T037–T039 green via `npm run test:e2e`

**Checkpoint**: US1+US2 web flows cover five of six capability checks (Admin still US3)

---

## Phase 5: User Story 3 — Admin manages users and listings (Priority: P1)

**Goal**: Single Admin web surface; suspend; unpublish; mark booked

**UI prerequisite**: Phase 2b; node URL for `admin-surface`

### Tests for User Story 3 (TDD — fail first)

- [ ] T048 [P] [US3] Add failing Jest tests for admin suspend/unpublish/markBooked + AdminAction in `apps/ummahHomes/src/domain/__tests__/adminActions.test.ts`
- [ ] T049 [P] [US3] Add failing Gherkin Admin scenarios in `apps/ummahHomes/features/admin.feature` (web-only)
- [ ] T050 [US3] Add failing Playwright Admin steps in `apps/ummahHomes/features/steps/web/admin.steps.ts`

### Implementation for User Story 3

- [ ] T051 [US3] Implement admin operations in `apps/ummahHomes/src/domain/operations.ts` / store to pass T048
- [ ] T052 [US3] Build single Admin surface in `apps/ummahHomes/app/(admin)/` per Figma `admin-surface`
- [ ] T053 [US3] Make `features/admin.feature` green via `npm run test:e2e`

**Checkpoint**: All six web capability checks (SC-001) automatable

---

## Phase 6: User Story 4 — Web feel, then mobile demo parity (Priority: P2)

**Goal**: Detox+Gherkin core seeker/lister on iOS and Android

**UI prerequisite**: Phase 2b; mobile frame node URLs

### Tests for User Story 4 (TDD — fail first)

- [ ] T054 [P] [US4] Add/reuse shared Gherkin for mobile core flows in `apps/ummahHomes/features/mobile-core.feature`
- [ ] T055 [US4] Add failing Detox mobile step defs in `apps/ummahHomes/features/steps/mobile/` for T054

### Implementation for User Story 4

- [ ] T056 [US4] Ensure Seller/seeker screens work on native (testIDs from ui-design.md) under `apps/ummahHomes/app/` without forking domain logic
- [ ] T057 [US4] Configure Detox for iOS simulator in `apps/ummahHomes/e2e/` and document in `apps/ummahHomes/README.md`
- [ ] T058 [US4] Configure Detox for Android emulator in `apps/ummahHomes/e2e/` and document in `apps/ummahHomes/README.md`
- [ ] T059 [US4] Make mobile Gherkin green on iOS and Android via `npm run test:e2e:mobile`

**Checkpoint**: SC-004 satisfied; Admin remains web-only

---

## Phase 7: User Story 5 — Easy-to-find company entry (Priority: P3)

**Goal**: Web entry → Browse or Sign in within three obvious steps

**UI prerequisite**: Phase 2b; node URL for `entry`

### Tests for User Story 5 (TDD — fail first)

- [ ] T060 [P] [US5] Add failing Gherkin for company/product entry in `apps/ummahHomes/features/company-entry.feature`
- [ ] T061 [US5] Add failing Playwright steps in `apps/ummahHomes/features/steps/web/entry.steps.ts`

### Implementation for User Story 5

- [ ] T062 [US5] Build company/product entry as default web route in `apps/ummahHomes/app/(public)/index.tsx` per Figma `entry`
- [ ] T063 [US5] Make `features/company-entry.feature` green via `npm run test:e2e`

**Checkpoint**: SC-005 automated

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T064 Expose **reset demo data** control wired to `src/store/demoStore.ts` with Jest in `apps/ummahHomes/src/store/__tests__/reset.test.ts`
- [ ] T065 [P] Deduplicate Apply vs Express interest labels in `apps/ummahHomes/src/domain/labels.ts`
- [ ] T066 [P] Update `apps/ummahHomes/README.md` with unit/e2e/mobile commands and UI/UX gate
- [ ] T067 [P] Sync `specs/001-owner-listing-demo/quickstart.md` with Phase 2b gate and walkthrough A–C
- [ ] T068 Update `apps/ummahHomes/spec-architecture.mmd` / `.html` and re-run `node render-spec-architecture.mjs`
- [ ] T069 Run full gate: `npm run test:unit`, `npm run test:e2e`, `npm run test:e2e:mobile` from `apps/ummahHomes`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup** → **Phase 2 Domain** → **Phase 2b UI/UX** (blocks story UI) → **User stories**
- Domain work (Phase 2) may overlap with Figma drafting (T022–T024) but **not** story UI
- **US1–US5 UI tasks** require Phase 2b `Review: approved`

### MVP scope

**MVP** = Phase 1 + Phase 2 + **Phase 2b** + Phase 3 (T001–T034) — Seller listing demo on web **after Figma approval**.

### Within Each Story

1. Failing Jest and/or Gherkin first  
2. Domain/store  
3. UI (only after Phase 2b)  
4. Steps green  

---

## Task Summary

| Phase | Tasks | Count |
|-------|-------|-------|
| Setup | T001–T006 | 6 |
| Foundational domain | T007–T019 | 13 |
| **UI/UX foundation** | **T020–T027** | **8** |
| US1 Seller | T028–T034 | 7 |
| US2 Seeker | T035–T047 | 13 |
| US3 Admin | T048–T053 | 6 |
| US4 Mobile | T054–T059 | 6 |
| US5 Entry | T060–T063 | 4 |
| Polish | T064–T069 | 6 |
| **Total** | | **69** |

**Format validation**: All tasks use `- [ ]`, sequential `Tnnn`, optional `[P]`, story labels on US phases only, and explicit file paths.
