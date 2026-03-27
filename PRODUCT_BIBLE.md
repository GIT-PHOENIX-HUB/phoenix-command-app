# Product Bible — phoenix-command-app
**Owner:** GIT-PHOENIX-HUB | **Last Updated:** 2026-03-27

## Purpose
Phoenix Command App (PCA) is the power-user web interface for Phoenix Electric. It is a Progressive Web App (PWA) built in React + TypeScript that gives technicians, foremen, and office staff a mobile-first dashboard for time clock management, daily work log submission, file access, and AI-assisted job queries. It connects to the Phoenix Gateway (phoenix-echo-bot) via Azure Functions, uses Microsoft Azure AD (MSAL) for authentication, and is designed to install on phones as a native-feeling app. It is the front-door complement to the Teams Bot — the Bot serves field techs conversationally, PCA serves power users with structured UI.

## Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Browser (PWA / SPA) | — |
| Framework | React | ^18.3.1 |
| Language | TypeScript + JSX (migration in progress) | — |
| Build | Vite | ^6.0.5 |
| Auth | Azure AD via MSAL Browser + MSAL React | ^4.27.0 / ^3.0.23 |
| Icons | lucide-react | ^0.468.0 |
| Test | None configured | — |
| Lint | None configured | — |
| CI/CD | None configured in this repo | — |
| Deploy Target | Azure Static Web Apps (staticwebapp.config.json present) | — |

## Architecture
The app is a single-page application with MSAL authentication wrapping the entire component tree. `src/main.tsx` is the canonical entry point — it initializes the MSAL `PublicClientApplication`, handles redirect callbacks, and mounts the root component inside `MsalProvider`. `src/App.tsx` holds all top-level state (current screen, clock state, chat messages, daily log data) and passes it down to screen components. Navigation is screen-based (not router-based) — `currentScreen` state drives which screen component renders.

```
phoenix-command-app/
├── index.html                      Vite SPA root
├── vite.config.js                  Vite build config (output: dist/, port 5173)
├── package.json                    Package manifest (phoenix-command, v0.1.0)
├── tsconfig.json                   TypeScript config
├── public/
│   ├── manifest.json               PWA manifest (name: Phoenix Command, theme: #FF1A1A)
│   ├── staticwebapp.config.json    Azure Static Web Apps routing + CSP headers
│   ├── sw.js                       Service worker (offline support)
│   ├── app-init.js                 App initialization script
│   └── offline.html                Offline fallback page
└── src/
    ├── main.tsx                    Canonical entry point — MSAL init + app mount
    ├── main.jsx                    Legacy JSX entry (pre-migration artifact)
    ├── App.tsx                     Root component — all top-level state + screen routing
    ├── App.jsx                     Legacy JSX root (pre-migration artifact)
    ├── index.css                   Global styles
    ├── theme.js                    Legacy theme (superseded by theme/)
    ├── types/
    │   └── index.ts                TypeScript interfaces (Screen, Job, TimeEntry, DailyLogEntry, etc.)
    ├── auth/
    │   ├── msalConfig.js           MSAL config — clientId, tenantId, scopes (reads from VITE_ env vars)
    │   └── msalConfig.d.ts         Type declarations for msalConfig
    ├── hooks/
    │   └── useAuth.ts              Auth hook — wraps useMsal, exposes login/logout/getApiToken
    ├── api/
    │   ├── phoenix-api.js          API client — calls Azure Functions for clock, log, AI, GPS
    │   └── phoenix-api.d.ts        Type declarations
    ├── context/
    │   ├── AppContext.tsx           App-level context
    │   └── TimerContext.tsx         Timer state context (clock tracking)
    ├── theme/
    │   ├── tokens.ts               Design tokens — colors, spacing, typography, gradients, shadows
    │   └── styles.ts               Shared style utilities
    ├── i18n/
    │   ├── LanguageContext.tsx      Language context provider (EN/ES)
    │   └── translations.ts         EN + ES translation strings
    ├── screens/                    TSX screen components (canonical, post-migration)
    │   ├── SplashScreen.tsx        Login / unauthenticated landing
    │   ├── DashboardScreen.tsx     Home dashboard — hours, jobs, overview
    │   ├── TimeClockScreen.tsx     Clock in/out with GPS verification
    │   ├── DailyLogScreen.tsx      Daily work log form submission
    │   ├── FilesScreen.tsx         SharePoint file access
    │   └── TeamsScreen.tsx         Teams integration / quick contacts
    └── components/                 Shared + legacy components
        ├── chat/
        │   └── ChatWidget.tsx      Floating AI chat widget (all screens)
        ├── layout/
        │   ├── Header.tsx          App header with user info + logout
        │   ├── BottomNav.tsx       Bottom navigation bar
        │   └── Screen.tsx          Screen wrapper component
        ├── DailyLog.jsx            Legacy daily log (pre-migration)
        ├── Dashboard.jsx           Legacy dashboard (pre-migration)
        ├── TimeClock.jsx           Legacy time clock (pre-migration)
        ├── FilesScreen.jsx         Legacy files (pre-migration)
        ├── TeamsScreen.jsx         Legacy teams (pre-migration)
        ├── SplashScreen.jsx        Legacy splash (pre-migration)
        ├── ChatWidget.jsx          Legacy chat widget (pre-migration)
        ├── TopMenu.jsx             Legacy top menu
        └── LanguageToggle.jsx      Language switcher (EN/ES)
```

