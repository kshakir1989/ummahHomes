# Feature Specification: Stage-1 owner listing demo

**Feature Branch**: `001-owner-listing-demo`

**Created**: 2026-08-31

**Status**: Draft

**Input**: User description: "Handoff from assess go (slug=ummah-homes): Option B — Stage-1 cross-surface demo marketplace for owner-listed U.S. homes (sale/rent), rooms (rent), and basements (rent). Web first for feel; demoable iOS and Android (not store-published). Cheap Path demo with test data (100 listings, 10 users, 1 admin). Seller / Buyer / Renter / Admin. List, vet, message, apply/manage. Listing fee for sale (stub OK). No MLS; no platform religion rules; Atlanta real supply after paid unlock."

**Assessment**: `.specify/assessments/ummah-homes/decision.md` (verdict: go)

## Clarifications

### Session 2026-08-31

- Q: Who is allowed to mark a listing as booked (sold or rented) so it leaves the open catalog? → A: Seller or Admin may mark booked
- Q: Can someone browse published listings on the web without signing in? → A: Browse without login; apply/message require login
- Q: When must the for-sale listing-fee stub be completed relative to publishing the listing? → A: Fee stub required before first publish
- Q: Can more than one seeker have an open application or interest on the same listing at the same time? → A: Many open applications until listing is booked
- Q: What should a seeker do on a for-sale listing versus a for-rent listing? → A: “Express interest” on sale; “Apply” on rent

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seller creates and manages listings (Priority: P1)

A Seller signs in, creates owner-listed living spaces (whole home for sale, whole home for rent, room for rent, or basement for rent), edits or withdraws them, and sees applications or interest against each listing.

**Why this priority**: Without listings there is nothing for Buyers/Renters to find; this is the supply side of the community need.

**Independent Test**: Using only Seller and demo data tools, create at least one of each listing type, edit one, and confirm each appears in the public browse experience.

**Acceptance Scenarios**:

1. **Given** a Seller account, **When** they create a whole-home sale listing with required details, **Then** the listing is visible to seekers and marked as for sale.
2. **Given** a Seller account, **When** they create whole-home rent, room rent, or basement rent listings, **Then** each appears with the correct listing type.
3. **Given** an existing listing owned by the Seller, **When** they edit or unpublish it, **Then** seekers only see the updated published state.
4. **Given** a for-sale listing in draft, **When** the Seller attempts first publish without completing the listing-fee stub, **Then** publish is blocked until the fee stub is completed.
5. **Given** a for-sale listing draft with the listing-fee stub completed, **When** the Seller publishes, **Then** the listing becomes visible to seekers as for sale.

---

### User Story 2 - Renter or Buyer finds, applies, and communicates (Priority: P1)

A Renter or Buyer browses owner-listed inventory, opens a listing, applies or expresses interest, completes optional vetting when the Seller requires it, and messages the Seller.

**Why this priority**: Matches the six stage-1 capability checks for seeker apply, vet, and communicate.

**Independent Test**: As a Renter (and separately as a Buyer on a sale listing), browse demo catalog, open a listing, submit an application/interest, and exchange at least one message with the Seller.

**Acceptance Scenarios**:

1. **Given** a visitor who is not signed in, **When** they open the web browse experience, **Then** they can view published listings without creating an account.
2. **Given** published demo listings, **When** a signed-in seeker browses or filters by type, **Then** they can find sale, whole-home rent, room, and basement examples.
3. **Given** a published rent listing and a signed-in Renter, **When** they **Apply**, **Then** the Seller can see the application and accept or deny it.
4. **Given** a published sale listing and a signed-in Buyer, **When** they **Express interest**, **Then** the Seller can see the interest request and accept or deny it.
5. **Given** a Seller who requires a background check and a signed-in seeker, **When** the seeker applies or expresses interest, **Then** they are prompted through a background-check stub paid by the seeker (concept-level; no real vendor required in stage 1).
6. **Given** an open application or interest thread between signed-in users, **When** either party sends a message, **Then** the other can read it in an in-app conversation.
7. **Given** a listing that becomes booked (sold or rented) by the Seller or Admin, **When** a seeker views it, **Then** it is no longer available to apply to or express interest on as an open listing.
8. **Given** a visitor who is not signed in, **When** they try to apply, express interest, or message, **Then** they are prompted to sign in before continuing.

---

