# ummahHomes

App path: `apps/ummahHomes` in the freshusa-apps monorepo.

Planning lives in Spec Kit (`specs/` after a feature is specified, `.specify/assessments/` while an idea is still in discovery). Do not start `/speckit-specify` until assess returns **go**.

## Development workflow

Establish project principles once (`/speckit-constitution`). After that, every new idea or feature uses **assess first**, then Spec-Driven Development.

1. **Intake** — `/speckit-assess-intake` (capture the idea; optionally `slug=…`)
2. **Research** — `/speckit-assess-research`
3. **Define** — `/speckit-assess-define` (problem, goals, non-goals, metrics)
4. **Shape** — `/speckit-assess-shape` (2–3 concept options; no implementation design)
5. **Decide** — `/speckit-assess-decide` → **go** / **needs-clarification** / **kill**
6. **Specify** — `/speckit-specify` only after **go** (handoff from `decision.md`)
7. Plan → tasks → **UI/UX foundation (Figma + ui-design.md)** → implement → converge (bundled Spec Kit cycle)

**Test stack (constitution 1.2.0):** TDD; Playwright + Gherkin (web); Detox + Gherkin (mobile); Jest (domain/store); DRY shared domain and shared `.feature` files where behavior matches.

**UI/UX (constitution VIII):** Figma **design frames first**, then Expo UI. Visual contract: `specs/<feature>/contracts/ui-design.md` (`Review: approved` before story UI). Template: monorepo `templates/spec-ui-design/`.

## Run the app

```bash
cd apps/ummahHomes
npm install
npm run web          # Expo web (primary demo)
npm run ios          # after native prebuild
npm run android
```

## Tests

```bash
cd apps/ummahHomes
npm run test:unit         # Jest domain/store
npm run test:e2e          # Playwright + Gherkin (web) — requires Chromium: npx playwright install chromium
npm run test:e2e:mobile   # Detox (iOS sim / Android emu) — needs native build + Detox config in e2e/
```

**UI gate:** Story UI requires `specs/001-owner-listing-demo/contracts/ui-design.md` → `Review: approved` (done for stage-1).

Artifacts for an idea live under `.specify/assessments/<slug>/` (`intake.md`, `research.md`, `problem.md`, `concept.md`, `decision.md`).

The same assess steps are prepended to `specify workflow run speckit` via `.specify/workflows/overlays/speckit/assess-first.yml`. Approve the review gate only for a **go** verdict.

Pass the idea in `spec`, and include `slug=…` so later assess stages share a directory:

```bash
cd apps/ummahHomes
specify workflow run speckit -i spec="… slug=ummah-homes"
```

## Spec architecture diagram

How Spec Kit files depend on each other (assess → decide → specify → demo surfaces):

| File | Purpose |
|------|---------|
| `spec-architecture.png` | Diagram screenshot |
| `spec-architecture.mmd` | Mermaid source (edit this) |
| `spec-architecture.html` | HTML preview used to generate the PNG |
| `render-spec-architecture.mjs` | Regenerate PNG |

**Keep the PNG current.** When assess/spec/impl artifacts are added or dependencies change, update the `.mmd` and `.html`, then:

```bash
cd apps/ummahHomes
node render-spec-architecture.mjs
```

(Uses Playwright from `apps/value` if ummahHomes has no local install.)
