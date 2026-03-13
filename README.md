# React Feature Lab

Low-coupling React feature playground for learning CSS/UI/state libraries (Tailwind, Redux, MobX, Zustand, Recoil, Jotai, Valtio).

## Architecture

- Single root mount (`#root`) for app shell only.
- Feature modules are isolated and self-contained.
- Registry-driven routing/navigation: `src/core/feature-registry.ts`.
- Feature-level providers (`withProviders`) are applied only inside `FeatureHost`.
- Feature pages are lazy-loaded.

## Add a new feature

1. Create `src/features/<your-feature>/index.tsx` and page files.
2. Export a `FeatureModule` object with `EntryComponent` and optional `withProviders`.
3. Register it in `src/core/feature-registry.ts`.

No existing feature needs to be edited.

## Run

```bash
yarn install
yarn dev
```
