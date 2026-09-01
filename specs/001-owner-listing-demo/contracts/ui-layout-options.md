# UI Layout Options: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Status**: **Owner locked** — Primary stack Option 1 (Web **1A**, Mobile **1A**), 2026-08-31  
**References**: [ui-design.md](./ui-design.md), [ui-behavior.md](./ui-behavior.md)  
**Direction**: Green + brown palette, Zillow-inspired information architecture, intent-first search, looping interior video on entry + compact strip on browse

## Shared design language

### Palette (proposed)

| Token | Hex | Role |
|-------|-----|------|
| `green.deep` | `#145A3A` | Header, primary buttons, trust accents |
| `green.mid` | `#1B6B4A` | Links, active nav, success |
| `green.soft` | `#E8F3ED` | Tinted panels, hover backgrounds |
| `brown.deep` | `#3E2723` | Footer, dark overlays on video |
| `brown.mid` | `#6D4C41` | Secondary text on light surfaces |
| `brown.warm` | `#8D6E63` | Borders, dividers, chips |
| `sand` | `#F5F0E8` | Page background (warm off-white) |
| `cream` | `#FFFBF5` | Cards on brown/green sections |
| `white` | `#FFFFFF` | Listing cards, modals |

Video hero: full-bleed looping MP4 of home interiors; `brown.deep` gradient overlay (60–70% opacity) so white/green search UI stays readable.

### Zillow-inspired patterns to borrow (not copy)

- Sticky top nav: logo left, **Browse** / **List your home** / **Sign in** right  
- Hero search: location + listing-type tabs (Buy / Rent / Room / Basement)  
- Results: photo-left card rows or 3-column grid with price prominent  
- Detail: large gallery left, sticky action column right  
- Filters: left rail (web) or bottom sheet (mobile)

### Parallax + video (entry + browse only)

- **Entry (`entry:3`):** full hero with search as primary CTA; background video fixed; foreground scrolls at 1.0× while video layer moves at ~0.85×  
- **Browse (`browse:1`):** compact video strip (~200px), not full-viewport parallax  
- On mobile (`browse-mobile:1`): shorter hero (40vh), video still loops, reduced motion respects OS setting

---

## Owner selection — Option 1, Web 1A + Mobile 1A

**Strategy:** Zillow-class intent portal — search-first entry, compact video on browse, decision-structured PDP, sign-in gate at apply intent.

| Screen ID | Web option | Mobile option | Notes |
|-----------|------------|---------------|-------|
| `entry` | **3** Search-First Landing | — | Location + type tabs in hero; Browse implied by search |
| `browse` | **1** Zillow Results Grid | **1** Zillow App Home | 3-col grid web; vertical cards + filter chips mobile |
| `listing-detail` | **1** Zillow Detail Split | **1** Zillow Mobile PDP | Sticky CTA column (web) / bottom bar (mobile) |
| `sign-in` | **3** Inline Gate (+ **1** for `/auth`) | **4** Gate Overlay | Overlay on PDP when applying; center card for direct auth route |
| `seller-listing-form` | **1** Zillow Sell Flow | **1** Stepper | Type → Details → Photos → Publish |
| `seller-fee-stub` | **1** Checkout Lite | — | Web only in flow |
| `seller-requests` | **1** Zillow Inbox Rows | — | Web seller surface |
| `seeker-request` | **1** Zillow Tour Request | **1** Sticky CTA | Apply / Express interest labels per listing type |
| `seeker-bg-stub` | **1** Zillow-Style Disclosure | — | Demo Pass / Fail |
| `message-thread` | **1** Zillow Messages | **1** iMessage Style | Thread list desktop; bubbles mobile |
| `admin-surface` | **1** Zillow Admin Table | — | Web-only stage 1 |

Wireframe reference: option numbers above match [ui-layout-wireframes.html](./ui-layout-wireframes.html).

---

## Web screens

### `entry` — Company / product entry (US5)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Classic Hero** | Full-viewport video parallax; centered headline “Owner-listed homes, rooms & basements”; dual CTAs **Browse listings** (green) + **Sign in** (outline cream); brown gradient bottom fade into sand content band with 3 value props. |
| 2 | **Split Hero** | Left 55% video parallax; right 45% cream panel with logo, one-line purpose, stacked CTAs; below fold: horizontal “How it works” (List → Connect → Move in) on green.soft background. |
| 3 | **Search-First Landing** | Zillow-style: video hero with **search bar** (location + type) as primary CTA; Browse implied by search; secondary text link Sign in; trust row under hero (owner-listed only, no MLS). |
| 4 | **Story Scroll** | Video hero (shorter); scroll reveals full-bleed brown section with white type + Browse CTA; second scroll to green section with role cards (Seller / Renter / Buyer). |
| 5 | **Minimal Brand** | Video hero only + wordmark + two large pill buttons; no footer on first paint; SC-005 path: hero → tap Browse (same page anchor to mini catalog preview strip). |

