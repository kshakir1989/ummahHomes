# Agent rules (ummahHomes)

GitHub: `kshakir1989/ummahHomes`. This repository is **ummahHomes only**. Do not edit other FreshUSA products or other GitHub repos in the same session.

- **Teach-Along (NON-NEGOTIABLE):** Before each non-trivial step, pause and teach: (1) what will change, (2) why this option over alternatives, (3) how it fits ummahHomes. Wait for **go**, a question, or an explicit skip.
- Ask before commands, edits, commits, or deploys unless the owner already said **go** on that chunk.
- **Assess before specify:** `/speckit-assess-intake` → research → define → shape → decide. Only a **go** verdict may continue to `/speckit-specify`. Overlay: `.specify/workflows/overlays/speckit/assess-first.yml` when present.
- Do not commit `plan.md` unless the owner asks.
- Keep `spec-architecture.png` current when Spec Kit artifacts change.
- **Chunk = commit + push (NON-NEGOTIABLE):** after each reviewable slice, commit on this repo’s implementation branch and immediately `git push` that same branch. Standing owner order: no second commit/push ask after **go** on that chunk.
- **Working tree always clean** before the next chunk. `.env` and `plan.md` stay untracked.
- Run installs and tests from this repo root.

## Git

- Default branch is **`main`**. Do not push feature work to `main`.
- Implementation branches for features/versions; land via PR into `main` after ship (or when agreed).
- **UI / UX:** Figma design frames first. PRs that touch UI cite the Figma **node URL**.
