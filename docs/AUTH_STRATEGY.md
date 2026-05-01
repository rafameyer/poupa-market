# Auth Strategy

## Current stance

Authentication is now implemented in Phase 0.4 using Supabase Auth with Google
OAuth.

## What exists today

- `/login` public route with `Continue with Google`
- `/register` public route with onboarding notes
- protected main app routes under `(app)`
- Supabase browser and server clients
- auth callback handling at `/auth/callback`
- logout support
- basic user information in `/settings`

## What comes later

- Apple login if needed
- email magic links if needed
- richer profile and preference data
- cloud sync features beyond authentication

## Core principle

Authentication now protects the main app shell, but the implementation remains
intentionally narrow: no custom profile tables, no grocery CRUD, and no extra
providers beyond Google yet.