---

### `browse` — Public catalog (US2)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Results Grid** | Compact video parallax strip (200px) with search/filters; sticky filter chips (Sale, Home rent, Room, Basement); 3-column card grid on sand; each card: photo, price, location, type badge. |
| 2 | **List + Left Filters** | No video on browse (entry already set mood); left 240px filter rail (type, price range demo); right list rows like Zillow map-list hybrid without map in v1. |
| 3 | **Video Band + Grid** | Taller parallax video (35vh) with search overlay; scroll snaps to grid; top nav sticky green.deep. |
| 4 | **Tabbed Catalog** | Horizontal tabs for four listing types; each tab own grid; brown header bar with result count; cards cream on sand. |
| 5 | **Magazine Browse** | Featured row (large cards) + “All listings” dense grid; subtle brown texture background; filters in collapsible top drawer. |

---

### `listing-detail` — Public detail (US2)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Detail Split** | Left 65% photo carousel (placeholder images); right sticky column: price, type, location, description, primary CTA (**Apply** or **Express interest**); brown bar for “Sign in to continue” when logged out. |
| 2 | **Full-Bleed Gallery** | Edge-to-edge gallery top; content card overlaps gallery (-48px) cream with shadow; CTA fixed bottom bar on mobile web. |
| 3 | **Two-Column Info** | Gallery left; below gallery full-width description; right column only facts + CTA (Zillow “At a glance” style). |
| 4 | **Immersive Brown** | Dark brown header strip with back + share; light content area; green CTA; seller “room in home” callout for room/basement types. |
| 5 | **Minimal Demo** | Single hero image, stacked fields, one CTA — fastest to build; still uses green CTA on sand. |

---

### `sign-in` — Demo account picker (US2)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Center Card Modal** | Sand page; centered cream card; “Continue as demo user”; grid of role tiles (Seller, Buyer, Renter, Admin) with icons; green highlight on select. |
| 2 | **Zillow-Style Panel** | Split: left brown panel brand story; right sign-in list; matches entry visual language. |
| 3 | **Inline Gate** | Shown as overlay on listing-detail (dimmed backdrop); same role picker; **return to listing** on success. |
| 4 | **Dropdown Compact** | Minimal top-nav **Sign in** opens dropdown of seed accounts; full page variant for direct `/auth` route. |
| 5 | **Role Cards Horizontal** | Full-width green.soft band; four large cards in a row; one tap sign-in (demo). |

---

### `seller-listing-form` — Create / edit (US1)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Sell Flow** | Stepper top (Type → Details → Photos → Publish); cream form on sand; green **Next**; type as four large tiles. |
| 2 | **Single Page Form** | All fields one scroll; sticky footer Save draft / Publish; brown section headers. |
| 3 | **Side Nav Wizard** | Left step list (green checkmarks); right form; room/basement shows parent-home optional field. |
| 4 | **Card Sections** | Collapsible cards per section; reduces overwhelm for four listing types. |
| 5 | **Split Preview** | Left form, right live preview card (how listing appears in browse). |

---

### `seller-fee-stub` — Sale fee before publish (US1)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Checkout Lite** | Zillow-style fee disclosure card; line item “Listing fee (demo stub)”; green **Acknowledge & continue**; brown legal microcopy. |
| 2 | **Modal Step** | Blocks publish; modal over form; cannot dismiss without acknowledge. |
| 3 | **Inline Banner** | Red/brown alert at top of publish step until stub completed. |
| 4 | **Receipt Preview** | Mock receipt on cream; stub amount placeholder `$— (demo)`. |
| 5 | **Full Page Gate** | Dedicated route before publish; back returns to form. |

---

### `seller-requests` — Applications / interest inbox (US1)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Inbox Rows** | Table-like rows: seeker name, listing, status chip, Accept / Deny; filter by listing. |
| 2 | **Kanban Lite** | Columns Submitted / Accepted / Denied; cards draggable optional later. |
| 3 | **Master-Detail** | Left list of requests; right detail + Message link. |
| 4 | **Grouped by Listing** | Accordion per listing; requests nested inside. |
| 5 | **Card Grid** | Large cards per request with photo placeholder avatar; actions footer. |

---

### `seeker-request` — Apply / Express interest (US2)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Tour Request** | Short form: message optional, green **Apply** or **Express interest**; listing summary header. |
| 2 | **One-Tap Apply** | Single CTA + confirm sheet; minimal fields for demo. |
| 3 | **Split Context** | Left listing mini-card; right form; brown header shows correct label per type. |
| 4 | **Step Flow** | Apply → optional BG stub redirect → confirmation. |
| 5 | **Drawer** | Bottom sheet on web (narrow) / full screen mobile; same fields. |

---

