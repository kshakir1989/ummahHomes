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
```

### Mobile Detox (US4 / T059)

**iOS (green on this machine):** requires Xcode, iPhone 17 simulator, Metro (`npx expo start` or an already-running Expo on :8081), and AppleSimulatorUtils:

```bash
brew tap wix/brew && brew trust wix/brew && brew install applesimutils
cd apps/ummahHomes
npx expo prebuild --platform ios     # creates ios/ (gitignored)
# Keep Metro up in another terminal: npx expo start
npm run test:e2e:mobile:build        # xcodebuild → Debug-iphonesimulator
npm run test:e2e:mobile              # Detox on iPhone 17 simulator
```

`package.json` pins `react-native-worklets@0.10.1` / `react-native-reanimated@4.5.1` (Expo SDK 57 supported) so native builds do not hit the worklets `executeSync` break from transitive 0.12.x.

**Android:** Detox config is in `.detoxrc.js` (`android.emu.debug`). Needs `adb` + AVD `Pixel_6_API_34` (or edit the AVD name):

```bash
npx expo prebuild --platform android
npx detox build -c android.emu.debug
npm run test:e2e:mobile:android
```

Gherkin living docs: `features/mobile-core.feature`. Detox driver: `e2e/mobile-core.e2e.js`.

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
