# Phase 0 Foundation

## Objective

Phase 0 creates the technical base for PoupaMarket without implementing business CRUD, real authentication, or the comparison engine.

## Delivered in this phase

- Fresh Next.js project with App Router, TypeScript, Tailwind CSS, ESLint, `src/`, and `@/*`
- Route groups for public auth and main app screens
- Mobile-first app shell with bottom navigation
- Placeholder pages for dashboard, lists, products, markets, prices, compare, settings, login, and register
- Root loading, error, and not-found states
- PWA manifest and icon references
- Core domain types
- Storage adapter interface and local storage adapter skeleton
- English documentation and repository guidance

## Not delivered in this phase

- CRUD flows
- Real persistence UI
- Supabase setup
- Real auth
- OCR, scraping, or payments

## Acceptance criteria status

- AC1 through AC21 are covered in the repository structure and source files.
- AC22 and AC23 should be validated with `npm run dev`, `npm run lint`, and `npm run build`.
- AC24 is satisfied by keeping all business logic placeholders only.
