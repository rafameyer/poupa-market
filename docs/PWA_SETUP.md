# PWA Setup

## Phase 0 baseline

The repository includes the minimum foundation needed for a manually installable Safari PWA on iPhone and iPad:

- `src/app/manifest.ts`
- App metadata in the root layout
- Public icon references
- Apple touch icon support
- Theme color and background color
- Standalone display mode
- Portrait orientation preference
- Safe-area aware mobile layout

## Important limitation

Phase 0 does not include:

- A service worker
- Offline caching
- Push notifications

This is intentional. The current goal is installability and a clean architecture, not offline-first behavior yet.

## Test on iPhone or iPad

1. Deploy the app to Vercel.
2. Open the deployed URL in Safari.
3. Tap Share.
4. Tap `Add to Home Screen`.
5. Open PoupaMarket from the Home Screen.
6. Verify standalone launch and bottom navigation behavior.
