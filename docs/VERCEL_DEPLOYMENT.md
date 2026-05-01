# Vercel Deployment

## Goal

Deploy PoupaMarket to a public Vercel URL so the app can be tested in Safari on iPhone and iPad as an installable PWA.

## Phase 0.3 scope

This phase prepares deployment and public-device testing only.

It does not add:

- Supabase
- Google login
- CRUD flows
- backend services
- advanced CI/CD

## Why the project is already Vercel-ready

The current project is suitable for Vercel because it uses:

- Next.js App Router
- standard `npm` scripts
- a normal `next build`
- no custom server
- no unsupported deployment assumptions

`next.config.ts` remains intentionally simple in this phase.

## Validate the local scripts

Run these from the project root:

```bash
npm run dev
npm run lint
npm run build
```

Expected result:

- `npm run dev` starts a local development server
- `npm run lint` completes without ESLint errors
- `npm run build` completes successfully

## Connect GitHub repository to Vercel

Repository:

```txt
Owner: rafameyer
Repository: poupa-market
```

Steps:

1. Push the local repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) with your GitHub account.
3. Click `Add New Project`.
4. Choose `Import Git Repository`.
5. Select `rafameyer/poupa-market`.
6. Confirm the framework is detected as `Next.js`.
7. Keep the standard defaults:

```txt
Install command: npm install
Build command: npm run build
Output directory: .next
Development command: npm run dev
```

8. Click `Deploy`.

## Public deployment result

After the deployment succeeds, Vercel provides a public URL such as:

```txt
https://poupa-market-xxxxx.vercel.app
```

That public URL is the address you should test on iPhone and iPad in Safari.

## Future deployments

Once the repository is connected:

- pushes to `main` will create new production deployments by default
- pull requests can create preview deployments later if you choose to use them

Phase 0.3 does not add any advanced deployment automation beyond the default Vercel Git integration.
