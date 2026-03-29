# scheduled_to_relocate — Manifest
**Repo:** phoenix-command-app | **Wave:** B | **Date:** 2026-03-28

## Status
EMPTY — No files scheduled for relocation during Wave B triage.

## Rationale
All files in phoenix-command-app belong in this repo. There are no misplaced documents,
no gateway content, no LEDGER entries, and no files that belong in a different repo.

The repo correctly contains:
- Source code only (src/, public/)
- Config files (package.json, tsconfig.json, vite.config.js)
- One README

Nothing identified that belongs elsewhere.

## Future Consideration
If the governance-docs branch (PRODUCT_BIBLE.md + BUILD_DOC.md) is merged to main,
those documents stay in this repo — they are repo-level governance documents, not Gateway content.
This is correct per the "Gateway is not storage" hard rule.
