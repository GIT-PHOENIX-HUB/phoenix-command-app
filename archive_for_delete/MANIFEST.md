# archive_for_delete — Manifest
**Repo:** phoenix-command-app | **Wave:** B | **Date:** 2026-03-28

## Status
EMPTY — No files moved here during Wave B triage.

## Rationale
Nothing in this repo is safe to delete without Shane's explicit GO.
The legacy JSX files (src/App.jsx, src/main.jsx, src/theme.js, src/components/*.jsx)
are the primary delete candidates identified during audit, BUT they are pre-migration
artifacts that App.jsx is still directly imported in main.jsx (main.jsx imports App.jsx,
not App.tsx). Until the entry point is fully cut over to main.tsx, these cannot be deleted.

## Candidate Files for Future Deletion (requires Shane GO + Wave 2 security work complete)
- src/App.jsx — legacy JSX root (superseded by App.tsx, but still imported by main.jsx)
- src/main.jsx — legacy JSX entry (superseded by main.tsx, but vite.config.js may resolve it first)
- src/theme.js — legacy theme file (superseded by src/theme/tokens.ts + src/theme/styles.ts)
- src/components/DailyLog.jsx — legacy, superseded by src/screens/DailyLogScreen.tsx
- src/components/Dashboard.jsx — legacy, superseded by src/screens/DashboardScreen.tsx
- src/components/TimeClock.jsx — legacy, superseded by src/screens/TimeClockScreen.tsx
- src/components/FilesScreen.jsx — legacy, superseded by src/screens/FilesScreen.tsx
- src/components/TeamsScreen.jsx — legacy, superseded by src/screens/TeamsScreen.tsx
- src/components/SplashScreen.jsx — legacy, superseded by src/screens/SplashScreen.tsx
- src/components/ChatWidget.jsx — legacy, superseded by src/components/chat/ChatWidget.tsx
- src/components/TopMenu.jsx — legacy, superseded by src/components/layout/Header.tsx

## Rule
NOTHING moves here without Shane's explicit GO. Archive first, delete never without confirmation.
