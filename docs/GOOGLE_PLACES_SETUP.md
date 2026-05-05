# Google Places Setup

PoupaMarket uses Google Maps Platform for the Phase 2 nearby markets foundation.
The browser asks for the user's location, but Google API calls run through
Next.js API routes so the Maps API key stays server-side.

## Required APIs

Enable these APIs in the same Google Cloud project:

- Places API (New)
- Geocoding API

Do not enable unrelated Google APIs unless a future story needs them.

## Environment Variable

Add this variable locally and in Vercel:

```txt
GOOGLE_MAPS_API_KEY=your-server-side-google-maps-api-key
```

Do not prefix this variable with `NEXT_PUBLIC_`. A `NEXT_PUBLIC_` key is bundled
into browser JavaScript, which is not appropriate for this implementation.

## Local Setup

1. Open `.env.local`.
2. Add `GOOGLE_MAPS_API_KEY`.
3. Restart the local dev server after changing the env file.
4. Run:

```bash
npm run dev
```

5. Sign in with Google.
6. Open `/markets`.
7. Click `Use current location` or search manually by city, neighborhood, or postcode.

## Vercel Setup

1. Open the Vercel project.
2. Go to `Settings` > `Environment Variables`.
3. Add `GOOGLE_MAPS_API_KEY`.
4. Select the environments where nearby markets should work:
   `Production`, `Preview`, and optionally `Development`.
5. Redeploy after adding the variable.

## Google Cloud Key Restrictions

Recommended restrictions:

- Restrict the key to the required APIs: `Places API (New)` and `Geocoding API`.
- Because this key is used server-side by Vercel and local development, avoid
  browser HTTP referrer restrictions for this specific server key.
- If you later add a client-side map widget, create a separate browser key with
  HTTP referrer restrictions for `localhost` and the Vercel production domain.

If an API key was shared in chat, screenshots, or a public place, rotate it in
Google Cloud before using it in production.

## How It Works

- `/markets` asks the browser for geolocation only after the user clicks the
  button.
- If location permission is denied, the user can enter a manual location.
- `/api/places/geocode` converts the manual location into coordinates using
  Google Geocoding.
- `/api/places/nearby` searches Google Places for supermarkets and grocery
  stores within the selected radius.
- Favorite markets are saved locally by `place_id`, not by display name.

## Testing Checklist

- [ ] User is signed in.
- [ ] `/markets` loads without breaking existing navigation.
- [ ] Clicking `Use current location` prompts for location permission.
- [ ] Denying permission shows the manual location fallback.
- [ ] Manual location search returns nearby supermarkets.
- [ ] Radius changes trigger a new search when a location is already saved.
- [ ] Market cards show name, address, distance, rating, and opening state when available.
- [ ] Favorite and unfavorite works.
- [ ] Favorites persist after refreshing the page.
- [ ] Missing `GOOGLE_MAPS_API_KEY` shows a helpful setup state.

## iPhone and iPad Testing

For local testing on the same Wi-Fi network:

1. Start the dev server on the Mac:

```bash
npm run dev
```

2. Open the network URL shown by Next.js, for example:

```txt
http://192.168.x.x:3000
```

3. Sign in.
4. Open `/markets`.
5. Test both Safari location permission and manual search.

For deployed testing:

1. Deploy to Vercel with `GOOGLE_MAPS_API_KEY` configured.
2. Open the public Vercel URL in Safari.
3. Sign in and open `/markets`.
4. Test location permission, manual fallback, radius changes, and favorites.

## Known Limitations

- This phase does not search prices.
- This phase does not compare markets.
- Favorites are still local-first and are not synced to Supabase yet.
- Distance is calculated as straight-line distance, not driving distance.
- Opening hours and ratings depend on what Google Places returns for each market.
