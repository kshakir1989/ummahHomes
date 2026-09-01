# Testing Contract: Stage-1 owner listing demo

**Feature**: `001-owner-listing-demo`  
**Date**: 2026-08-31  
**Constitution**: VI (TDD), VII (DRY); Product Constraints test stack

## Locked stack

| Layer | Tool | Documentation |
|-------|------|----------------|
| Web acceptance | Playwright + Gherkin (`playwright-bdd`) | `features/*.feature` |
| Mobile acceptance | Detox + Gherkin | Same shared features where behavior matches; mobile step defs |
| Unit | Jest | Colocated or `__tests__` under `src/domain`, `src/store` |

## TDD order (required)

1. **Red**: Add/adjust failing Jest test and/or Gherkin scenario + step stub.
2. **Green**: Implement minimum domain/UI to pass.
3. **Refactor**: Deduplicate per DRY; keep tests green.
4. Behavior is not “done” until web Gherkin passes for web-scoped flows; mobile Gherkin/Detox passes for mobile-scoped flows; unit tests pass for touched domain/store.

## DRY rules for tests

- One scenario text for shared seeker/lister behavior; do not fork `.feature` wording per platform unless behavior truly differs.
- Web-only: Admin surface, company entry polish if mobile omits it.
- Mobile-only: native-specific navigation/smoke if needed — keep minimal.
- Step definitions may differ (`features/steps/web/` vs `features/steps/mobile/`); assertions should check the same product outcomes (labels, statuses, catalog visibility).
- Use stable **`testID`** values from [ui-design.md](./ui-design.md) Screen ID → testID table for Playwright and Detox selectors.

## Mapping to success criteria

| Criterion | Primary automation |
|-----------|-------------------|
| SC-001 six capability checks | Web Gherkin (full); mobile subset for seeker/lister |
| SC-002 / SC-003 catalog counts | Jest seed invariants + Gherkin smoke |
| SC-004 mobile feel | Detox + Gherkin core flows |
| SC-005 entry path | Web Gherkin |
| SC-006 owner go/no-go | Manual (outside automation) |

## Commands (names locked; scripts land at implement)

```bash
cd apps/ummahHomes
npm run test:unit          # Jest
npm run test:e2e           # Playwright + Gherkin (web)
npm run test:e2e:mobile    # Detox + Gherkin (iOS/Android as configured)
```

## Non-goals

- Paid device clouds unless owner unlocks.
- Replacing `quickstart.md` human demo script (it complements automation).
