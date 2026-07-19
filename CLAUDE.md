# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

RangeX is currently in **alpha**. APIs, types, and engine behavior are subject to breaking changes. Avoid over-engineering for stability or backwards compatibility — prefer clear, direct implementations that can be changed quickly as the project evolves.

## Project overview

RangeX is a rich text editor engine that manages all editor logic: text manipulation, formatting, and embedded components (mentions, links, code blocks, tables, etc.). It is designed to be fully customizable — developers can build any editor-like product on top of it (blog/CMS, chat, forums, real-time collaboration, etc.).

**Before working on any engine-related task** (editorAPI calls, node types, events, selection, schema rules), read `packages/rich-text-editor/docs/RangeX-LLMs.md` — it is the authoritative reference for everything the engine exposes. Do not guess engine behavior from usage patterns when this file is available.

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

Each package has its own `CLAUDE.md` with package-specific guidance.

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

## Architecture

### How the packages connect

The `RichTextEditor` class (`src/Editor/RichTextEditor/RichTextEditor.ts`) is the top-level wiring entry point. Its constructor:
1. Creates a `RichTextEditorUI` Web Component (`src/UI/`), passing the engine element and toolbar button config
2. Calls `editorAPI.subscribeEditorEvent(...)` to react to engine state changes and push them to `richTextEditorUI.updateXxxButtonState(...)`
3. Calls `richTextEditorUI.onXxx(...)` to receive toolbar actions and forward them to `editorAPI`
4. Calls each `configureXxx({ richTextEditorUI, editorAPI })` function to set up individual features

`src/UI/` is imported everywhere else in the package via the `#ui/*` subpath import (`package.json` `imports` field — e.g. `import { RichTextEditorUI } from "#ui/index";`), never via a relative path reaching into `UI/` from outside it.

### rich-text-editor source layout

```
src/
  index.ts               ← Package entry point
  UI/                     ← SolidJS Web Component toolbar/UI layer (imported via #ui/*, see below)
  Editor/                 ← Everything that manages the engine — a future `Ports/` sibling will
                             sit here too once that work lands
    Components/           ← Feature implementations (ConfigureLink, ConfigureTable, etc.)
    BlockComponentPlacement/  ← Utilities for inserting/wrapping block-level nodes
    Configs/               ← FindReplace, SymbolInsertion
    SelectionStyle/        ← Maps engine selection state ↔ toolbar button state
    Styles/                ← CSS injected into the engine via editorAPI.replaceCustomStyles()
    NodeQuery/             ← Stateless DOM traversal helpers (same pattern as engine)
    _Utilities/            ← Toolbar button layout definition
    RichTextEditor/        ← Main wiring entry point
```

Each `Editor/Components/ConfigureXxx` folder wires one editor feature: it subscribes to engine events, handles toolbar button presses, and calls `editorAPI` methods.

### UI layer architecture (`src/UI/`)

A SolidJS app mounted inside a Shadow DOM Web Component (`<rich-text-editor-ui>`). Toolbar state is split into four categories, each with its own state manager: `FormatStyles`, `HistoryNavigation`, `NodeInsertion`, `NonCategorized`. This layer has no dependency on the engine (`rich-text-area`) or on anything in the rest of this package outside itself — it only knows about DOM elements and its own locally-declared callback/state types.

### Engine setup (local dev only)

The engine (`rich-text-area`) is not on npm yet. To develop locally, clone it into `packages/rich-text-area/` — the workspace protocol (`workspace:*`) resolves it automatically. The root gitignore excludes it so it is managed by its own private repository.
