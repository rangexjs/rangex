# RangeX — LLM Reference Documentation

Authoritative reference for the RangeX rich text editor engine. Read the relevant file below before working on any engine-related task (editorAPI calls, node types, events, selection, schema rules) — do not guess engine behavior from usage patterns when these docs are available.

| # | File | Covers |
|---|---|---|
| 1 | [llms/01-WhatIsRangeX.md](llms/01-WhatIsRangeX.md) | What RangeX is and the core design idea (DOM-based, schema-driven, no virtual DOM) |
| 2 | [llms/02-KeyDefinitions.md](llms/02-KeyDefinitions.md) | Core vocabulary used throughout the rest of the docs — `EditingRoot`, `Non-EditingRoot`, `Outermost X`, `EditorArea`, `EditorZone` |
| 3 | [llms/03-SetupInitialization.md](llms/03-SetupInitialization.md) | Setting up an editor instance — `createEditorAPI`, its params, `rootEditableFrom`, `shadowRootOptions`, accessing `editorAPI`, `destroy()` |
| 4 | [llms/04-EditorNodeTypes.md](llms/04-EditorNodeTypes.md) | Every `EditorNode` kind — `RootEditable`, `NestedEditable`, `ContentLine`, `GlyphFormatter`, `InlineComponent`, `BlockComponent`, text nodes, and every `LayoutUnit` (`List`, `Table`, etc.) — parent/sibling/child types and public `$$` API |
| 5 | [llms/05-CreatingNodes.md](llms/05-CreatingNodes.md) | The `create*` factory functions for building every node type |
| 6 | [llms/06-ReadingTraversing.md](llms/06-ReadingTraversing.md) | Type guards and traversal props for reading and walking the tree |
| 7 | [llms/07-EditorSchema.md](llms/07-EditorSchema.md) | The structural rules the engine enforces — parent/child/sibling constraints, enforcement timing, display modes, content types |
| 8 | [llms/08-Selection.md](llms/08-Selection.md) | `LiveBoundaryPoints`, how native browser selection syncs with it, `EditorSelection`, and `EditorRange` |
| 9 | [llms/09-Snapshots.md](llms/09-Snapshots.md) | `StoredSnapshot`, `EditorSnapshot`, `SnapshotView`, `SnapshotManager` (converting a snapshot to an editable `Draft` and back, off-DOM), and the full `EditorNodeSnapshot` structural validation spec |
| 10 | [llms/10-Events.md](llms/10-Events.md) | Editor events (`subscribeEditorEvent`, all 9 event types, microtask batching), DOM events (`registerDOMEvent`), and event interception (`registerEventInterceptor`) |
| 11 | [llms/11-SnapshotTimeline.md](llms/11-SnapshotTimeline.md) | The undo/redo system — reading and navigating timeline state, `registerSnapshotBoundary`, session merging, redo branching, memory limits |
| 12 | [llms/12-FindReplace.md](llms/12-FindReplace.md) | Find-and-replace: enabling, criteria, scope, navigating matches, replace/replaceAll, listeners |
| 13 | [llms/13-SelectionFormatting.md](llms/13-SelectionFormatting.md) | `updateSelectionStyles`, `StructuredStyleValue`, the `selectionStylesChange` payload shape, and `updateGlyphFormatterInlineTagsOrder` |
| 14 | [llms/14-EditorAPI.md](llms/14-EditorAPI.md) | The full `editorAPI` runtime surface: focus/selection sync, custom styles, external drag, content mutations, plain text reading, wrapping components, replacing a component, creating a persistence snapshot |
