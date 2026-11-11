# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project status

RangeX is currently in **beta** (`1.0.0-beta.N`). APIs, types, and engine behavior can still change in breaking ways between betas. Avoid over-engineering for stability or backwards compatibility — prefer clear, direct implementations that can be changed quickly as the project evolves.

## Project overview

RangeX is a rich text editor engine that manages all editor logic: text manipulation, formatting, and embedded components (mentions, links, code blocks, tables, etc.). It is designed to be fully customizable — developers can build any editor-like product on top of it (blog/CMS, chat, forums, real-time collaboration, etc.).

**Engine types** are in `packages/core/src/PublicTypes/index.ts` (all public types re-exported from a single entry point). In development, packages resolve the engine's types there through the `@rangex/source` condition, so type changes apply without rebuilding the engine. This is a workspace package, not a node_modules dep — check here first rather than inferring types from call sites.

**Engine docs:** before any engine-related task, read `packages/editor/AGENTS.local.md` (local and gitignored, so it may be missing). It gives the path to the engine's handbook, the authoritative reference for engine behavior. When the handbook is available, read it instead of guessing behavior from the engine's code or usage patterns.

This repo (`rangex`) serves three purposes:
1. **Zero-config editor** — `@rangex/rich-text-editor` provides a ready-to-use editor built on the engine with no setup required
2. **Demo** — showcases the engine's capabilities (formatting, components, etc.) so developers can evaluate RangeX before building on it
3. **Reference implementation** — shows developers how to wire the engine to build a custom editor

The engine itself (`@rangex/core`, the "core" package) is closed-source. Most editor features live in this repo, layered on top of it.

## Repository structure

This is a monorepo (npm workspaces) for the RangeX rich text editor project:

| Package | Path | Notes |
|---|---|---|
| `@rangex/core` | `packages/core/` | Closed-source engine — separate private repo, gitignored here, must be cloned separately |
| `@rangex/editor` | `packages/editor/` | Framework-agnostic layer over the engine: adapters, `createEditor`, snapshot/HTML views. The only package that depends on the engine directly; re-exports the engine types other packages need. |
| `@rangex/solid` | `packages/solid/` | SolidJS bindings for `@rangex/editor`: per-extension reactive ports (`ReactivePorts/`) plus shared Solid utilities such as `FloatingPortal`. |
| `@rangex/syntax-highlighter-shiki` | `packages/syntax-highlighter-shiki/` | Shiki-based code block highlighting for the editor (worker) and the HTML view (sync). |
| `@rangex/rich-text-editor` | `packages/rich-text-editor/` | Zero-config editor built on `@rangex/editor` and `@rangex/solid`: extensions, toolbar and floating UI. |

Dependencies are one-way. `@rangex/core` is used only by `@rangex/editor`. `@rangex/solid` extends `@rangex/editor` with Solid bindings — it does not replace it. `@rangex/rich-text-editor` uses both `@rangex/editor` and `@rangex/solid`, and `@rangex/syntax-highlighter-shiki` builds on `@rangex/editor`. Packages built on `@rangex/editor` take it (and Solid, where used) as a peer dependency.

`@rangex/editor` and `@rangex/rich-text-editor` have one entry point per feature (`@rangex/editor/link`, `@rangex/rich-text-editor/code-block`…), defined in each package's `src/Exports/`; the package root only exports what isn't specific to one feature. Import feature exports from their subpath. See `packages/editor/AGENTS.md` for how the entries are set up. All packages are currently `private: true` (pre-release).

The root `index.ts` is a dev harness only — it mounts a `createDevelopmentView()` from the root's own `src/CreateDevelopmentView` (not the package) to preview the full editor, using fixture data from `src/DemoData`. The engine is gitignored at the root (see `.gitignore`) and has its own `.git`.

Some packages have their own `AGENTS.md` / `CLAUDE.md` with package-specific guidance — read it before working in that package.

## Commands

All commands use npm unless noted; scripts run Vite+ (`vp`) for dev, build and tests. Run from the repo root unless a package path is specified.

**Root dev server** (full editor, port 3000):
```bash
npm run dev
```

**Browser checks:** before checking anything in the browser, check whether the dev server is listening on port 3000. If it is not, do not start it yourself — ask the user to start it.

**Build:**
```bash
npm run build           # root: editor, solid, syntax-highlighter-shiki, rich-text-editor, in that order
npm run build           # inside any package directory: that package only (the engine is built this way)
```

Development doesn't need builds: the dev server, lint and type-check read every package's source through the `@rangex/source` condition. Build only to check the published output (`dist/`). Publishing (`npm publish`) builds automatically through `prepublishOnly`.

**Tests** (only the engine has test files; run inside `packages/core`):
```bash
npm run test                        # all tests
npm run test -- <pattern>           # single file by name/path
npm run test:coverage               # with coverage
```

**Lint / type-check:**
```bash
npm run lint           # biome check + tsc (no emit) for the root, then each package's `fix` (biome --write + tsc)
npm run fix            # same, with biome --write for the root too
```

**After any code change:** always run `npm run lint` from the repo root and fix all errors before finishing.
