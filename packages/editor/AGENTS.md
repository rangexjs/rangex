# AGENTS.md

Guidance for AI coding agents working in `@rangex/editor`. Repo-wide rules and commands are in the root `AGENTS.md`.

## What this package is

The framework-agnostic layer over the RangeX engine (`rich-text-area`), written in plain TypeScript. The engine is its only dependency — don't add others. It talks to the engine's `editorAPI` directly and provides adapters, `createEditor`, and the snapshot/HTML views. It is the only package that depends on the engine; it re-exports the engine types other packages need.

**Before any task, read [`docs/_References.md`](docs/_References.md)** and follow it to the docs relevant to the task — `core/` for the engine, `architecture/` for this package.
