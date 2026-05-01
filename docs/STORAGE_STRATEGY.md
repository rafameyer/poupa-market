# Storage Strategy

## Direction

PoupaMarket is designed as a local-first app. Users should be able to use the MVP without creating an account.

## Phase 0 decision

The UI must not depend directly on `localStorage`, IndexedDB, or Supabase. Instead, all future persistence flows should sit behind a shared adapter interface.

## Adapter contract

`src/lib/storage/storage-adapter.ts` defines:

```ts
export interface StorageAdapter<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
```

## Planned phases

- Phase 1: localStorage-backed MVP persistence
- Phase 2: IndexedDB for stronger offline storage
- Phase 3: Supabase/PostgreSQL for sync

## Current implementation

- A working `LocalStorageAdapter` class exists for future client-side usage
- Shared storage keys are centralized in `storage-keys.ts`
- No CRUD screens use the adapter yet
