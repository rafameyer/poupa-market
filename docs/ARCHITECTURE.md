# Architecture

## Overview

Phase 0 uses a Next.js App Router application with route groups to separate public authentication placeholders from the main in-app experience.

## High-level structure

- `src/app`: layouts, pages, loading, error, not-found, and the manifest route
- `src/components`: reusable UI, auth placeholders, and the mobile app shell
- `src/constants`: shared app metadata and navigation configuration
- `src/features`: reserved feature folders for products, markets, prices, lists, and comparison
- `src/lib`: storage abstractions, auth strategy, utility helpers, validations, and PWA helpers
- `src/types`: domain types for future feature implementation

## App shell

The main app routes share a reusable shell with:

- A sticky top header
- A fixed bottom navigation
- Safe-area aware spacing for iPhone and iPad
- A single content container for future feature screens

## Architectural boundaries

- Domain types live outside UI components
- Storage access is abstracted behind an adapter interface
- Auth remains a placeholder strategy until a later sync phase
- PWA setup is intentionally baseline-only in Phase 0
