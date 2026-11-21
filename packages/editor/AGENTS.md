# AGENTS.md

Guidance for AI coding agents working in `@rangex/editor`. Repo-wide rules and commands are in the root `AGENTS.md`.

## What this package is

The framework-agnostic layer over the RangeX engine (`@rangex/core`), written in plain TypeScript. The engine is its only dependency — don't add others. It talks to the engine's `editorAPI` directly and provides adapters, `createEditor`, and the snapshot/HTML views. It is the only package that depends on the engine; it re-exports the engine types other packages need.

**Before any task, read [`docs/_References.md`](docs/_References.md)** and follow it to the docs relevant to the task.

**Before working on any engine-related task** (editorAPI calls, node types, events, selection, schema rules), read the engine's handbook — it is the authoritative reference for everything the engine exposes. The handbook isn't part of this repo while the engine is closed-source; where it's available, a local, gitignored `AGENTS.local.md` in this package gives its path. Do not guess engine behavior from usage patterns when the handbook is available.

## Public exports (`src/Exports/`)

The package has one entry point per feature plus a root entry:

- `src/Exports/index.ts` is `@rangex/editor`: what isn't specific to one feature (`createEditor`, engine types, types shared by several features). The snapshot tools (views, validation, sanitizer, `getFileSources`) are in `@rangex/editor/snapshot`.
- `src/Exports/<feature>/index.ts` is `@rangex/editor/<feature>`: the feature's adapter factory, its settings type (`<Feature>Settings`) and its other public types. `@rangex/rich-text-editor` mirrors this, with `<Feature>ExtensionSettings` for each extension.

Feature folders in `src/Exports/` are named in kebab-case (`code-block/`, unlike the PascalCase folders elsewhere), because the folder name is the subpath: the single `"./*"` entry in `package.json`'s `exports` maps `@rangex/editor/code-block` to `src/Exports/code-block/`.

Types keep the names they have in the adapter (`InsertParams`, not `LinkInsertParams`); the subpath already says which feature they belong to.

When adding a feature, add its `Exports/<feature>/index.ts`. The `"./*"` export and the Vite build (which reads the folders in `src/Exports/`) pick it up, so nothing else needs registering.
