# Auth Strategy

## Phase 0 stance

Authentication is intentionally not implemented in this phase.

## What exists today

- `/login` placeholder UI
- `/register` placeholder UI
- A shared auth route group and layout
- `src/lib/auth/auth-strategy.ts` to document the intended direction

## What comes later

- Supabase Auth
- Apple login
- Google login
- Email magic links
- Cloud sync between iPhone and iPad

## Core principle

The MVP should remain usable without requiring login. Authentication is expected to become important once cross-device sync is introduced.
