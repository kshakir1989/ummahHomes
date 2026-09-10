<!--
Sync Impact Report
- Version change: 1.2.0 → 1.2.1
- Modified principles: IX. Teach-Along — operational pause protocol
- Compliance: includes Teach-Along
- 1.2.0: Added VIII. Figma First UI; UI contracts split
- 1.2.1: Teach-Along pause protocol; monorepo AGENTS.md also enforces
-->

# ummahHomes Constitution

## Core Principles

### I. Ask First
Agents MUST ask the user before running commands, making edits, creating
commits, or deploying. Agents MUST NOT implement application behavior unless
the user explicitly says to implement it. Rationale: ummahHomes is
owner-driven; unsolicited changes burn Cursor budget and skip review.

### II. Assess Before Specify (NON-NEGOTIABLE)
Every new idea or feature MUST complete the assess pipeline (intake →
research → define → shape → decide) before `/speckit-specify`. Agents MUST
NOT start specify, plan, tasks, or implement until `decision.md` records a
**go** verdict for that idea. A **kill** or **needs-clarification** verdict
MUST stop delivery work. Rationale: discovery answers whether it is worth
building; specification answers how.

### III. Spec First
User-facing behavior MUST be documented in a Spec Kit feature spec under
`specs/` before or with the change that implements it. Agents MUST NOT add
or change user-facing behavior without a matching spec. Automated tests for
that behavior MUST land with the implementation using the locked test stack
in Product Constraints (Gherkin documentation plus runners below). Rationale:
the spec is what we can review and run.

### IV. One App
Agents MUST work only in `apps/ummahHomes` unless the user names another
app. Agents MUST NOT share App Store identities, catalogs, secrets, or
product data with sibling apps. Rationale: each app in freshusa-apps is a
separate product.

### V. Cheap Path Until Unlocked
v1 MUST stay as cheap as the chosen distribution channel allows. Agents
MUST NOT add a custom domain, paid hosting, paid backend, database, ads,
analytics, or extra vendor accounts unless the user unlocks them. Rationale:
the product is intended to become a hosted platform and will be built in
stages and released in stages.

### VI. Test-Driven Development (NON-NEGOTIABLE)
All application development MUST follow TDD: write a failing test first,
implement the minimum to pass, then refactor. For user-facing behavior,
failing Gherkin scenarios (and their step bindings) come before production
UI/domain changes. For domain and store logic, failing unit tests come
before implementation. Agents MUST NOT ship behavior that has no automated
coverage under the locked stack. Rationale: the demo must stay regressible
and reviewable as surfaces grow.

### VII. DRY
Agents MUST keep domain rules, labels (Apply vs Express interest), seed
shapes, and shared UI behavior in one place. Duplicate business logic across
web and mobile MUST be rejected in favor of shared modules. Gherkin feature
files that describe the same behavior MUST be shared; only step definitions
and drivers MAY differ by platform. Rationale: one Expo codebase and one
product language; copy-paste drifts break demos and fair-housing-sensitive
wording.

### VIII. Figma First UI (NON-NEGOTIABLE)
Agents MUST NOT implement user-facing screens or styled UI components until
approved frames exist in a Figma **design file** and matching entries exist
in `contracts/ui-design.md` with `Review: approved`. FigJam is process only;
design files are the visual source of truth. Rationale: web-primary demo
requires reviewable look-and-feel before code; prevents throwaway UI rework.

### IX. Teach-Along (NON-NEGOTIABLE)
Before each non-trivial step (commands, edits, commits, deploys, or multi-file
design), agents MUST pause and teach in plain language: (1) what will change,
(2) why this option over named alternatives, (3) how the component fits
ummahHomes. Agents MUST NOT run tools or write files for that step until the
owner replies **go**, asks a follow-up, or explicitly skips Teach-Along for
that step. Rationale: the owner learns every component and decision; Ask First
is permission, Teach-Along is understanding.

## Product Constraints

- Product name: ummahHomes.
- App path: `/Users/khalilshakir/workspace/apps/ummahHomes` in the
  `freshusa-apps` monorepo.
- Spec Kit is required. After `specify init`, `specify extension add bug`
  and `specify extension add assess` MUST be installed.
- The bundled `speckit` workflow MUST run assess first via
  `.specify/workflows/overlays/speckit/assess-first.yml`.
- **Stack (stage 1)**: Expo + TypeScript (web + iOS + Android); bundled
  JSON demo data; no paid production hosting.
- **UI contracts**: functional = `contracts/ui-behavior.md`; visual =
  `contracts/ui-design.md` (Figma file URL + node URLs); scaffold from
  monorepo `templates/spec-ui-design/`.
- **Test stack (locked)**:
  - **Web**: Playwright + Gherkin (`playwright-bdd` or equivalent) —
    `.feature` files are the living documentation for web acceptance.
  - **Mobile (iOS/Android)**: Detox + Gherkin — `.feature` files are the
    living documentation for mobile acceptance of core seeker/lister flows.
  - **Unit**: Jest for domain/store TDD (Expo-compatible).
- TODO(PRODUCT): refine audience/market copy as assess evolves; do not
  invent paid vendors or live Atlanta supply in stage 1.

## Development Workflow

- Assess artifacts live under `.specify/assessments/<slug>/`. Feature work
  after a **go** lives under `specs/`.
- **UI/UX foundation phase** (Phase 2b in tasks): Figma frames → node URLs
  in ui-design.md → owner `Review: approved` → then story UI tasks.
- Agents MUST keep `spec-architecture.png` aligned with Spec Kit artifacts.
  When files or dependencies change, update `spec-architecture.mmd` and
  `spec-architecture.html`, then run `node render-spec-architecture.mjs`
  from `apps/ummahHomes`.
- Read the Cursor usage cap in `plan.md` before work when that file exists.
  If **Last known used** is at or over **Stop at**, STOP.
- Run installs and tests from `apps/ummahHomes` (unit, `test:e2e` web,
  Detox mobile). Prefer shared `features/*.feature` for cross-surface
  behavior; platform-only scenarios (e.g. Admin web) live in clearly named
  feature files.
- PRs that touch UI MUST cite Figma node URLs for changed screens.
- Commits MUST be small and reviewable. Commit code under `apps/ummahHomes`
  only. Do not commit working-notes `plan.md` at app root unless the user
  asks. Do not commit secrets.
- Do not push or deploy unless the user asks.
- Feature `specs/.../plan.md` is Spec Kit output and may be committed with
  the feature. App-root `plan.md` (Cursor caps) stays local unless asked.
- This constitution governs when informal notes conflict, except live cap
  numbers stay in app-root `plan.md` until moved to a shared place.

## Governance

This constitution is the governing document for ummahHomes. It supersedes
informal chat instructions when they conflict, except that an explicit user
instruction in the current session MAY amend or suspend a rule for that
session.

Amendments MUST be explicit (the user says to change the constitution).
Each amendment MUST update this file, bump the version, set **Last Amended**
to today (ISO date), and record what changed in the Sync Impact Report
comment at the top of this file.

Versioning:

- MAJOR: a principle is removed or redefined incompatibly.
- MINOR: a principle or section is added or materially expanded.
- PATCH: clarification, wording, or non-semantic fix.

Compliance: before commands, edits, commits, or deploys, agents MUST check
Ask First, Assess Before Specify, TDD, DRY, Figma First UI, Teach-Along, and
the Cursor usage cap when present. Complexity (new services, paid tools, extra
screens, remote data) MUST be justified against Cheap Path and Product
Constraints or deferred.

**Version**: 1.2.1 | **Ratified**: 2026-08-31 | **Last Amended**: 2026-09-07
