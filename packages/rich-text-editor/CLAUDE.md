# CLAUDE.md

## Architecture

This package is mid-migration between two coexisting architectures. New features are built with **Ports → Adapters → Extensions**; most existing features still use an older bus-based pattern. Both are live in production at once — do not assume one has replaced the other.

### The tiers

**`Ports/`** — cross-cutting contract types with no feature-specific implementation.
- `Ports/Components/` — one `*Port.ts` interface per not-yet-migrated feature (`ImagePort`, `VideoPort`, `AudioPort`, ...), describing its state shape plus `onXxx(callback)`/`updateState(...)` signatures. `Ports/Components/_Shared/` holds fragments composed into a Port via `extends` (`UnwrapPort`, `CaptionPort`, `DeletePort`, `BlockAlignPort`) — these stay here regardless of migration status since they're genuinely shared across features. Once a feature migrates to an Adapter (see below), its Port types move out of here and into that Adapter's own folder — `Link`/`Mention` already have (no `LinkPort.ts`/`MentionPort.ts` exist anymore).
- `Ports/Extensions/` — the generic `Extension`/`ExtensionDefinition`/`ExtensionComponents`/`UIExtension` shapes `createExtension` produces, plus `ExtensionsName` — the single constant every extension's `name` must come from (`extensionsName.link`, never the literal `"link"`).
- `Ports/ToolbarButtons/` — `ToolbarButtonsName` (every toolbar button's name/value) and `ToolbarButtonsLayout` (the row/group array `RichTextEditor`'s `toolbarButtons` param takes).
- Exposed package-wide only via `#ports`.

**`Adapters/`** — one class per extension (`LinkAdapter`, `MentionAdapter`), each fully self-contained: its own state types, Port types, and implementation all live in that Adapter's folder (e.g. `Adapters/LinkAdapter/LinkAdapter-types.ts` has everything Link-related — `LinkEditorPort`, `LinkUIPort`, `LinkPopoverState`, the lot). See `Adapters/CLAUDE.md` for the internal mechanics.
- Holds real state (`#toolbarButton`, `#view`, ...) and a `Set` of listeners per state slice, but exposes none of it directly — only through two narrowed accessors.
- `get uiPort()` and `get editorPort()` are two separate, non-overlapping views built fresh on each access. UI components receive `uiPort` (their prop is literally named `uiPort`); Editor-side wiring receives `editorPort` (its param is literally named `editorPort`). Neither side ever sees the raw adapter instance or the other side's members.
- Exposed via `#adapters`.

**`Extensions/`** (top-level, package root) — composes one adapter + its Editor wiring + its UI components into a single opt-in unit via `createExtension(...)`.
- One folder per extension (`Link/`, `Mention/`); calling the exported factory (`Link()`, optionally with settings) returns an `Extension` object: `{ name, createAdapter, configure, components }`.
- Nothing is wired unless it's passed into `RichTextEditor`'s `extensions` array.

**`Editor/`** — everything that drives the engine (`editorAPI`) directly.
- `Editor/RichTextEditor/` — `RichTextEditor`, the `HTMLElement` subclass and top-level wiring entry point. Its constructor mounts `RichTextEditorUI`, resolves each entry in the passed `extensions` array (`createAdapter()`, then `configure({ adapter, editorAPI })` — the one place the full adapter is still touched, to narrow it to `adapter.editorPort` before handing off), and unconditionally calls every `configureXxx({ richTextEditorUI, editorAPI, ... })` for features still on the old path.
- `Editor/Extensions/` — new-architecture Editor wiring for migrated features (`ConfigureLink`, `ConfigureMention`). Each takes `{ editorPort, editorAPI }` — the generic param name is intentional, not `linkPort`/`mentionPort` — never the concrete Adapter. Exposed via `#editor-extensions`.
- `Editor/Components/` — old-architecture Editor wiring for everything not yet migrated (Table, Image, Video, Audio, Embed, CodeBlock, List, TodoList, BlockQuote, TemplateVariable, Emoji). Each takes `{ richTextEditorUI, editorAPI, ... }` directly.
- `Editor/Configs/` — cross-cutting engine wiring that isn't tied to one node feature (FormatStyles, FindReplace, HistoryNavigation, NonCategorizedOperation, SymbolInsertion, CustomStyles) — same old `{ richTextEditorUI, editorAPI }` pattern, not part of the extension migration.
- `Editor/BlockComponentPlacement/`, `Editor/BlockResize/`, `Editor/BlockPopoverAppearanceHandler/` — shared low-level utilities threaded into several `configureXxx` calls.
- `Editor/NodeQuery/` — stateless DOM traversal (see below).
- `Editor/_Utilities/` — default toolbar layout, code block language/theme lists, font family options.

