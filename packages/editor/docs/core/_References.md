# RangeX Handbook

Authoritative reference for the RangeX rich text editor engine. Read the relevant file below before working on any engine-related task (editorAPI calls, node types, events, selection, schema rules) — do not guess engine behavior from usage patterns when these docs are available.

| # | File | Covers |
|---|---|---|
| 1 | [01-WhatIsRangeX.md](01-WhatIsRangeX.md) | What RangeX is and the core design idea (DOM-based, schema-driven, no virtual DOM) |
| 2 | [02-KeyDefinitions.md](02-KeyDefinitions.md) | Core vocabulary used throughout the rest of the docs — `EditingRoot`, `Non-EditingRoot`, `Outermost X`, `EditorArea`, `EditorZone` |
| 3 | [03-SetupInitialization.md](03-SetupInitialization.md) | Setting up an editor instance — `createEditorAPI`, its params, `rootEditableFrom`, `shadowRootOptions`, accessing `editorAPI`, `destroy()` |
| 4 | [04-EditorNodeTypes.md](04-EditorNodeTypes.md) | Every `EditorNode` kind — `RootEditable`, `NestedEditable`, `ContentLine`, `GlyphFormatter`, `InlineComponent`, `BlockComponent`, text nodes, and every `LayoutUnit` (`List`, `Table`, etc.) — parent/sibling/child types and public `$$` API |
| 5 | [05-CreatingNodes.md](05-CreatingNodes.md) | The `create*` factory functions for building every node type |
| 6 | [06-ReadingTraversing.md](06-ReadingTraversing.md) | Type guards and traversal props for reading and walking the tree |
| 7 | [07-EditorSchema.md](07-EditorSchema.md) | The structural rules the engine enforces — parent/child/sibling constraints, enforcement timing, display modes, content types |
| 8 | [08-Selection.md](08-Selection.md) | `LiveBoundaryPoints`, how native browser selection syncs with it, `EditorSelection`, and `EditorRange` |
| 9 | [09-Snapshots.md](09-Snapshots.md) | `StoredSnapshot`, migrating persisted snapshots (`migrateStoredSnapshot`), `EditorSnapshot`, `SnapshotView`, `SnapshotManager` (converting a snapshot to an editable `Draft` and back, off-DOM), and the full `EditorNodeSnapshot` structural validation spec |
| 10 | [10-Events.md](10-Events.md) | Editor events (`subscribeEditorEvent`, all 9 event types, microtask batching), DOM events (`registerDOMEvent`), and event interception (`registerEventInterceptor`) |
| 11 | [11-SnapshotTimeline.md](11-SnapshotTimeline.md) | The undo/redo system — reading and navigating timeline state, `registerSnapshotBoundary`, session merging, redo branching, `reset`, memory limits |
| 12 | [12-FindReplace.md](12-FindReplace.md) | Find-and-replace: enabling, criteria, scope, navigating matches, replace/replaceAll, listeners |
| 13 | [13-SelectionFormatting.md](13-SelectionFormatting.md) | `updateSelectionStyles`, `StructuredStyleValue`, the `selectionStylesChange` payload shape, and `updateGlyphFormatterInlineTagsOrder` |
| 14 | [14-EditorAPI.md](14-EditorAPI.md) | The full `editorAPI` runtime surface: focus/selection sync, custom styles, external drag, content mutations, plain text reading, wrapping components, replacing a component, creating a persistence snapshot |
