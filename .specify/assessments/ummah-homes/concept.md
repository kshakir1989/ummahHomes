# Concept: Owner-listed U.S. housing marketplace (staged)

- **Slug**: ummah-homes
- **Created**: 2026-08-31
- **Recommended option**: Option B — Stage-1 cross-surface demo marketplace
- **Owner note (2026-08-31)**: Option B confirmed; stage 1 must also include demoable iOS and Android (not store-deployed) so the feel and mobile scalability are visible after/alongside web.

## Options

### Option A — Do nothing / use existing portals
- **Sketch**: Keep relying on Zillow-class portals, agents, Facebook/WhatsApp groups, and informal boards for owner-listed homes, rooms, and basements. No ummahHomes product.
- **Appetite**: small (days of decision only)
- **Trade-offs**: Wins: zero build cost, no hosting, no compliance surface. Sacrifices: owner-listed rooms/basements stay fragmented; no demo to validate a community-level Atlanta path; no controlled Seller/Buyer/Renter/Admin flows.
- **Rabbit holes**: None for build; opportunity cost if a niche owner-listed channel would have worked.

### Option B — Stage-1 cross-surface demo marketplace
- **Sketch**: One English product experience for owner-only U.S. inventory (home sale, home rent, room rent, basement rent) with test data. Sellers, Buyers, and Renters run listing, inquiry/booking, and screening flows (background checks when Seller requires; paid by Buyer/Renter). A single Admin surface manages users and listings. **Demo order**: establish the feel on **web** first (including company site easy to find/use), then demo the same core experience on **iOS and Android** via local/simulator/device builds — not App Store / Play publish. Cheap Path (no paid production hosting). After owner go/no-go, unlock paid path and grow real supply starting in Atlanta, Georgia; store deploy later.
- **Appetite**: large (months for web + mobile demos of four listing types + four roles + bookings/screening stubs)
- **Trade-offs**: Wins: matches stated goals; proves web feel and mobile scalability before paid hosting; stays owner-listed (avoids MLS). Sacrifices: larger stage-1 surface than web-only; no live Atlanta supply in stage 1; “follow Zillow for payments/messaging” easy to over-scope; background-check vendors/cost unknown.
- **Rabbit holes**: Parity across web/iOS/Android vs “thin mobile shell”; payments/messaging “like Zillow”; real background-check PII; fair-housing if “valid reasons” are productized poorly; Admin + role panels as full products in the demo; sale vs rent booking semantics; overbuilding marketing/SEO before demos work.

### Option C — Narrower demo: Atlanta-shaped rental rooms/basements only
- **Sketch**: Same Cheap Path approach, but stage 1 only covers room and basement rent (plus Admin + Seller + Renter), primarily on web, with optional thin mobile demos later. Defer home sale, whole-home rent, Buyer depth, and payments until after feedback.
- **Appetite**: medium (weeks to a focused demo)
- **Trade-offs**: Wins: smaller rabbit surface; faster feedback. Sacrifices: weaker proof of mobile scalability and of all four listing types; less aligned with owner confirmation of Option B + mobile demos.
- **Rabbit holes**: Still needs trust/screening for shared housing; rebuild risk when sale/whole-home and fuller mobile land later.

## Recommendation

**Option B — Stage-1 cross-surface demo marketplace** (owner-confirmed). Web establishes product feel first; demoable iOS and Android prove the experience scales to mobile without requiring store deployment in stage 1. Option C remains the shrink path only if appetite must cut.

Keep concept-level only: no stack, schema, or task breakdown here.

## Out of Scope (for the recommended option)

- MLS / IDX / agent feeds
- Platform religious or protected-class eligibility rules
- Paid production hosting in stage 1
- App Store / Google Play production publish in stage 1 (local/simulator/device demos only)
- Live Atlanta inventory in stage 1 (test data only until paid unlock)
- Jurisdiction-by-jurisdiction legal productization in the demo
- Full production payment/messaging/background-check vendor contracts before owner unlock (stubs/placeholders allowed in demo)

## Assumptions to Validate

- Owner accepts a **large** appetite for stage-1 demo covering four listing types, four roles, **and** web + iOS + Android demos.
- Web is the primary “feel” surface; mobile demos must show the same core seeker/lister flows, not every Admin edge case.
- “Bookings managed by the platform” can be defined separately for sale vs rent without blocking the demo.
- “Payments follow Zillow” can be reduced to a thin demo stub until paid path.
- Platform-run background checks (Buyer/Renter pays; Seller optional) are acceptable as a stub in demo and a real vendor later.
- Atlanta is the first **real** supply geography after demo; demo data need not be Atlanta-only.
- Stage-1 success can be qualitative owner walkthrough (web + mobile demos) until a numeric metric (e.g. 10 real listings) is set.
- Leaving accept/deny to listers is enough for demo; fair-housing counsel happens before production.
- “Easy to find and use” for stage 1 means clear demo UX and entry paths, not a full marketing/SEO program.