### `seeker-bg-stub` — Background check stub (US2)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow-Style Disclosure** | Cream card; “Background check (demo)”; fee stub; Pass / Fail demo buttons; Decline link. |
| 2 | **Wizard Step** | Progress dots; cannot proceed without Pass or Seller waive. |
| 3 | **Modal** | Over seeker-request; blocks submit until complete. |
| 4 | **Inline Expandable** | Expands under Apply button; collapsed by default. |
| 5 | **Separate Route** | Full page with brown header “Screening (demo)”. |

---

### `message-thread` — In-app messaging (US2)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Messages** | Left thread list (desktop) / single thread mobile; right bubbles; green sent, cream received; listing context header. |
| 2 | **Full-Width Chat** | No thread list in v1; single thread only; back to listing. |
| 3 | **Split Header** | Sticky header: listing thumb + seeker name; chat below. |
| 4 | **Card Thread** | Messages in rounded cards on sand; brown timestamp dividers. |
| 5 | **Minimal Demo** | Plain list + input bar; fastest TDD target. |

---

### `admin-surface` — Users + listings (US3)

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Admin Table** | Two tabs Users | Listings; dense tables; row actions Suspend / Unpublish / Mark booked; green header bar. |
| 2 | **Dashboard Cards** | KPI cards top (counts); tables below. |
| 3 | **Master-Detail** | Left entity list; right detail + actions. |
| 4 | **Single Scroll** | Users section then listings section; simpler demo. |
| 5 | **Dark Ops** | Brown.deep sidebar nav; cream content; clear destructive actions in brown.red accent. |

---

## Mobile screens (390×844)

Mobile options adapt web directions: bottom nav (**Browse** | **List** | **Messages** | **Account**), shorter video hero, full-width CTAs.

### `browse-mobile`

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow App Home** | Video hero 40vh parallax + search; vertical listing cards; filter chips horizontal scroll. |
| 2 | **No Video Browse** | Sand background only; faster load; search bar top. |
| 3 | **Map Placeholder** | Gray map stub top half + list bottom sheet (map non-functional demo). |
| 4 | **Type Tabs** | Bottom-aligned tabs for four types; one column cards. |
| 5 | **Featured Carousel** | Horizontal snap carousel + list below. |

### `listing-detail-mobile`

| # | Option | Layout |
|---|--------|--------|
| 1 | **Zillow Mobile PDP** | Swipe gallery; sticky bottom bar CTA; price + location under gallery. |
| 2 | **Collapsing Header** | Gallery collapses to bar on scroll; CTA stays fixed bottom. |
| 3 | **Full Screen Gallery** | Dots indicator; content in sheet pulled up over image. |
| 4 | **Compact** | One image; text stack; single green CTA. |
| 5 | **Brown Hero** | Brown gradient under image; cream content card overlap. |

### `sign-in-mobile`

| # | Option | Layout |
|---|--------|--------|
| 1 | **Bottom Sheet Picker** | Role list slides up; green selection. |
| 2 | **Full Screen** | Logo + four stacked role buttons. |
| 3 | **Native List** | iOS/Android settings-style list of demo accounts. |
| 4 | **Gate Overlay** | Half-height sheet over listing detail. |
| 5 | **Account Tab** | Empty state on Account tab → Sign in CTA. |

### `seller-listing-form-mobile`

| # | Option | Layout |
|---|--------|--------|
| 1 | **Stepper** | One field group per step; green Next; type selection first screen. |
| 2 | **Long Form** | Single scroll with section headers. |
| 3 | **FAB Save** | Floating save; publish in header. |
| 4 | **Type Grid** | 2×2 tiles for listing types then form. |
| 5 | **Wizard Dots** | Top progress; minimal fields per step. |

### `seeker-request-mobile`

| # | Option | Layout |
|---|--------|--------|
| 1 | **Sticky CTA** | Listing summary collapsible; green Apply / Express interest bottom. |
| 2 | **Sheet** | Half sheet from listing detail. |
| 3 | **Full Page** | Dedicated route with back nav. |
| 4 | **One Tap** | CTA → confirm alert → done. |
| 5 | **Form + BG** | Apply then inline BG stub accordion. |

### `message-thread-mobile`

| # | Option | Layout |
|---|--------|--------|
| 1 | **iMessage Style** | Bubbles + composer pinned bottom. |
| 2 | **WhatsApp Green** | Green header bar; cream body (brand-aligned). |
| 3 | **Listing Context** | Mini listing card pinned above thread. |
| 4 | **Minimal** | Text list + input only. |
| 5 | **Full Bleed** | Sand background; brown composer border. |

---

## Next steps

1. Refine **locked layouts** in [Figma](https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa/ummahHomes-Stage-1-demo) to match the Owner selection table (especially `entry:3` search-first hero).  
2. Owner visual pass on tokens and polish.  
3. ~~Set `Review: approved` in [ui-design.md](./ui-design.md) when ready for implementation (T025).~~ **Done** 2026-08-31.  
4. Implement `src/ui/theme.ts` and primitives (T026–T027) after Figma approval.
