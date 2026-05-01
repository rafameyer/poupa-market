# Codex Workflow

## Recommended loop

1. Ask Codex to inspect the current repository first.
2. Ask for a concise implementation plan.
3. Review scope and risks.
4. Implement one focused story at a time.
5. Run or explain verification steps.
6. Review the diff before committing.

## Good task example

Implement the mobile app shell and bottom navigation according to `docs/PHASE_0_FOUNDATION.md`. Do not add CRUD or Supabase.

## Bad task example

Build the entire grocery application end to end.

## Guardrails

- Keep code in TypeScript
- Use App Router conventions
- Keep components small and readable
- Avoid adding out-of-scope business functionality
- Update docs when important decisions change
