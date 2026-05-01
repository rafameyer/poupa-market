# iPhone and iPad Testing

## Goal

Verify that the deployed PoupaMarket app can be opened from a public Vercel URL and added to the Home Screen from Safari.

## Preconditions

Before testing on a device:

- the app must be deployed to Vercel
- the deployment must have a public HTTPS URL
- the latest deployment should load correctly in desktop testing first

## Open the deployed app in Safari

1. On iPhone or iPad, open Safari.
2. Visit the public Vercel URL for PoupaMarket.
3. Wait for the home screen to load fully.
4. Navigate through the main routes.

Recommended screens to test:

- `/dashboard`
- `/lists`
- `/compare`
- `/markets`
- `/settings`
- `/login`
- `/register`

## Add to Home Screen

1. While viewing the deployed app in Safari, tap the Share button.
2. Scroll down and tap `Add to Home Screen`.
3. Check that the title shown is `PoupaMarket`.
4. Confirm the icon preview looks correct.
5. Tap `Add`.

## Launch from the Home Screen

1. Locate the new PoupaMarket icon on the Home Screen.
2. Tap the icon to open the app.
3. Confirm that it opens as a standalone app experience rather than a normal Safari tab.

## What to verify

- The app opens from the Vercel URL without errors.
- The app can be added from Safari to the Home Screen.
- The icon and title look correct.
- The app opens in standalone mode from the Home Screen.
- The bottom navigation is visible and tappable.
- The header clears the top safe area cleanly.
- The bottom navigation clears the home indicator safely.
- The app remains usable without login.

## PWA testing checklist

- [ ] Public Vercel URL opens in Safari
- [ ] Dashboard loads successfully
- [ ] Bottom navigation works across main routes
- [ ] Login and register placeholders load
- [ ] Add to Home Screen option is available in Safari
- [ ] App icon and app name look correct in the install preview
- [ ] App launches from the Home Screen
- [ ] App appears in standalone mode
- [ ] Safe-area spacing looks correct on iPhone
- [ ] Safe-area spacing looks correct on iPad
- [ ] No Supabase or real auth is required
- [ ] No CRUD behavior was introduced by this phase
