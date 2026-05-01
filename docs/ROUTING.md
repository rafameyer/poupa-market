# Routing

## Route groups

- `src/app/(auth)`: public authentication placeholder screens
- `src/app/(app)`: main in-app experience

## Public routes

- `/login`
- `/register`

## Main routes

- `/dashboard`
- `/lists`
- `/products`
- `/markets`
- `/prices`
- `/compare`
- `/settings`

## Root route

- `/` redirects to `/dashboard`

## Navigation model

The bottom navigation currently exposes:

- Home
- Lists
- Compare
- Markets
- Settings

`/products` and `/prices` exist as pages but are intentionally hidden from the initial bottom navigation.
