# Quickstart: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Purpose**: Human demo script (SC-001–SC-006) **after** automated gates are green. Development MUST use TDD per `contracts/testing.md`.

## Prerequisites

- Spec: `spec.md`
- Plan: `plan.md`, `data-model.md`, `contracts/*`
- Constitution 1.2.0+: TDD, DRY, Playwright+Gherkin, Detox+Gherkin, Jest
- **Phase 2b UI/UX**: Figma frames + `contracts/ui-design.md` → `Review: approved` before story UI

## Automated gates (do these first)

```bash
cd apps/ummahHomes
npm run test:unit
npm run test:e2e           # Playwright + Gherkin (web)
npm run test:e2e:mobile    # Detox + Gherkin (when mobile harness is up)
npm run record:browse:web  # Guest browse walkthrough → demoStore/web/browse-flow.mp4
npm run record:demos:web   # Role flows (seller, buyer, renter, admin)
```

See `demoStore/README.md` for recorded demo assets.

Shared behavior is documented in `features/*.feature`. Do not treat this quickstart as a replacement for those scenarios.

## Setup

```bash
cd apps/ummahHomes
npm install
npx playwright install chromium   # once per machine for web e2e
npm run web                       # http://localhost:8081 or Expo port
```

Confirm seed: **≥100** listings across four types, **10** non-admin users, **1** admin. Reset via `operations.resetDemoData()` / Admin or local control (T064).

**UI/UX gate:** `contracts/ui-design.md` is **approved** (Option 1 Web 1A / Mobile 1A). Figma: https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa/ummahHomes-Stage-1-demo

## Walkthrough A — Web capability checks (SC-001)

Mirror the six capability checks already covered by web Gherkin; use this for owner narration:

1. **Entry (SC-005)**: Company entry → Browse or Sign in within three steps.
2. **Public browse**: Signed out, published listings; all four types.
3. **Seller list**: Fee stub before sale publish; create rent types; edit; catalog updates.
4. **Apply / Express interest**: Renter Applies; Buyer Expresses interest; multi-open; accept without auto-deny.
5. **Vet stub + message**: BG stub path; one message each way.
6. **Booked + Admin**: Mark booked (Seller or Admin); Admin single surface manage action.

## Walkthrough B — Mobile feel (SC-004)

After Detox+Gherkin green: browse, sign-in, Apply or Express interest, message or create listing on iOS and Android local builds.

## Walkthrough C — Dataset (SC-002, SC-003)

Confirm counts and reset (also asserted in Jest/Gherkin where implemented).

## Walkthrough D — Owner gate (SC-006)

Owner records go/no-go on paid hosting unlock.

## Spot-checks (also in Gherkin)

| Action | Expected |
|--------|----------|
| Publish sale without fee stub | Blocked |
| Apply/Interest/Message signed out | Sign-in prompt |
| Wrong seeker label for listing type | Unavailable / correct label only |
| Apply on booked listing | Unavailable |

## References

- `contracts/testing.md`
- `contracts/ui-behavior.md`
- `contracts/domain-operations.md`
- `data-model.md`
