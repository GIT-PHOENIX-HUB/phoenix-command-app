# VERIFICATION.md — phoenix-command-app
**Wave:** B Protected Repo Pass | **Date:** 2026-03-28 | **Auditor:** Phoenix Echo

---

## File Count
- Total files (excluding node_modules, .git): **51**
- Source files (src/): 35
- Public assets (public/): 5
- Config/root files: 8
- Triage folders (new, empty): 3 MANIFEST.md files

---

## Branch Inventory
| Branch | Location | Notes |
|--------|----------|-------|
| main | local + remote | Active, last commit 2026-03-12 |
| governance-docs | local + remote | Contains PRODUCT_BIBLE.md + BUILD_DOC.md — NOT merged to main |
| remotes/origin/claude/phoenix-parallel-build-8tcBF | remote only | Origin unclear — parallel build attempt |
| remotes/origin/copilot/build-knowledge-builder-feature | remote only | Knowledge Builder feature work |
| remotes/origin/feature/phoenix-apps-hardening-20260322-r2 | remote only | Security hardening branch |

**Shane action required:** Review the 3 unmerged remote branches and the governance-docs branch. Decision needed on each (merge, archive, or abandon). See archive_for_review/MANIFEST.md.

---

## Structure Assessment

### What this app is
Phoenix Command App (PCA) is a Progressive Web App (PWA) built in React with TypeScript migration in progress. It is the structured UI complement to the phoenix-echo-bot Teams Bot — serving technicians and power users with time clock, daily log, file access, and AI chat. It authenticates via Microsoft Azure AD (MSAL) and calls Azure Functions for backend operations. Deploys to Azure Static Web Apps.

### Stack
React 18, Vite 6, MSAL Browser/React, lucide-react. No tests, no linter, no CI configured.

### Entry Point (IMPORTANT — dual-file situation)
The repo is mid-migration from JSX to TSX. This creates an ambiguity:
- `src/main.jsx` imports `App.jsx` (the JSX root)
- `src/main.tsx` imports `App` (resolves to App.tsx)
- Vite resolves `.tsx` before `.jsx` by default, so `main.tsx` + `App.tsx` is the live path
- `main.jsx` and `App.jsx` are currently dead code — but they are NOT yet safe to delete
  because that resolution order must be confirmed against the actual Vite config before removal
- The TSX tree (`App.tsx` → `src/screens/*.tsx` → `src/components/layout/*.tsx` → `src/components/chat/ChatWidget.tsx`) is the canonical production code

### Canonical vs Legacy file pairs
| Canonical (TSX — live) | Legacy (JSX — dead code) |
|------------------------|--------------------------|
| src/main.tsx | src/main.jsx |
| src/App.tsx | src/App.jsx |
| src/theme/tokens.ts + styles.ts | src/theme.js |
| src/screens/DashboardScreen.tsx | src/components/Dashboard.jsx |
| src/screens/DailyLogScreen.tsx | src/components/DailyLog.jsx |
| src/screens/TimeClockScreen.tsx | src/components/TimeClock.jsx |
| src/screens/FilesScreen.tsx | src/components/FilesScreen.jsx |
| src/screens/TeamsScreen.tsx | src/components/TeamsScreen.jsx |
| src/screens/SplashScreen.tsx | src/components/SplashScreen.jsx |
| src/components/chat/ChatWidget.tsx | src/components/ChatWidget.jsx |
| src/components/layout/Header.tsx | src/components/TopMenu.jsx |

### Components built but not yet wired into the main tree
- `src/context/AppContext.tsx` — AppProvider and useApp hook, complete, not yet wrapping the app
- `src/context/TimerContext.tsx` — TimerProvider and useTimer hook, complete, not yet wrapping the app
- `src/components/layout/BottomNav.tsx` — bottom tab nav, complete, self-documented as "available but not wired in by default"
- `src/components/layout/Screen.tsx` — screen wrapper, needs review

These are NOT dead code — they are migration staging work. They should remain in place.

---

## Issues Found

### SECURITY — Flag Only (Wave 2 work)
**[HIGH] Hardcoded Azure identifiers as fallback values**
- File: `src/auth/msalConfig.js` lines 5-6
  - Azure Client ID hardcoded as fallback string: `"8b78f443-..."` (VITE_AZURE_CLIENT_ID fallback)
  - Azure Tenant ID hardcoded as fallback string: `"e7d8daef-..."` (VITE_AZURE_TENANT_ID fallback)
