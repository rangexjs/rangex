# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
