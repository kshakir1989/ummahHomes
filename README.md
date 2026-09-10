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

## Demo locally (web, iOS, Android)

Demos run through **Expo CLI** from `apps/ummahHomes` (after `npm install`). Leave the Expo process running while you walk the app.

### Quick start

```bash
cd apps/ummahHomes
npm start                 # Expo Dev Tools — press w (web), i (iOS), a (Android)
# or open a surface directly (all Expo):
npm run web               # expo start --web
npm run ios               # expo run:ios  → Simulator + Metro
npm run android           # expo run:android → Emulator + Metro
```

`npm run ios` / `npm run android` use Expo’s native runners (`expo run:*`). They build/install the local app (first time) and keep Metro up so the Simulator/Emulator stay connected. Do not stop the terminal while demoing.

### One-time native project (if `ios/` or `android/` missing)

```bash
cd apps/ummahHomes
npx expo prebuild --platform ios       # creates gitignored ios/
npx expo prebuild --platform android   # creates gitignored android/
```

Then `npm run ios` / `npm run android` as above.

### Prerequisites

| Surface | Need |
|---------|------|
| **Web** | Node + browser |
| **iOS** | macOS, Xcode, iPhone Simulator (e.g. iPhone 17) |
| **Android** | JDK 17+, Android SDK, AVD `Pixel_6_API_34` |

Android env (Homebrew layout on this machine):

```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

Create the AVD once (if missing):

```bash
sdkmanager "platform-tools" "emulator" "platforms;android-34" "build-tools;34.0.0" "system-images;android-34;google_apis;arm64-v8a"
echo no | avdmanager create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;arm64-v8a" -d "pixel_6" --force
```

### Web

```bash
cd apps/ummahHomes
npm run web
```

Expo serves the app in the browser (typically `http://localhost:8081`). Fastest surface for marketing entry, browse, and role flows.

### iOS Simulator

```bash
cd apps/ummahHomes
npm run ios
```

Expo builds (cached after the first run), installs `com.freshusa.ummahhomes` on the Simulator, and starts Metro. Keep that Expo terminal open. If the screen is blank, press `⌘R` in Simulator or re-run `npm run ios`.

### Android Emulator

```bash
emulator -avd Pixel_6_API_34 &   # optional; Expo can open the AVD
cd apps/ummahHomes
npm run android
```

Same Expo flow as iOS. Package id: `com.freshusa.ummahhomes`. Confirm with `adb devices`. First build is slow; later runs reuse the Gradle cache.

### Themes

Active preset is **`emarat`** (cool navy / blue-gray luxury palette). Restore stage-1 green/brown:

```bash
EXPO_PUBLIC_THEME=stage1 npm start
# or: EXPO_PUBLIC_THEME=stage1 npm run web|ios|android
```

Tokens live in `apps/ummahHomes/src/ui/theme.ts` (`emarat` | `stage1` presets).

### Recorded walkthroughs

Role/browse MP4 scripts and output paths: `apps/ummahHomes/demoStore/README.md` (`npm run record:demos:web`, `record:browse:web`, iOS equivalents).

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

## Archify diagrams

Interactive system maps (architecture, workflow, sequence, data-flow, lifecycle) via [Archify](https://github.com/tt-a1i/archify). Separate from the Spec Kit Mermaid PNG above. The skill lives at the monorepo root: `.agents/skills/archify`.

**Generate** (in Cursor): ask *“Use Archify to map apps/ummahHomes … Save under apps/ummahHomes/docs/archify/.”*

**Open a diagram:**

```bash
# from monorepo root — open any generated HTML in the browser
open apps/ummahHomes/docs/archify/<name>.architecture.html
```

Or double-click the `.html` file under `docs/archify/`. Viewer keys: `?` guide, `/` search, `R` route, `E` export. Full steps: [`docs/archify/README.md`](./docs/archify/README.md).
