# Authentication

## Goal

Phase 0.4 adds Google authentication to PoupaMarket using Supabase Auth and the
Next.js App Router.

## What this phase includes

- Supabase browser and server client helpers
- Google OAuth sign-in from `/login`
- an auth callback route at `/auth/callback`
- protected main app routes under `(app)`
- logout support
- a basic authenticated user area in `/settings`

## What this phase does not include

- grocery CRUD
- custom database tables
- payments
- scraping
- additional auth providers beyond Google

## Required environment variables

Create `.env.local` from `.env.example` and set:

```txt
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` comes from your Supabase project settings.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the public client key for browser usage.
- Supabase documentation sometimes uses the term publishable key. For this
  project we keep the requested `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable name.

## Supabase project setup

1. Create or open your Supabase project.
2. Go to `Project Settings` and copy:
   - Project URL
   - anon public key
3. Go to `Authentication`.
4. Open the Google provider configuration screen.

## Google Cloud OAuth setup

Based on Supabase's Google auth documentation, create a Google OAuth client and
configure it for web usage.

### In Google Cloud

1. Open the Google Auth Platform / Google Cloud Console.
2. Create a project if needed.
3. Create a new OAuth Client ID.
4. Choose `Web application`.
5. Under Authorized JavaScript origins add:
   - `http://localhost:3000`
   - your production site origin, for example `https://poupa-market.vercel.app`
6. Under Authorized redirect URIs add your Supabase callback URL:
   - find it in the Supabase Google provider page
   - it is typically `https://<your-project-ref>.supabase.co/auth/v1/callback`
7. Save the Client ID and Client Secret.

Supabase's Google sign-in guide says the Google OAuth client should use your
application origin as an authorized JavaScript origin, and the Supabase auth
callback as the authorized redirect URI.

## Supabase Google provider configuration

In Supabase:

1. Open `Authentication` -> `Providers` -> `Google`.
2. Enable the provider.
3. Paste the Google Client ID.
4. Paste the Google Client Secret.
5. Save the configuration.

## Supabase redirect URL configuration

Supabase's redirect URL guide says the URL passed to `redirectTo` must be
allowed in the project's Redirect URLs list, and production should use exact
paths when possible.

### Local redirect URLs

Add:

```txt
http://localhost:3000/auth/callback
http://localhost:3000/**
```

### Production redirect URLs for Vercel

Add your exact production callback URL, for example:

```txt
https://poupa-market.vercel.app/auth/callback
```

If you use the default Vercel project domain instead of a custom domain, add
that exact callback URL instead.

For preview deployments, Supabase documents a wildcard pattern for Vercel:

```txt
https://*-<team-or-account-slug>.vercel.app/**
```

For the `rafameyer` account, that pattern would typically be:

```txt
https://*-rafameyer.vercel.app/**
```

## Route behavior

Current behavior:

- `/login` is public
- `/register` is public
- `/dashboard`, `/lists`, `/products`, `/markets`, `/prices`, `/compare`, and `/settings` are protected
- unauthenticated users are redirected to `/login`
- authenticated users visiting `/login` are redirected to `/dashboard`

## Login flow

1. User opens `/login`.
2. User clicks `Continue with Google`.
3. Supabase starts the Google OAuth flow.
4. Google redirects back through Supabase.
5. Supabase redirects to `/auth/callback`.
6. The app exchanges the auth code for a session.
7. The user is redirected into the app, usually `/dashboard`.

## Logout flow

The Settings page includes a logout action that signs the user out through
Supabase and returns them to `/login`.