## Auth & Security
Authentication uses Microsoft Azure AD via the MSAL browser library. The app registers as a Single Page Application (SPA) under the Phoenix Mail Courier app registration in Phoenix Electric's Azure AD tenant. On load, MSAL is initialized with redirect URI set to `window.location.origin`. Login uses popup with redirect fallback. Tokens are stored in `sessionStorage` (not `localStorage`) for SPA security. The `useAuth` hook handles silent token acquisition with popup fallback for consent/interaction-required errors.

**Known credential issue:** `src/auth/msalConfig.js` contains Azure Client ID and Tenant ID as hardcoded fallback strings when the corresponding `VITE_` environment variables are not set. These values are also duplicated in `src/api/phoenix-api.js` as a fallback for the API scope construction. Both identifiers are committed to the repository. While these are non-secret GUIDs (not passwords or tokens), they identify the tenant and app registration and should be treated as environment-only values. See Known Issues below.

Secrets management: no raw secrets, passwords, or API keys are committed. API calls to Azure Functions require a bearer token acquired via MSAL. The `VITE_FUNCTION_KEY` env var is the mechanism for Azure Function key authentication — it defaults to empty string if not set. The Azure Static Web Apps config (`staticwebapp.config.json`) enforces HTTPS, HSTS, CSP, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` at the hosting layer.

## Integrations
| Integration | Purpose | Method |
|-------------|---------|--------|
| Azure AD (MSAL) | User authentication and identity | MSAL Browser OAuth 2.0 PKCE |
| Azure Functions | Backend API for clock, daily log, AI queries | REST — bearer token via MSAL |
| Microsoft Graph API | User profile (`/me`) | MSAL token, scope: `User.Read` |
| Phoenix Gateway (phoenix-echo-bot) | AI assistant responses | Via Azure Functions intermediary |
| Service Fusion | Job schedule and customer data | Via Phoenix Gateway / Azure Functions |
| SharePoint | File access (job drawings, documents) | Via Azure Functions / Graph API |
| GPS (browser) | Clock in/out location verification | Browser Geolocation API |
| Azure Static Web Apps | Hosting + CDN + routing | `staticwebapp.config.json` |

## File Structure
| Path | Purpose |
|------|---------|
| `src/main.tsx` | Canonical entry point — MSAL init, app mount |
| `src/App.tsx` | Root component — top-level state, screen routing |
| `src/auth/msalConfig.js` | MSAL config — reads from `VITE_AZURE_CLIENT_ID`, `VITE_AZURE_TENANT_ID`, `VITE_API_SCOPE` |
| `src/hooks/useAuth.ts` | Auth hook — login, logout, token acquisition |
| `src/api/phoenix-api.js` | API client — clock in/out, daily log submit, AI query, GPS |
| `src/types/index.ts` | TypeScript domain types — Screen, Job, TimeEntry, DailyLogEntry, etc. |
| `src/theme/tokens.ts` | Design token source of truth — colors, spacing, typography, gradients, shadows |
| `src/i18n/translations.ts` | EN + ES translation strings |
| `src/screens/` | Six TSX screen components (canonical post-migration) |
| `src/components/` | Shared layout components (TSX) + legacy JSX components awaiting migration |
| `public/staticwebapp.config.json` | Azure Static Web Apps routing rules, CSP headers, security headers |
| `public/manifest.json` | PWA manifest — name, icons, theme color, shortcuts |
| `public/sw.js` | Service worker — offline caching |
| `vite.config.js` | Vite build config — output dir, CSP-compatible modulePreload |

## Current State
- **Status:** SEMI-ACTIVE — last commit 2026-03-12, 15 days ago at time of audit
- **Last Commit:** `52c1654` — `fix(TX-E001/E002): correct Mac Studio RAM spec 192GB → 96GB in README` (2026-03-12)
- **Open PRs:** None at time of audit
- **Open Branches:** 3 remote branches — `claude/phoenix-parallel-build-8tcBF`, `copilot/build-knowledge-builder-feature`, `feature/phoenix-apps-hardening-20260322-r2`
- **Known Issues:**
  - **[HIGH] Hardcoded Azure identifiers as fallback values** — `src/auth/msalConfig.js` and `src/api/phoenix-api.js` both contain Azure Client ID and Tenant ID as hardcoded string fallbacks when `VITE_` environment variables are absent. These GUIDs are committed to the repo. Fix: remove fallbacks entirely, make the env vars required, and fail fast at startup if missing. Do NOT commit the actual values to this doc.
  - **[MEDIUM] Dual JSX/TSX entry point coexistence** — Both `src/main.jsx` and `src/main.tsx` exist, as do `src/App.jsx` and `src/App.tsx`. The TSX versions are canonical but the JSX files remain. This creates ambiguity about which file is authoritative and risks future edits targeting the wrong file.
  - **[MEDIUM] No CLAUDE.md or AGENTS.md** — No agent governance document exists in this repo. Any AI agent operating cold has no instructions about repo conventions, standards, or constraints.
  - **[LOW] No tests configured** — `test` script outputs a skip message. No unit, integration, or E2E test infrastructure.
  - **[LOW] No linter configured** — `lint` script skips. No ESLint, Prettier, or equivalent enforcing code quality.
  - **[LOW] TypeScript check disabled** — `typecheck` script skips despite TSX migration being in progress. TypeScript errors will not be caught in CI.

## Branding & UI
| Token | Value | Usage |
|-------|-------|-------|
| Primary (Phoenix Red) | `#FF1A1A` | Buttons, header, active states, PWA theme color |
| Accent (Gold) | `#D4AF37` | Secondary actions, avatar badges, premium indicators |
| Background | `#0a0a0a` | App background (near-black) |
| Surface | `#1a1a1a` | Card and panel backgrounds |
| Text | `#FFFFFF` | Primary text |
| Success | `#00C9A7` | Clock-in state, positive indicators |
| Danger | `#EF4444` | Clock-out state, error indicators |
| Font (Body) | Inter, system-ui, sans-serif | All body copy |
| Font (Display) | Cinzel, Georgia, serif | Headers and splash text |

