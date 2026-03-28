# Build Doc — phoenix-command-app
**Owner:** GIT-PHOENIX-HUB | **Last Updated:** 2026-03-27

## Objectives
1. Close out the JSX-to-TSX migration — remove legacy dual-entry-point ambiguity and establish `main.tsx` + `App.tsx` as the sole canonical entry points.
2. Remove all hardcoded Azure identifiers from source code — env vars only, fail fast at startup if missing.
3. Add tooling baseline: ESLint, TypeScript check, and at minimum a smoke-test script so CI has something to enforce.
4. Ship the Knowledge Builder page — the one feature explicitly listed in the vision doc as a PCA addition (SDK agent, 30-second cold start).
5. Add CLAUDE.md agent governance document so any AI agent operating in this repo has context.

## End State
A production-ready PWA that:
- Has a single canonical entry point (`main.tsx` / `App.tsx`), fully TypeScript, no JSX/TSX coexistence
- Reads all Azure identifiers from environment variables with no hardcoded fallbacks
- Passes `tsc --noEmit`, ESLint, and a basic smoke test in CI (GitHub Actions)
- Includes the Knowledge Builder screen (calls Phoenix Gateway SDK agent)
- Includes the billing verification / job progress dashboard for Shane and Stephanie
- Deploys cleanly to Azure Static Web Apps via CI
- Has CLAUDE.md in the repo root for agent governance

## Stack Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth | Azure AD (MSAL) — keep | Existing, working, aligned with M365 org |
| Build | Vite — keep | Fast, modern, already configured |
| Language | TypeScript — complete migration | TSX screens are done; JSX legacy files should be removed |
| Icons | lucide-react — keep | Lightweight, consistent |
| State management | React built-in (useState/useContext) — keep | App is simple enough; no Redux needed |
| Hosting | Azure Static Web Apps — keep | staticwebapp.config.json already in place, CSP configured |
| Backend | Azure Functions — keep | Already wired; phoenix-api.js targets this |
| Testing | Vitest (to be added) | Native Vite integration, no Jest config overhead |
| Linting | ESLint + TypeScript rules (to be added) | Close the code quality gap |

## Architecture Targets
**Short term (cleanup):**
- Delete `src/main.jsx`, `src/App.jsx`, `src/theme.js`, and all legacy component JSX files once TSX equivalents are confirmed complete and in use. Archive copies if needed before deletion.
- `src/auth/msalConfig.js` → `src/auth/msalConfig.ts`. Remove the hardcoded Client ID and Tenant ID fallback strings. Throw an explicit startup error if `VITE_AZURE_CLIENT_ID` or `VITE_AZURE_TENANT_ID` are not set.
- Same fix in `src/api/phoenix-api.js` — remove the hardcoded Client ID from the API scope fallback construction.

**Medium term (features):**
- Add `src/screens/KnowledgeBuilderScreen.tsx` — calls the Knowledge Builder SDK agent through the Phoenix Gateway. Surface: trigger button, progress indicator (30-sec cold start), lesson output display with deep-dive prompt capability.
- Add `src/screens/BillingDashboardScreen.tsx` — job progress vs. billing verification view (for Shane and Stephanie). Pulls daily log data, flags discrepancies between billed quantities and logged quantities.
- Add `src/screens/PerformanceScreen.tsx` — tech performance data (for Shane/Stephanie view) and personal data view (for the tech themselves). Transparent, no surprises.

**Long term (platform):**
- Voice input in the ChatWidget — browser `SpeechRecognition` API for hands-free log entry and AI queries.
- Push notifications via service worker — morning briefing, clock-out reminder, goal check-in.
- Service Fusion integration surface in the app — job status, customer lookup from PCA directly.

## Success Criteria
- [ ] `npm run typecheck` passes with zero errors (real `tsc --noEmit`, not a skip echo)
- [ ] `npm run lint` passes with zero errors (real ESLint, not a skip echo)
- [ ] `npm test` executes at least one smoke test and passes
- [ ] No hardcoded Azure Client ID or Tenant ID in any source file
- [ ] `src/main.jsx` and `src/App.jsx` deleted (or archived) — `main.tsx` is the sole entry
- [ ] Knowledge Builder screen exists and calls Phoenix Gateway SDK agent
- [ ] CLAUDE.md exists in repo root
- [ ] Deploy to Azure Static Web Apps via GitHub Actions CI pipeline

## Dependencies & Blockers
| Dependency | Status | Owner |
|-----------|--------|-------|
| Azure Functions backend (phoenix-command-func) | Unknown — not in this repo | Shane |
| Phoenix Gateway (phoenix-echo-bot) — for AI and Knowledge Builder | Active | GIT-PHOENIX-HUB |
| Azure Static Web Apps deployment slot | Exists (config present) — deploy pipeline not yet automated | Shane |
| VITE_ environment variables set in deployment environment | Not verified | Shane |
| Knowledge Builder SDK agent (in phoenix-echo-bot) | Needs confirmation of endpoint | GIT-PHOENIX-HUB |

## Change Process
All changes to this repository follow the Phoenix Electric governance model:

1. **Branch:** Create feature branch from `main`
2. **Develop:** Make changes with clear, atomic commits
3. **PR:** Open pull request with description of changes
4. **Review:** Required approval from `@GIT-PHOENIX-HUB/humans-maintainers`
5. **CI:** All status checks must pass (when configured)
6. **Merge:** Squash merge to `main`
7. **No force push.** No direct commits to `main`. No deletion without `guardian-override-delete` label.

## NEEDS SHANE INPUT
- **Azure Functions backend:** What is the current deployment state of `phoenix-command-func`? Is it live and accepting requests, or is this a planned backend? Needed to unblock full end-to-end testing.
- **Azure Static Web Apps deployment:** Is there a target Static Web App slot already provisioned? What is the deployment URL? Needed to wire up CI/CD.
- **VITE_ env var delivery:** How are `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`, and `VITE_API_SCOPE` delivered in production and in local dev? A `.env.example` file should be added to the repo documenting required env vars (without values).
- **JSX deletion authorization:** Confirm GO to delete the legacy `.jsx` files once Shane reviews the TSX equivalents. No deletion without explicit GO — archive policy applies.
- **Knowledge Builder priority:** Is the Knowledge Builder screen the next feature to build in PCA, or does the billing dashboard take priority?
- **Copilot branch `build-knowledge-builder-feature`:** This remote branch exists. Should it be reviewed and merged, or abandoned?
- **Hardening branch `feature/phoenix-apps-hardening-20260322-r2`:** This remote branch exists across multiple repos. What is its status? Does it contain changes that should be merged into `main` for this repo?
