# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

RangeX is a rich text editor engine that manages all editor logic: text manipulation, formatting, and embedded components (mentions, links, code blocks, tables, etc.). It is designed to be fully customizable — developers can build any editor-like product on top of it (blog/CMS, chat, forums, real-time collaboration, etc.).

**Before working on any engine-related task** (editorAPI calls, node types, events, selection, schema rules), read `packages/rich-text-editor/docs/RangeX-LLMs.md` — it is the authoritative reference for everything the engine exposes. Do not guess engine behavior from usage patterns when this file is available.

**Engine types** are in `packages/rich-text-area/dist/index.d.ts` (all types re-exported from a single entry point). This is a workspace package, not a node_modules dep — check here first rather than inferring types from call sites.

This repo (`rangex-dev`) serves three purposes:
1. **Zero-config editor** — `@rangex/rich-text-editor` + `@rangex/rich-text-editor-ui` provide a ready-to-use editor built on the engine with no setup required
2. **Demo** — showcases the engine's capabilities (formatting, components, etc.) so developers can evaluate RangeX before building on it
3. **Reference implementation** — shows developers how to wire the engine to build a custom editor

The engine itself (`rich-text-area`) is closed-source. Most editor features live in this repo, layered on top of it.

## Repository structure

This is a monorepo (Bun workspaces) for the RangeX rich text editor project:

| Package | Path | Notes |
|---|---|---|
| `rich-text-area` | `packages/rich-text-area/` | Close-source engine — separate private repo, gitignored here, must be cloned separately |
| `@rangex/rich-text-editor` | `packages/rich-text-editor/` | Tracked in this repo — wires the engine to the UI; TypeScript feature implementations |
| `@rangex/rich-text-editor-ui` | `packages/rich-text-editor-ui/` | Tracked in this repo — SolidJS Web Component toolbar/UI library, published to npm |

The root `index.ts` is a dev harness only — it mounts a `createDevelopmentView()` from `@rangex/rich-text-editor` to preview the full editor. The engine is gitignored at the root (see `.gitignore`) and has its own `.git`.

Each package has its own `CLAUDE.md` with package-specific guidance.

## Commands

All commands use Bun unless noted. Run from the repo root unless a package path is specified.

**Root dev server** (full editor, port 3000):
```bash
bun run dev
```

**rich-text-editor-ui dev server** (isolated UI, port 3300):
```bash
cd packages/rich-text-editor-ui && npm run dev
```

**Per-package build** (run inside the package directory):
```bash
bun run build          # rich-text-area, rich-text-editor
npm run build          # rich-text-editor-ui
```

**Tests** (rich-text-area and rich-text-editor only — rich-text-editor-ui has no tests):
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

**After touching exported types in `rich-text-editor-ui`:** run `npm run build` inside `packages/rich-text-editor-ui/` first (to rebuild the dist types), then run `bun run lint`. The `rich-text-editor` package resolves the UI package through its built dist, so type changes are not visible to the linter until the package is rebuilt.

## Architecture

### How the packages connect

`createRichTextEditor({ rangeX })` in `rich-text-editor` is the top-level wiring function. It:
1. Creates a `RichTextEditorUI` Web Component (from `rich-text-editor-ui`), passing the engine element and toolbar button config
2. Calls `editorAPI.subscribeEditorEvent(...)` to react to engine state changes and push them to `richTextEditorUI.updateXxxButtonState(...)`
3. Calls `richTextEditorUI.onXxx(...)` to receive toolbar actions and forward them to `editorAPI`
4. Calls each `configureXxx({ richTextEditorUI, editorAPI })` function to set up individual features

### rich-text-editor source layout

```
src/
  Components/          ← Feature implementations (ConfigureLink, ConfigureTable, etc.)
  BlockComponentPlacement/  ← Utilities for inserting/wrapping block-level nodes
  Configs/             ← FindReplace, SymbolInsertion
  SelectionStyle/      ← Maps engine selection state ↔ toolbar button state
  Styles/              ← CSS injected into the engine via editorAPI.replaceCustomStyles()
  NodeQuery/           ← Stateless DOM traversal helpers (same pattern as engine)
  _Utilities/          ← Toolbar button layout definition
  CreateRichTextEditor/ ← Main wiring entry point
  CreateDevelopmentView/ ← Dev harness only
```

Each `Components/ConfigureXxx` folder wires one editor feature: it subscribes to engine events, handles toolbar button presses, and calls `editorAPI` methods.

### rich-text-editor-ui architecture

A SolidJS app mounted inside a Shadow DOM Web Component (`<rich-text-editor-ui>`). Toolbar state is split into four categories, each with its own state manager: `FormatStyles`, `HistoryNavigation`, `NodeInsertion`, `NonCategorized`. See `packages/rich-text-editor-ui/CLAUDE.md` for full detail.

### Engine setup (local dev only)

The engine (`rich-text-area`) is not on npm yet. To develop locally, clone it into `packages/rich-text-area/` — the workspace protocol (`workspace:*`) resolves it automatically. The root gitignore excludes it so it is managed by its own private repository.