PWA manifest: `short_name: Phoenix`, `display: standalone`, `orientation: portrait-primary`. Shortcuts defined for Clock In/Out and Daily Log for home-screen launch.

## Action Log
| Hash | Date | Description |
|------|------|-------------|
| 52c1654 | 2026-03-12 | fix: correct Mac Studio RAM spec in README (TX-E001/E002) |
| a3e520d | 2026-03-12 | Merge PR #2 — Copilot i18n Spanish support |
| fca9c65 | 2026-03-12 | Address review feedback: signature validation, i18n placeholders, qty type, API schema |
| 59f6008 | 2026-03-12 | Add .gitignore to exclude node_modules and dist |
| ae7602b | 2026-03-12 | Add i18n Spanish support + enhanced Daily Log paper form |
| 4fdc438 | — | Initial plan |
| c754afe | — | Add Phoenix Multi-User AI Vision as README |
| c5709c0 | — | Initial commit: Phoenix Command App |

## Key Milestones
| Date | Milestone |
|------|-----------|
| 2026-03-01 | Phoenix Multi-User AI Vision approved — README becomes the product spec |
| 2026-03-12 | i18n Spanish support added + Daily Log form enhanced |
| 2026-03-12 | TSX migration completed for screens + layout components |
| 2026-03-12 | .gitignore added (node_modules, dist) |
| 2026-03-27 | Product Bible + Build Doc authored — governance established |