### User Story 3 - Admin manages users and listings (Priority: P1)

An Admin uses a single admin surface to view and manage users (Sellers, Buyers, Renters) and listings, including removing or suspending abusive content.

**Why this priority**: Owner-required capability check: administrator can manage listings and applicants.

**Independent Test**: Sign in as the demo admin, list users and listings, and perform at least one moderate action (e.g. unpublish a listing or suspend a user) visible in the product.

**Acceptance Scenarios**:

1. **Given** demo users and listings, **When** Admin opens the admin surface, **Then** they can see users and listings in one place.
2. **Given** a problematic listing or user, **When** Admin takes a manage action (including marking a listing booked when appropriate), **Then** the change is reflected for other roles.

---

### User Story 4 - Web feel, then mobile demo parity (Priority: P2)

The owner (or a demo facilitator) walks the primary Seller and seeker flows on the web product first, then repeats the core seeker/lister feel on demoable iOS and Android builds (simulator or device), without App Store or Play publish.

**Why this priority**: Proves cross-surface feel and scalability after the web demo works; Admin-deep flows need not be fully mirrored on mobile in stage 1.

**Independent Test**: Complete a Seller create-listing and a Renter apply+message path on web; repeat browse/apply/message (or create listing) on iOS and Android demo builds.

**Acceptance Scenarios**:

1. **Given** the web demo with test data, **When** the owner walks Seller, Renter/Buyer, and Admin flows, **Then** all six stage-1 capability checks can be demonstrated.
2. **Given** iOS and Android demo builds, **When** the owner demos core seeker/lister flows, **Then** the product feel is recognizable as the same application without requiring store deployment.

---

### User Story 5 - Easy-to-find company entry (Priority: P3)

A first-time visitor reaches a clear company/product entry (web) that explains what Ummah Homes is and how to start as Seller or seeker, without hunting through unrelated pages.

**Why this priority**: Stated goal; secondary to core marketplace flows.

**Independent Test**: From a cold start on web, a new visitor can identify the product purpose and reach sign-in or browse within a short path.

**Acceptance Scenarios**:

1. **Given** a visitor on the company/product web entry, **When** they follow the primary calls to action, **Then** they can reach browse or account entry without confusion about product purpose.

---

### Edge Cases

- What happens when a Seller accepts one applicant while others remain open — other applications stay open until denied, withdrawn, or the listing is booked; accepting one does not auto-deny the rest.
- What happens when a listing is marked booked while applications are still open — open applications are closed as unavailable; the listing leaves the open catalog.
- What happens when background check is required but the seeker declines the stub — application cannot complete until the required step is done or the Seller waives the requirement.
- How does the system handle a listing with missing required fields — it cannot be published until required fields are present.
- What happens when demo catalog is reset — the standard 100 listings / 10 users / 1 admin dataset can be restored for demos.
- How does the system treat dual roles — a user may act as Seller and seeker if the demo accounts allow; permissions follow the active role context.
- Platform does not block users by religion or other protected-class eligibility rules; accept/deny remains with the Seller for valid reasons.
- Accepting an applicant does **not** by itself mark the listing booked; Seller or Admin must mark booked separately (unless a later clarification changes this).
- Admin may mark a listing booked in addition to the Seller.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support owner-listed inventory only (no MLS or agent-feed inventory).
- **FR-002**: System MUST support listing types: whole home for sale, whole home for rent, room for rent, basement for rent.
- **FR-003**: System MUST provide distinct experiences for Seller, Buyer, Renter, and Admin (Buyer focuses on sale listings; Renter on rent listings; a person may hold more than one role if demo accounts allow).
- **FR-004**: Sellers MUST be able to create, edit, unpublish, and manage applications/interest on their listings.
- **FR-005**: Anyone MUST be able to browse/search **published** listings without signing in; seekers MUST sign in to **Apply** (rent), **Express interest** (sale), or message.
- **FR-005a**: System MUST prompt unsigned visitors to sign in when they attempt Apply, Express interest, or messaging.
- **FR-005b**: For-rent listings MUST use the seeker action **Apply**; for-sale listings MUST use **Express interest** (same underlying request entity; different labels).
- **FR-006**: Sellers MUST be able to accept or deny applications and interest requests; the platform MUST NOT enforce religious or other protected-class eligibility rules; multiple open requests MUST be allowed on one listing until it is booked; accepting one MUST NOT auto-deny the others.
- **FR-006a**: When a listing is marked booked, remaining open applications/interest on that listing MUST be closed as unavailable.
- **FR-007**: When a Seller requires vetting, the system MUST offer a background-check **stub** charged to the Buyer/Renter (concept-level; real vendor optional after paid unlock).
- **FR-008**: System MUST provide in-app messaging between listers and applicants for an active application or interest thread (demo depth: readable thread; not a full production messaging product).
- **FR-009**: Seller or Admin MUST be able to mark a listing as booked (sold or rented) so it is no longer openly available; accepting an applicant MUST NOT by itself mark the listing booked.
- **FR-010**: For-sale listings MUST complete a listing-fee **stub** (placeholder amount; real payment not required in stage 1) **before first publish**; publish MUST be blocked until that stub is completed.
- **FR-011**: Admin MUST manage users and listings from a **single** admin surface.
- **FR-012**: Stage 1 MUST ship as a Cheap Path **demo**: bundled or local test data, no paid production hosting required, no App Store/Play production publish required.
- **FR-013**: Demo data MUST include at least 100 listings spanning all four types, 10 test users covering singles, couples, families, and groups with varied financial backgrounds, and 1 admin user.
- **FR-014**: Primary demonstration surface MUST be web; iOS and Android MUST be demoable locally (simulator/device) for core seeker/lister feel.
- **FR-015**: Company/product web entry MUST make the product purpose and next steps easy to find and use.
- **FR-016**: Product language for stage 1 MUST be English; market framing is the United States; first real-supply city after demo is Atlanta, Georgia (live Atlanta inventory is out of scope for stage 1).

