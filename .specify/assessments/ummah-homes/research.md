# Idea Research: Ummah Homes listing platform

- **Slug**: ummah-homes
- **Created**: 2026-08-31
- **Evidence confidence (overall)**: medium

Research used the updated intake idea. Inspiration sites named in intake (Zillow, Apartment List, Realtor.com) were **not fetched** (hosts not on the Spec Kit URL allowlist). Competitor behavior below is therefore not cited from those pages.

## Users & Demand

- **Owner-reported observation (2026-08-31)**: over the past few years, community groups have shown constant messages of people offering homes for rent; that recurring supply/seeker chatter is the demand signal that motivated the app. Building a listing product that lets listers support those community needs is the bet. — [source: owner notes in decision.md; ASSUMPTION — not independently audited] (confidence: medium)
- Two-sided marketplaces need enough listings *and* seekers in the same geography or they stay empty. Stage-1 geography: United States (English); first real supply city after demo: Atlanta, Georgia. — [source: research/problem owner notes] (confidence: medium)
- Open-source roommate apps sometimes include lifestyle fields (Roomy profiles include “faith”). That is prior art for preference fields, not evidence of demand for this marketplace. — [source: https://github.com/Coder-Man-2006/Roomy] (confidence: low)
- Public GitHub projects for **mosque discovery / community events** exist (e.g. Masjid Nearby, Minara). They are not housing listing platforms; less relevant after the religion-based product rule was dropped. — [source: https://github.com/ShahinurAlamBhuiyan/masjidNearby], [source: https://github.com/Hwako/Minara] (confidence: medium)

## Prior Art

- **This repo**: no ummahHomes product code yet. Sibling apps (`$Value`, vehicleTransportationSite) are unrelated to housing listings. — [source: apps/ummahHomes intake + monorepo layout] (confidence: high)
- **Open-source rental / roommate platforms** already implement listings, auth, maps, chat, and admin:
  - Housely: React Native app + Node API + Next.js admin; browse, maps, chat, bookings/reviews for a regional rental/sale market. — [source: https://github.com/jim2107054/Housely] (confidence: medium)
  - RentMeRoom: React Native + Firebase room rental, search, maps, chat; Play Store–oriented. — [source: https://github.com/aarishascension/RentMeRoom] (confidence: medium)
  - Room Bridge: rooms + landlords, document verification, chat, admin dashboard. — [source: https://github.com/AkshatJMe/Room-Bridge] (confidence: medium)
  - Roomify: listings + lifestyle questionnaire matching + messaging. — [source: https://github.com/VictoriaOyedotun/roomify] (confidence: medium)
- **Named inspiration** (Zillow / Apartment List / Realtor.com): owner-stated comps for a consumer listing portal. Pages not fetched. Those products are large, data-heavy, and (for many for-sale U.S. listings) tied to industry listing feeds rather than only owner posts. — [source: intake.md; pages not fetched] (confidence: low)
- Owner-listed sale/rent portals and roommate/room-rental apps are the closest cited prior art. No allowlisted source was used to claim a unique religious-marketplace gap (that product rule was removed).

## Market & Context

- Seekers today can use general portals, agents, Facebook/WhatsApp groups, and roommate apps. Cost of doing nothing: keep using those channels. — [ASSUMPTION] (confidence: medium)
- Intake asks for **web + iOS + Android + admin panel + admin dashboard + seller panel + buyer/renter panel + bookings** in a staged hosted platform. That is several products, not one v1 slice. Staged release can reduce this if stage 1 is tightly cut. — [source: intake.md] (confidence: high)
- Constitution Cheap Path still forbids paid hosting/backend/database **unless the user unlocks them**; intake says the product **will** be hosted and staged. That is a governance vs product-intent tension, not a market fact. — [source: `.specify/memory/constitution.md`, intake.md] (confidence: high)

## Data & Constraints
- **Security**: The platform will be built with security best practices.
- **For-sale inventory vs owner posts**: U.S.-style MLS/IDX listing data is not a public API. Stack Overflow answers state you generally must be a broker, realtor, or registered technical provider; RETS/IDX/VOW have display and login rules; there are many local MLSs with changing metadata. Building a Zillow-like for-sale catalog without that access means **owner-listed (FSBO) only** or paying a feed vendor. — [source: https://stackoverflow.com/questions/3959614/how-do-i-create-an-asp-net-website-to-search-mls-or-idx-listings], [source: https://stackoverflow.com/questions/30772930/is-there-a-way-to-use-mls-api-in-php], [source: https://stackoverflow.com/questions/55287183/is-it-possible-to-integrate-mls-and-idx-with-asp-net-mvc-5-website], [source: https://stackoverflow.com/questions/11417616/rets-or-not-rets] (confidence: high for “MLS is gated”; low for ummahHomes’s actual market)
- **PII and trust**: listings, users, bookings, and admin tools imply accounts, addresses, photos, and possibly payments/IDs. Housing listing fraud and fake listings are a known class of risk; no cited incident data gathered here. — [ASSUMPTION] (confidence: medium)

- **Lister screening**: the platform will not encode a religious eligibility rule. Listers accept or deny based on background checks and other valid reasons. How checks run, what is stored, and what “valid” means are unspecified. Housing-advertising and tenant-selection rules still apply in many U.S. jurisdictions; this research is not legal advice and did not fetch housing-authority sites. — [source: owner update 2026-08-31; ASSUMPTION on legal detail] (confidence: low) 

- **Bookings / listing economics (owner 2026-08-31)**: platform provides listing space for sale or rent; platform accepts a **fee for listing** a home for sale; a space that is “booked” means it is being sold or rented. Demo stubs only need to show the concept. — [source: decision.md owner notes] (confidence: medium)
- **Demo dataset (owner 2026-08-31)**: ~100 listings, 10 test users across demographics (single, couples, families, groups; varied finances), plus one admin; best- and worst-case paths. — [source: decision.md owner notes] (confidence: high)
- **App Store / Play / web**: three clients plus backend is a different cost and privacy-label surface than a static app; stage 1 mobile is demoable only (not store-published). — [ASSUMPTION] (confidence: medium)

## Evidence Against the Idea

- **No independently audited demand data** (no interviews/tickets in-repo). Demand rests on owner-reported community-group observation over years. Chicken-and-egg remains until Atlanta supply is real. — [source: decision.md owner notes; ASSUMPTION] (confidence: medium)
- **Scope vs comps**: matching Zillow-class sale+rent search plus rooms/basements plus three apps plus two operator consoles is far larger than typical first hosted stage. Open-source “full platforms” on GitHub still take a full backend (auth, DB, images, chat). — [source: Housely/RentMeRoom READMEs; intake.md] (confidence: medium)
- **MLS-shaped for-sale UX** without MLS access is a product mismatch; MLS access is gated and operationally heavy. — [source: Stack Overflow MLS/IDX threads above] (confidence: high if the product needs agent MLS inventory; N/A if v1 is owner-listed only)
- **Lister-run background checks** add PII, vendor cost, and compliance surface (what can legally be used to deny). Unspecified design. — [ASSUMPTION] (confidence: medium)
- **Constitution Cheap Path** blocks paid hosting/backend until unlocked; a hosted marketplace cannot ship as described without that unlock (or a later constitution amendment). Owner notes stage 1 as a Spec Kit Cheap Path demo with test data. — [source: constitution.md; research owner notes] (confidence: high)

## Gaps & Open Questions

- [NEEDS CLARIFICATION: first-stage geography and languages]
  Geography: United States
  Languages: English
- [NEEDS CLARIFICATION: owner-listed only vs any MLS/agent feed]
  Owner-listed only
- [NEEDS CLARIFICATION: v1 listing types — sale, whole-home rent, room, basement — which subset]
  V1 will include sale, whole-home rent, room, and basement.
- [NEEDS CLARIFICATION: how background checks work (who runs them, who pays, what is stored, what counts as a valid denial reason)]
  Listers accept or deny based on background checks and other valid reasons. Platform does not restrict by religion.
- [NEEDS CLARIFICATION: bookings, payments, messaging, verification for v1]
  (Follow pattern of how Zillow handles bookings, payments, messaging, verification)
- [NEEDS CLARIFICATION: which surface ships first — web vs iOS vs Android vs admin]
  Web will be shipped first along with the admin panel, seller panel and buyer/renter panel.
  iOS will ship second.
  Android will ship third.
- [NEEDS CLARIFICATION: whether paid hosting/backend is unlocked for stage 1]
  Paid hosting/backend is not required for stage 1.
  Stage 1 will be built in the Spec Kit Cheap Path and be in a demo state. 
  Test data will be used to populate the platform in demo state.
  The demo state will be used to test the platform and to get feedback from the owner.
  The feedback will be used to improve the platform.
  After stage one is complete, the owner will unlock paid hosting/backend and the platform will be built in the Spec Kit Paid Path.
  The platform will be built in the Spec Kit Paid Path and will be in a production state.
  At any time, the state of the environment can be cahnged to demo or production. (will decide later if its best to have a production and a demo environment or to have a single environment that can be changed to demo or production.)
- [NEEDS CLARIFICATION: seller and buyer/renter role names]
  Seller role name: Seller
  Buyer  role name: Buyer
  Renter role name: Renter
- [NEEDS CLARIFICATION: success metric for stage 1 (e.g. N listings in one city)]

## Sources

- https://github.com/Coder-Man-2006/Roomy (host: github.com, policy: allowlisted)
- https://github.com/jim2107054/Housely (host: github.com, policy: allowlisted)
- https://github.com/aarishascension/RentMeRoom (host: github.com, policy: allowlisted)
- https://github.com/AkshatJMe/Room-Bridge (host: github.com, policy: allowlisted)
- https://github.com/VictoriaOyedotun/roomify (host: github.com, policy: allowlisted)
- https://github.com/ShahinurAlamBhuiyan/masjidNearby (host: github.com, policy: allowlisted)
- https://github.com/Hwako/Minara (host: github.com, policy: allowlisted)
- https://stackoverflow.com/questions/3959614/how-do-i-create-an-asp-net-website-to-search-mls-or-idx-listings (host: stackoverflow.com, policy: allowlisted)
- https://stackoverflow.com/questions/30772930/is-there-a-way-to-use-mls-api-in-php (host: stackoverflow.com, policy: allowlisted)
- https://stackoverflow.com/questions/55287183/is-it-possible-to-integrate-mls-and-idx-with-asp-net-mvc-5-website (host: stackoverflow.com, policy: allowlisted)
- https://stackoverflow.com/questions/11417616/rets-or-not-rets (host: stackoverflow.com, policy: allowlisted)
- zillow.com / apartmentlist.com / realtor.com — [UNVERIFIED — fetch skipped: host not on safe list]
