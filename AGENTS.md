# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project status

RangeX is currently in **alpha**. APIs, types, and engine behavior are subject to breaking changes. Avoid over-engineering for stability or backwards compatibility — prefer clear, direct implementations that can be changed quickly as the project evolves.

## Project overview

RangeX is a rich text editor engine that manages all editor logic: text manipulation, formatting, and embedded components (mentions, links, code blocks, tables, etc.). It is designed to be fully customizable — developers can build any editor-like product on top of it (blog/CMS, chat, forums, real-time collaboration, etc.).

**Before working on any engine-related task** (editorAPI calls, node types, events, selection, schema rules), read `packages/editor/docs/core/_References.md` — it is the authoritative reference for everything the engine exposes. Do not guess engine behavior from usage patterns when these docs are available.

**Engine types** are in `packages/rich-text-area/dist/index.d.ts` (all types re-exported from a single entry point). This is a workspace package, not a node_modules dep — check here first rather than inferring types from call sites.

This repo (`rangex-dev`) serves three purposes:
1. **Zero-config editor** — `@rangex/rich-text-editor` provides a ready-to-use editor built on the engine with no setup required
2. **Demo** — showcases the engine's capabilities (formatting, components, etc.) so developers can evaluate RangeX before building on it
3. **Reference implementation** — shows developers how to wire the engine to build a custom editor

The engine itself (`rich-text-area`) is closed-source. Most editor features live in this repo, layered on top of it.

## Repository structure

This is a monorepo (Bun workspaces) for the RangeX rich text editor project:

| Package | Path | Notes |
|---|---|---|
| `rich-text-area` | `packages/rich-text-area/` | Close-source engine — separate private repo, gitignored here, must be cloned separately |
| `@rangex/rich-text-editor` | `packages/rich-text-editor/` | Tracked in this repo — wires the engine to the UI; TypeScript feature implementations plus the SolidJS Web Component toolbar/UI layer (`src/UI/`), all in one package. Private, not published. |

The root `index.ts` is a dev harness only — it mounts a `createDevelopmentView()` from the root's own `src/CreateDevelopmentView` (not the package) to preview the full editor, using fixture data from `src/MockDatabase`. The engine is gitignored at the root (see `.gitignore`) and has its own `.git`.

Each package has its own `AGENTS.md` / `CLAUDE.md` with package-specific guidance.

## Commands

All commands use Bun unless noted. Run from the repo root unless a package path is specified.

**Root dev server** (full editor, port 3000):
```bash
bun run dev
```

**Per-package build** (run inside the package directory):
```bash
bun run build           # rich-text-area, rich-text-editor
```

**Tests** (rich-text-area and rich-text-editor — no test files exist yet for the UI layer):
```bash
bun run test                        # all tests
bun run test -- <pattern>           # single file by name/path
bun run test:coverage               # with coverage
```

**Lint / type-check:**
```bash
bun run lint           # biome check + tsc (no emit)
bun run fix            # auto-fix biome issues
```

**After any code change:** always run `bun run lint` from the repo root and fix all errors before finishing.
