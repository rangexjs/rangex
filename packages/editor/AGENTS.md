# AGENTS.md

Guidance for AI coding agents working in `@rangex/editor`. Repo-wide rules and commands are in the root `AGENTS.md`.

## What this package is

The framework-agnostic layer over the RangeX engine (`@rangex/core`), written in plain TypeScript. The engine is its only dependency — don't add others. It talks to the engine's `editorAPI` directly and provides adapters, `createEditor`, and the snapshot/HTML views. It is the only package that depends on the engine; it re-exports the engine types other packages need.

**Before any task, read [`docs/_References.md`](docs/_References.md)** and follow it to the docs relevant to the task — `core/` for the engine, `architecture/` for this package.

## Public exports (`src/Exports/`)

The package has one entry point per feature plus a root entry:

- `src/Exports/index.ts` is `@rangex/editor`: what isn't specific to one feature (`createEditor`, the views, engine types, types shared by several features).
- `src/Exports/<Feature>/index.ts` is `@rangex/editor/<feature>` (kebab-case, e.g. `CodeBlock` → `code-block`): the feature's adapter factory and its public types.

Types keep the names they have in the adapter (`InsertParams`, not `LinkInsertParams`); the subpath already says which feature they belong to.

When adding a feature, add its `Exports/<Feature>/index.ts` and a matching `exports` entry in `package.json` (`@rangex/source`, `types`, `import`). The Vite build reads its entries from `exports`, so nothing else needs registering.