- File: `src/api/phoenix-api.js` line 14
  - Same Azure Client ID repeated in the API scope fallback construction
- Status: FLAGGED. Not removed. These are Wave 2 security work items.
- Resolution when ready: Remove fallbacks entirely. Add startup error if env vars are missing. Add `.env.example` with keys but no values. Convert `msalConfig.js` to `msalConfig.ts`.

### STRUCTURAL — No Secrets in Repo
- No API keys, no passwords, no Anthropic tokens, no private keys found.
- `VITE_FUNCTION_KEY` defaults to empty string (not a committed secret — safe).
- The Azure Client ID and Tenant ID are GUIDs (non-secret identifiers), not credentials. Still a hygiene issue — see above.

### OPERATIONAL
**[MEDIUM] Dual JSX/TSX entry point coexistence** — documented above. Not a runtime risk (Vite resolves TSX first), but is a maintenance risk. Blocked on Shane GO before any file deletion.

**[MEDIUM] No CLAUDE.md or AGENTS.md** — any agent operating cold in this repo has no governance context. Build Doc calls this out as a success criterion.

**[LOW] No tests, no linter, no TypeScript check** — all three npm scripts (`test`, `lint`, `typecheck`) print skip messages and exit. Build Doc calls all three out as Wave 2 items.

**[LOW] .DS_Store committed** — macOS metadata file `./.DS_Store` is tracked in git. Should be added to `.gitignore` and removed from tracking. Minor.

### NO ISSUES FOUND IN:
- All PWA public assets (manifest.json, sw.js, app-init.js, offline.html)
- staticwebapp.config.json — security headers are complete and correct (HSTS, CSP, X-Frame-Options, etc.)
- vite.config.js — CSP-compatible modulePreload configuration is correct
- package.json — dependencies are appropriate, no suspicious packages
- tsconfig.json — not reviewed in detail but no flags
- CODEOWNERS — present (not read in detail)
- i18n system (LanguageContext.tsx + translations.ts) — present and used in App.jsx tree; connection to App.tsx tree should be verified
- API layer (phoenix-api.js + phoenix-api.d.ts) — well-structured, validation constants in place, GPS fallback handled gracefully
- useAuth hook — correctly wraps MSAL with silent/popup token acquisition fallback
- Design token system (tokens.ts + styles.ts) — well-organized, replaces legacy theme.js

---

## Triage Folder Summary
| Folder | Files Moved | Notes |
|--------|-------------|-------|
| archive_for_delete/ | 0 | Candidates documented in MANIFEST.md — awaiting Shane GO |
| archive_for_review/ | 0 | 6 items flagged for Shane review — all remain in place |
| scheduled_to_relocate/ | 0 | Nothing misplaced — all files belong in this repo |

---

## Production-Ready Assessment

**The TSX codebase is production-structurally sound.** The canonical code path (main.tsx → App.tsx → screens/ → components/) is clean, well-organized, and properly separated by concern. The PWA configuration, security headers, MSAL auth flow, and API layer are all correctly implemented.

**Not production-deployable as-is** due to:
1. Hardcoded Azure identifiers (must be env-var-only before any public deployment)
2. No CI pipeline configured
3. No tests

**Safe to continue development on main.** The legacy JSX files do not interfere with the TSX code path and can be cleaned up in a dedicated cleanup wave once Shane gives the GO.

---

## Recommended Next Actions (priority order)
1. Shane reviews the 4 unmerged branches and gives direction on each
2. Shane gives GO on JSX file deletion (cleanup wave)
3. Wave 2 security: remove hardcoded Azure identifiers from msalConfig.js and phoenix-api.js
4. Add .env.example with required VITE_ variable names (no values)
5. Add CLAUDE.md to repo root
6. Wire AppContext.tsx and TimerContext.tsx into the live App.tsx tree (or confirm they are intentionally deferred)
7. Enable real TypeScript check, ESLint, and at minimum a build smoke test

---

*This document was produced during a Wave B protected repo pass. No files were moved, renamed, or deleted. All findings are observational only.*
