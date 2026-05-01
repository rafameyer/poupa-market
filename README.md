# PoupaMarket

PoupaMarket is a mobile-first Progressive Web App for planning grocery shopping lists and estimating savings across nearby markets.

## Project Status

Phase 0 foundation is implemented. The repository currently provides the app shell, routes, PWA baseline, placeholder auth pages, storage abstraction, domain types, and documentation needed for future phases.

## Repository Information

- GitHub owner: `rafameyer`
- Repository name: `poupa-market`
- Repository URL: [https://github.com/rafameyer/poupa-market](https://github.com/rafameyer/poupa-market)
- Default branch: `main`

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Progressive Web App manifest setup
- Vercel-ready deployment flow
- Local-first storage foundation with Supabase planned later

## Getting Started

### Prerequisites

- Node.js 20 LTS or newer
- npm 10 or newer

Check your versions:

```bash
node -v
npm -v
```

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Lint

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

### Run the production build locally

```bash
npm start
```

## Open in VS Code

From the terminal:

```bash
cd poupa-market
code .
```

If `code` is not available on macOS:

1. Open VS Code.
2. Press `Cmd + Shift + P`.
3. Run `Shell Command: Install 'code' command in PATH`.
4. Reopen the terminal.
5. Run `code .`.

Recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitHub Copilot
- GitHub Pull Requests

## Deploy to Vercel

### Option A: GitHub import

1. Push the repository to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Click `Add New Project`.
4. Import the `poupa-market` repository.
5. Select the GitHub repository `rafameyer/poupa-market`.
6. Confirm the framework is detected as `Next.js`.
7. Keep the default Next.js settings:

```txt
Install command: npm install
Build command: npm run build
Output directory: .next
Development command: npm run dev
```

8. Deploy.
9. Open the public Vercel URL after the deployment finishes.

### Connect GitHub to Vercel

1. Push the repository to GitHub under `rafameyer/poupa-market`.
2. Sign in to [Vercel](https://vercel.com/) with GitHub.
3. Allow Vercel access to the `rafameyer` account or the specific repository.
4. In Vercel, choose `Add New Project`.
5. Import `rafameyer/poupa-market`.
6. Confirm the default Next.js build settings.
7. Deploy.
8. Future pushes to `main` will create new production deployments by default.

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

## Install on iPhone or iPad

After deployment:

1. Open the deployed URL in Safari.
2. Tap Share.
3. Tap `Add to Home Screen`.
4. Confirm the app name `PoupaMarket`.
5. Launch the app from the Home Screen.
6. Verify the app opens without normal Safari browser chrome.

Phase 0 includes the manifest, icon references, theme color, and standalone display settings needed for manual Safari installation. Offline support and service workers are intentionally deferred.

## PWA Testing Checklist

- [ ] The deployed Vercel URL opens successfully in Safari.
- [ ] `/dashboard` loads without errors on iPhone and iPad.
- [ ] The app icon and app name look correct in the Add to Home Screen preview.
- [ ] The app launches from the Home Screen in standalone mode.
- [ ] The bottom navigation remains visible and usable.
- [ ] Safe-area spacing looks correct around the notch and home indicator.
- [ ] The loading, error, and not-found states still render cleanly.
- [ ] The app works without any login requirement.
- [ ] No out-of-scope features such as Supabase, Google login, or CRUD were introduced.

## Folder Structure

```txt
public/
  icons/               App icons for the PWA manifest
  screenshots/         Reserved for install/store screenshots
src/
  app/                 App Router layouts, route groups, pages, and metadata routes
  components/          App shell, auth placeholders, and UI primitives
  constants/           Shared app and navigation constants
  features/            Reserved feature modules for future phases
  hooks/               Reserved custom hooks
  lib/                 Storage, auth strategy, utilities, validations, and PWA helpers
  types/               Core domain types
docs/                  Product, architecture, routing, storage, PWA, auth, and workflow docs
.github/               Copilot instructions and PR template
```

## Development Workflow

1. Inspect the existing code and docs before changing behavior.
2. Plan small, scoped stories.
3. Implement one focused improvement at a time.
4. Run `npm run lint` and `npm run build`.
5. Review the diff before committing.

The repository is designed to work well with Codex and Copilot, but the project should still evolve through small, reviewable tasks rather than one large prompt.

## Recommended Branch Strategy

- Keep `main` stable and deployable.
- Create short-lived feature branches for focused work, such as `feat/lists-crud` or `fix/pwa-metadata`.
- Open a pull request back into `main` for every non-trivial change.
- Merge small, reviewable increments instead of large batches of work.

## Available npm Scripts

- `npm run dev` starts the Next.js development server with Turbopack.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint across the project.

## Additional Documentation

- [docs/PRODUCT_SCOPE.md](./docs/PRODUCT_SCOPE.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/PHASE_0_FOUNDATION.md](./docs/PHASE_0_FOUNDATION.md)
- [docs/ROUTING.md](./docs/ROUTING.md)
- [docs/STORAGE_STRATEGY.md](./docs/STORAGE_STRATEGY.md)
- [docs/PWA_SETUP.md](./docs/PWA_SETUP.md)
- [docs/AUTH_STRATEGY.md](./docs/AUTH_STRATEGY.md)
- [docs/CODEX_WORKFLOW.md](./docs/CODEX_WORKFLOW.md)
- [docs/GITHUB_SETUP.md](./docs/GITHUB_SETUP.md)
- [docs/VERCEL_DEPLOYMENT.md](./docs/VERCEL_DEPLOYMENT.md)
- [docs/IPHONE_IPAD_TESTING.md](./docs/IPHONE_IPAD_TESTING.md)
- [docs/LOCAL_DEVELOPMENT.md](./docs/LOCAL_DEVELOPMENT.md)