### Key Entities

- **User**: Account with one or more roles (Seller, Buyer, Renter, Admin); profile attributes for demo demographics.
- **Listing**: Owner-listed living space with type (home sale, home rent, room rent, basement rent), status (draft, published, booked), location text, price/rent, and Seller owner.
- **Application / Interest**: Seeker request against a listing; labeled **Apply** for rent and **Express interest** for sale; status (submitted, accepted, denied, withdrawn, unavailable); optional vetting requirement.
- **Message Thread**: Conversation between Seller and seeker tied to an application/interest.
- **Background Check Stub**: Optional step on an application; seeker-paid concept flow; result visible to Seller at stub fidelity.
- **Listing Fee Stub**: Fee step for sale listings; placeholder amount in demo.
- **Admin Action**: Record of moderate/manage actions on users or listings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Owner can demonstrate all six capability checks on web in one walkthrough: list spaces; vet applicants; lister–applicant communication; Admin manage listings/applicants; Seller manage listings/applicants; applicants apply and communicate.
- **SC-002**: Demo catalog contains at least 100 listings across all four listing types and is restorable for repeated demos.
- **SC-003**: Demo includes at least 10 non-admin users spanning single, couple, family, and group profiles with varied financial backgrounds, plus exactly one admin account used in the Admin walkthrough.
- **SC-004**: Core seeker or lister flows are demonstrable on iOS and on Android without store publication.
- **SC-005**: A new web visitor can state the product purpose and reach browse or sign-in within three obvious steps from the company/product entry.
- **SC-006**: After the demo walkthrough, the owner can give an explicit go/no-go on unlocking paid hosting for the next stage.

## Assumptions

- Stage 1 is a **demo** to validate product feel and flows, not a live Atlanta marketplace.
- Listing fee amount in demo is a visible placeholder (e.g. labeled stub); the stub MUST be completed before a for-sale listing’s first publish; real pricing and payment rails come after paid unlock.
- Background checks in stage 1 are stubs (pass/fail or pending) without a production screening vendor.
- Messaging is in-app threads only in stage 1; email/SMS notifications are out of scope unless added later.
- “Booked” means the living space is sold or rented and leaves the open catalog.
- Fair-housing counsel happens before production; stage 1 relies on Seller accept/deny for valid reasons without platform encoding protected-class rules.
- Mobile demos prioritize Seller and seeker feel; Admin may remain web-primary in stage 1.
- Authentication uses simple demo accounts suitable for local/demo use (no production identity provider required in stage 1).
- Published catalog browse is public on web; Apply, Express interest, and messaging require a signed-in account.
- Canonical seeker actions: **Apply** (rent) and **Express interest** (sale); do not use “Apply” as the primary label on for-sale listings.
