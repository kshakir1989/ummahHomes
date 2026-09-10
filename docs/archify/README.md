# Archify diagrams (ummahHomes)

Interactive architecture / workflow / sequence / data-flow / lifecycle diagrams for this app.

Skill is installed at the monorepo root: `.agents/skills/archify` ([tt-a1i/archify](https://github.com/tt-a1i/archify)).

## Generate a diagram

In Cursor (from this app or the monorepo), ask for example:

```text
Use Archify to map apps/ummahHomes: Expo web/iOS/Android, Spec Kit assess→specify, listing demo surfaces, Playwright/Detox.
Save JSON + HTML under apps/ummahHomes/docs/archify/.
```

Current map: `ummah-homes.architecture.html` (source `ummah-homes.architecture.json`).

Or validate/deliver yourself from the monorepo root:

```bash
cd /Users/khalilshakir/workspace
node .agents/skills/archify/bin/archify.mjs deliver architecture \
  apps/ummahHomes/docs/archify/<name>.architecture.json \
  apps/ummahHomes/docs/archify/<name>.architecture.html \
  --quality showcase --open --json
```

## Open a diagram

| Method | Command / action |
|--------|------------------|
| Finder / browser | Open the `.html` file in this folder |
| Terminal (macOS) | `open apps/ummahHomes/docs/archify/<name>.architecture.html` |
| Agent deliver | Use `--open` so Archify launches the file after a successful deliver |

Generated files are self-contained HTML (no server required).

## Viewer shortcuts (inside the HTML)

| Key | Action |
|-----|--------|
| `?` | Diagram guide |
| `/` | Search / focus a node |
| `R` | Route probe (PATH) |
| `L` | Role lens |
| `M` | Overview map |
| `P` | Play guided story |
| `F` | Presentation stage |
| `S` / `T` / `E` | Style / theme / export |
| `+` `-` `0` | Zoom / reset |

Export menu: PNG, SVG, WebM, and 1200×630 share cards.

This is separate from the Spec Kit Mermaid diagram (`spec-architecture.png` / `.mmd` at the app root).
