# Decision: Ummah Homes stage-1 demo marketplace

- **Slug**: ummah-homes
- **Decided**: 2026-08-31
- **Verdict**: go
- **Artifacts reviewed**: intake.md | research.md | problem.md | concept.md | owner clarifications in prior decision.md

## Scorecard

| Criterion | Rating | Justification |
|-----------|--------|---------------|
| Problem validity | adequate | Owner-listed homes/rooms/basements friction vs portals/community groups is clear in `problem.md`. |
| Evidence strength | adequate | Owner reports multi-year community-group messages of homes offered for rent as the demand signal; not independently audited, but enough for a Cheap Path demo bet. Prior art shows similar platforms are buildable. — [source: research.md updated] |
| Value vs. inaction | adequate | Demo validates community-support flows before paid unlock; inaction leaves chatter in informal groups. |
| Feasibility / appetite | adequate | Option B owner-confirmed; demo stubs thin; dataset sized (100 listings / 10 users / 1 admin). |
| Strategic fit | adequate | Assess → Cheap Path demo → Atlanta; owner-listed only; no religion rule. |
| Risk posture | adequate | Risks named; stage 1 limits payments/messaging/checks to concept stubs; counsel before production. |

## Verdict & Rationale

**go.** Blocking clarifications are answered: demand (community-group observation), success (six capability checks + 100/10/1 demo data), bookings/listing fee for sale, and thin demo stubs. Evidence is adequate—not strong—but Spec Kit’s bar for go is met. Hand off Option B to `/speckit-specify`.

## If needs-clarification

*(Not active.)*

## If go — Handoff to `/speckit-specify`

- **Problem**: Owner-listed U.S. homes (sale/rent), rooms, and basements are hard to find and manage in one place with listing, inquiry, screening, and communication—while community groups already show recurring rent-offer chatter.
- **Chosen approach**: Option B — Stage-1 cross-surface demo (web first for feel; demoable iOS/Android; Cheap Path test data; Atlanta real supply after paid unlock).
- **In scope**: Four listing types; Seller / Buyer / Renter; single Admin; list + vet + message + apply/manage flows; listing fee for sale (stub OK in demo); concept stubs for payments/messaging/background checks; demo dataset 100 listings, 10 diverse users, 1 admin; easy-to-find/use company web presence.
- **Out of scope**: MLS/IDX; religion/protected-class platform rules; paid production hosting in stage 1; App Store/Play publish in stage 1; live Atlanta inventory in stage 1; full production payment/BG-check vendors.
- **Success metrics**: Web + mobile demos exercise the six capability checks; catalog meets 100/10/1; owner go/no-go on paid unlock.
- **Carried-forward open questions**: Listing fee amount/timing; messaging channel depth in demo; background-check vendor/cost; fair-housing counsel before production.
