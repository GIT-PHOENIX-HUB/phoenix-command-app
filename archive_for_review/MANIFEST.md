# archive_for_review — Manifest
**Repo:** phoenix-command-app | **Wave:** B | **Date:** 2026-03-28

## Status
EMPTY — No files moved here during Wave B triage.

## Items Flagged for Shane Review (files remain in place — review needed before any action)

### 1. governance-docs branch — PRODUCT_BIBLE.md + BUILD_DOC.md
These documents are NOT on main. They live only in the remote branch `origin/governance-docs`.
They contain a comprehensive audit of this repo, known issues, and a full roadmap.
Action needed: Shane decides whether to merge the governance-docs branch into main.

### 2. Remote branch: feature/phoenix-apps-hardening-20260322-r2
Exists as a remote branch. Has not been reviewed in this wave. May contain security hardening
changes relevant to Wave 2 security work. Needs review before the JSX-to-TSX cleanup.

### 3. Remote branch: copilot/build-knowledge-builder-feature
Exists as a remote branch. Contains work on the Knowledge Builder feature. Build Doc explicitly
asks Shane whether to merge or abandon this branch. Needs review.

### 4. Remote branch: claude/phoenix-parallel-build-8tcBF
Exists as a remote branch. Origin unknown — likely a parallel build attempt by a prior agent session.
Needs Shane to review and decide: merge, archive, or abandon.

### 5. src/context/AppContext.tsx + src/context/TimerContext.tsx
These context files exist but are NOT imported anywhere in main.tsx or App.tsx (the TSX tree).
They may be stubs from the migration or planned future features. Status unclear.

### 6. src/components/layout/BottomNav.tsx + src/components/layout/Screen.tsx
BottomNav and Screen layout components exist but do not appear to be used in App.tsx.
They may be partially built components awaiting wiring.

## Rule
All items above require Shane review and explicit direction before any action is taken.
