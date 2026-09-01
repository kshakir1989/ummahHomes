# UI Design Contract: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Functional contract**: [ui-behavior.md](./ui-behavior.md)  
**Visual source of truth**: Figma **design file** (not FigJam)

## Figma file

| Field | Value |
|-------|-------|
| Design file URL | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa/ummahHomes-Stage-1-demo |
| File name | ummahHomes — Stage 1 demo |
| File key | `LspxQoVjShdcUmV1bNkOWa` |

## Review

| Field | Value |
|-------|-------|
| Status | approved |
| Reviewed by | Owner |
| Date | 2026-08-31 |

**Gate:** Story UI implementation may proceed once T026–T027 (theme + primitives) are complete. `Status: approved` and in-scope frame node URLs are satisfied.

## Layout stack (owner locked 2026-08-31)

**Primary stack:** Option 1 — Web **1A**, Mobile **1A** (Zillow-class intent portal). Full matrix: [ui-layout-options.md](./ui-layout-options.md#owner-selection--option-1-web-1a--mobile-1a).

| Screen ID | Layout option | Key pattern |
|-----------|---------------|-------------|
| entry | 3 | Search-first landing with type tabs in video hero |
| browse | 1 | Compact video strip + filter chips + 3-column grid |
| listing-detail | 1 | Gallery left, sticky facts + CTA right |
| sign-in | 3 (+ 1 for `/auth`) | Inline gate on PDP; center card on direct auth |
| seller-listing-form | 1 | Top stepper sell flow |
| seller-fee-stub | 1 | Checkout-lite disclosure |
| seller-requests | 1 | Inbox rows |
| seeker-request | 1 | Short apply / express-interest form |
| seeker-bg-stub | 1 | Disclosure card |
| message-thread | 1 | Thread list + bubbles |
| admin-surface | 1 | Users \| Listings tabs |
| browse-mobile | 1 | 40vh hero + vertical cards |
| listing-detail-mobile | 1 | Swipe gallery + sticky bottom CTA |
| sign-in-mobile | 4 | Half-height gate sheet over listing |
| seller-listing-form-mobile | 1 | Stepper |
| seeker-request-mobile | 1 | Sticky bottom CTA |
| message-thread-mobile | 1 | iMessage-style bubbles |

## Frame matrix — Web (primary)

Page: **Web** (1280×800 frames)

| Screen ID | Story | Surface | Frame name | Node URL | States |
|-----------|-------|---------|------------|----------|--------|
| entry | US5 | web | entry | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-3 | default |
| browse | US2 | web | browse | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-6 | default, empty |
| listing-detail | US2 | web | listing-detail | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-9 | default, signed-out, signed-in |
| sign-in | US2 | web | sign-in | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-12 | default |
| seller-listing-form | US1 | web | seller-listing-form | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-15 | create, edit |
| seller-fee-stub | US1 | web | seller-fee-stub | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-18 | default |
| seller-requests | US1 | web | seller-requests | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-21 | default |
| seeker-request | US2 | web | seeker-request | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-24 | apply, interest |
| seeker-bg-stub | US2 | web | seeker-bg-stub | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-27 | pending, declined |
| message-thread | US2 | web | message-thread | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-30 | default |
| admin-surface | US3 | web | admin-surface | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-33 | default |

## Frame matrix — Mobile (390×844, core — US4)

Page: **Mobile 390×844**

| Screen ID | Story | Surface | Frame name | Node URL | States |
|-----------|-------|---------|------------|----------|--------|
| browse-mobile | US4 | iOS/Android | browse-mobile | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-37 | default |
| listing-detail-mobile | US4 | iOS/Android | listing-detail-mobile | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-40 | default |
| sign-in-mobile | US4 | iOS/Android | sign-in-mobile | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-43 | default |
| seller-listing-form-mobile | US4 | iOS/Android | seller-listing-form-mobile | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-46 | create |
| seeker-request-mobile | US4 | iOS/Android | seeker-request-mobile | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-49 | apply, interest |
| message-thread-mobile | US4 | iOS/Android | message-thread-mobile | https://www.figma.com/design/LspxQoVjShdcUmV1bNkOWa?node-id=1-52 | default |

Admin is **web-only** in stage 1 (no mobile frame).

## testID convention

Stable prefixes for Gherkin / Playwright / Detox (implement in Expo `testID` props).

| Screen ID | testID prefix |
|-----------|---------------|
| entry | `entry` |
| browse | `browse` |
| listing-detail | `listing-detail` |
| sign-in | `sign-in` |
| seller-listing-form | `seller-listing-form` |
| seller-fee-stub | `seller-fee-stub` |
| seller-requests | `seller-requests` |
| seeker-request | `seeker-request` |
| seeker-bg-stub | `seeker-bg-stub` |
| message-thread | `message-thread` |
| admin-surface | `admin-surface` |
| browse-mobile | `browse` |
| listing-detail-mobile | `listing-detail` |
| sign-in-mobile | `sign-in` |
| seller-listing-form-mobile | `seller-listing-form` |
| seeker-request-mobile | `seeker-request` |
| message-thread-mobile | `message-thread` |

## Design tokens

Initial placeholders — refine from Figma variables after owner visual pass (T026).

| Token | Value | Usage |
|-------|-------|-------|
| color.primary | `#1B6B4A` | CTAs, links (forest green) |
| color.background | `#F5F0E8` | Page background (warm sand) |
| color.surface | `#FFFBF5` | Cards on tinted sections |
| color.brown.deep | `#3E2723` | Video overlay, footer, dark headers |
| color.brown.mid | `#6D4C41` | Secondary text, borders |
| color.text | `#1A1A1E` | Body text |
| color.textMuted | `#6B7280` | Secondary text |
| font.family | Inter | System or brand |
| font.size.body | 16 | Body |
| font.size.heading | 20 | Titles |
| spacing.unit | 8 | Base spacing |
| radius.card | 12 | Listing cards |

## Out of scope (frames)

- App Store / Play marketing assets
- Live Atlanta geo-specific map UI
- Production payment or BG-check vendor flows
- Full Admin parity on mobile

## Links

- Functional UI: [ui-behavior.md](./ui-behavior.md)
- Layout options (5 per screen): [ui-layout-options.md](./ui-layout-options.md)
- **Wireframe diagrams:** [ui-layout-wireframes.html](./ui-layout-wireframes.html) — open in browser to compare layouts
- Testing: [testing.md](./testing.md)
- Monorepo template: [`templates/spec-ui-design/`](../../../../../templates/spec-ui-design/)
