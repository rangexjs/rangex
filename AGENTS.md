# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project status

RangeX is currently in **alpha**. APIs, types, and engine behavior are subject to breaking changes. Avoid over-engineering for stability or backwards compatibility — prefer clear, direct implementations that can be changed quickly as the project evolves.

## Project overview

RangeX is a rich text editor engine that manages all editor logic: text manipulation, formatting, and embedded components (mentions, links, code blocks, tables, etc.). It is designed to be fully customizable — developers can build any editor-like product on top of it (blog/CMS, chat, forums, real-time collaboration, etc.).

**Before working on any engine-related task** (editorAPI calls, node types, events, selection, schema rules), read `packages/editor/docs/core/_References.md` — it is the authoritative reference for everything the engine exposes. Do not guess engine behavior from usage patterns when these docs are available.

**Engine types** are in `packages/core/dist/index.d.ts` (all types re-exported from a single entry point). This is a workspace package, not a node_modules dep — check here first rather than inferring types from call sites.

This repo (`rangex-dev`) serves three purposes:
1. **Zero-config editor** — `@rangex/rich-text-editor` provides a ready-to-use editor built on the engine with no setup required
2. **Demo** — showcases the engine's capabilities (formatting, components, etc.) so developers can evaluate RangeX before building on it
3. **Reference implementation** — shows developers how to wire the engine to build a custom editor

The engine itself (`@rangex/core`, the "core" package) is closed-source. Most editor features live in this repo, layered on top of it.

## Repository structure

This is a monorepo (Bun workspaces) for the RangeX rich text editor project:

| Package | Path | Notes |
|---|---|---|
| `@rangex/core` | `packages/core/` | Closed-source engine — separate private repo, gitignored here, must be cloned separately |
| `@rangex/editor` | `packages/editor/` | Framework-agnostic layer over the engine: adapters, `createEditor`, snapshot/HTML views. The only package that depends on the engine directly; re-exports the engine types other packages need. |
| `@rangex/solid` | `packages/solid/` | SolidJS bindings for `@rangex/editor`: per-extension reactive ports (`ReactivePorts/`) plus shared Solid utilities such as `FloatingPortal`. |
| `@rangex/syntax-highlighter-shiki` | `packages/syntax-highlighter-shiki/` | Shiki-based code block highlighting for the editor (worker) and the HTML view (sync). |
| `@rangex/rich-text-editor` | `packages/rich-text-editor/` | Zero-config editor built on `@rangex/editor` and `@rangex/solid`: extensions, toolbar and floating UI. |

Dependencies are one-way. `@rangex/core` is used only by `@rangex/editor`. `@rangex/solid` extends `@rangex/editor` with Solid bindings — it does not replace it. `@rangex/rich-text-editor` uses both `@rangex/editor` and `@rangex/solid`, and `@rangex/syntax-highlighter-shiki` builds on `@rangex/editor`. Packages built on `@rangex/editor` take it (and Solid, where used) as a peer dependency. All packages are currently `private: true` (pre-release).

The root `index.ts` is a dev harness only — it mounts a `createDevelopmentView()` from the root's own `src/CreateDevelopmentView` (not the package) to preview the full editor, using fixture data from `src/MockDatabase`. The engine is gitignored at the root (see `.gitignore`) and has its own `.git`.

Some packages have their own `AGENTS.md` / `CLAUDE.md` with package-specific guidance — read it before working in that package.

## Commands

All commands use Bun unless noted. Run from the repo root unless a package path is specified.

**Root dev server** (full editor, port 3000):
```bash
bun run dev
```

**Browser checks:** before checking anything in the browser, check whether the dev server is listening on port 3000. If it is not, do not start it yourself — ask the user to start it.

**Per-package build** (run inside the package directory):
```bash
bun run build           # core, rich-text-editor
```

**Tests** (core and rich-text-editor — no test files exist yet for the UI layer):
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