**`UI/`** — the SolidJS Web Component layer: `RichTextEditorUI` (`UI/RichTextEditorUI/`) and everything it renders.
- `UI/Components/Extensions/` — new-architecture components, one folder per extension (`Link/LinkToolbarButton`, `Link/LinkPopover`, `Mention/MentionPopover`). Consumed through an extension's `components` field — never statically imported by `RichTextEditorUI`. Exposed via `#ui-extensions`.
- `UI/Components/ToolbarButtons/`, `UI/Components/NodePopovers/`, `UI/PopoverControllers/` — old-architecture per-feature UI, still statically mounted and unconditionally imported by `RichTextEditorUI`/`App`/`EditorToolbar` for every feature not yet migrated.
- `UI/Components/EditorToolbar/` — resolves each toolbar button slot by checking every active extension's `components.toolbarButtons` map for that slot's name first, falling back to the static per-feature component map otherwise. A toolbar button's name does **not** have to equal its owning extension's name — `toolbarButtons` is a `Record<ToolbarButtonValue, Component<{ uiPort }>>`, so one extension can own several buttons (this exists specifically so a future extension, e.g. a reworked formatting feature, can own `bold`/`italic`/`underline`/... under one adapter's `uiPort`).
- `UI/Constants/`, `UI/CommonTypes/`, `UI/ToolbarButtonsActionManager/`, `UI/ToolbarButtonsStateManager/` — the old toolbar bus (name vocabulary + pub/sub state managers) driving every not-yet-migrated toolbar button. Left untouched by the extension migration on purpose — do not merge these with `Ports/ToolbarButtons/`.
- Exposed via `#ui`.

### Package-internal import aliases

Cross-tier imports must go through the `package.json` `imports` field, never a relative path reaching into another tier's folder from outside it:

| Alias | Points to |
|---|---|
| `#ports` | `src/Ports/index.ts` |
| `#adapters` | `src/Adapters/index.ts` |
| `#editor-extensions` | `src/Editor/Extensions/index.ts` |
| `#ui-extensions` | `src/UI/Components/Extensions/index.ts` |
| `#ui` | `src/UI/index.ts` |

### Wiring a new extension end-to-end

1. Add its name to `Ports/Extensions/ExtensionsName.ts`.
2. Define `XxxEditorPort`, `XxxUiPort`, and every supporting state/listener type in `Adapters/XxxAdapter/XxxAdapter-types.ts` — all of it lives together in the Adapter's own folder, not in `Ports/Components/`.
3. Implement `XxxAdapter` in `Adapters/XxxAdapter/XxxAdapter.ts` — internal state + listeners, `get uiPort(): XxxUiPort` and `get editorPort(): XxxEditorPort` as two separate, non-overlapping narrowed views (see `Adapters/CLAUDE.md`).
4. Write Editor-side wiring in `Editor/Extensions/ConfigureXxx/` — `configureXxx({ editorPort, editorAPI }) => cleanup`.
5. Build UI components in `UI/Components/Extensions/Xxx/` against a prop named `uiPort: XxxUiPort` (not `adapter`).
6. Compose everything with `createExtension({ name: extensionsName.xxx, defaultSettings, createAdapter, configure, components })` in `Extensions/Xxx/Xxx.ts`. `ExtensionComponents<UIPort>` references `UIPort` directly (not indexed off `Adapter`) specifically so this single-call, all-fields-inline shape still infers cleanly — `UIPort`/`EditorPort` are inferred by matching `XxxAdapter`'s actual `uiPort`/`editorPort` property types against the `AdapterBlueprint` constraint, the same reliable mechanism `Adapter` itself already used.
7. Export it from `src/index.ts`. Consumers opt in via `new RichTextEditor({ extensions: [Xxx()] })` — nothing renders or wires up otherwise.

### Caveats

- Only `Link` and `Mention` have migrated. Every other feature (Table, Image, Video, Audio, Embed, CodeBlock, List, TodoList, BlockQuote, TemplateVariable, Emoji, FormatStyles, FindReplace, ...) is still unconditionally constructed inside `RichTextEditor`'s constructor regardless of the `extensions` array — migrating one of them is a large, deliberate task, not a byproduct of unrelated changes.
- Small utilities are duplicated per tier on purpose (e.g. `assertNever` exists separately under `UI/ErrorHandling/`, `Editor/ErrorHandling/`, and `Adapters/_Utilities/ErrorHandling/`), as is toolbar-button vocabulary (`Ports/ToolbarButtons/ToolbarButtonsName.ts` vs. the older `UI/Constants/ToolbarButtonsName.ts`). This is intentional — migrating a feature should never risk breaking the untouched old path.
- Sibling Adapters/PopoverControllers must not import types from one another, even when nearly identical — duplicate instead.
- There is currently no validation that a `toolbarButtons` layout entry referencing an extension-owned name actually has a matching extension present — an unmatched name silently renders nothing rather than throwing.

---

## Commenting Style

This repository is open-source. Comments are written for end users — developers reading and potentially modifying the source code. Good comments:
- Explain **why** a constraint exists or what a behavior means, not just what the code does
- Engine-specific terms (`$$display`, `"block multi-line"`, etc.) are fine to use — they will be covered by engine documentation and users are expected to know them
- Describe the contract: what is guaranteed, and what will throw
