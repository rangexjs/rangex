# CLAUDE.md

## Architecture

This package is mid-migration between two coexisting architectures. New features are built with **Ports → Adapters → Extensions**; most existing features still use an older bus-based pattern. Both are live in production at once — do not assume one has replaced the other.

### The tiers

**`Ports/`** — cross-cutting contract types with no feature-specific implementation.
- `Ports/Extensions/` — the generic `Extension`/`ExtensionDefinition`/`ExtensionComponents`/`UIExtension` shapes `createExtension` produces, plus `ExtensionsName` — the single constant every extension's `name` must come from (`extensionsName.link`, never the literal `"link"`).
- `Ports/ToolbarButtons/` — `ToolbarButtonsName` (every toolbar button's name/value) and `ToolbarButtonsLayout` (the row/group array `RichTextEditor`'s `toolbarButtons` param takes).
- Exposed package-wide only via `#ports`.

**`Adapters/`** — one class per extension (`LinkAdapter`, `MentionAdapter`, `FormattingAdapter`), each fully self-contained: its own state types, Port types, and implementation all live in that Adapter's folder (e.g. `Adapters/LinkAdapter/LinkAdapter-types.ts` has everything Link-related — `LinkEditorPort`, `LinkUIPort`, `LinkState`, the lot). See `Adapters/CLAUDE.md` for the internal mechanics.
- Holds real state (`#toolbarButton`, `#view`, ...) and a `Set` of listeners per state slice, but exposes none of it directly — only through two narrowed accessors.
- `get uiPort()` and `get editorPort()` are two separate, non-overlapping views built fresh on each access. UI components receive `uiPort` (their prop is literally named `uiPort`); Editor-side wiring receives `editorPort` (its param is literally named `editorPort`). Neither side ever sees the raw adapter instance or the other side's members.
- `Adapters/_Utilities/SharedPorts/` holds fragments composed into an Adapter's `EditorPort`/`UIPort` via `extends` (`UnwrapPort`, `CaptionPort`, `DeletePort`, `BlockAlignPort`) — genuinely shared across features, so they live outside any single Adapter's folder.
- Exposed via `#adapters`.

**`Extensions/`** (top-level, package root) — composes one adapter + its Editor wiring + its UI components into a single opt-in unit via `createExtension(...)`.
- One folder per extension (`Link/`, `Mention/`); calling the exported factory (`Link()`, optionally with settings) returns an `Extension` object: `{ name, createAdapter, configure, components }`.
- Nothing is wired unless it's passed into `RichTextEditor`'s `extensions` array.

**`Editor/`** — everything that drives the engine (`editorAPI`) directly.
- `Editor/Extensions/` — new-architecture Editor wiring for migrated features (`ConfigureLink`, `ConfigureMention`). Each takes `{ editorPort, editorAPI }` — the generic param name is intentional, not `linkPort`/`mentionPort` — never the concrete Adapter. Exposed via `#editor-extensions`.
- `Editor/Components/` — old-architecture Editor wiring for everything not yet migrated (Table, Image, Video, Audio, Embed, CodeBlock, List, TodoList, BlockQuote, TemplateVariable, Emoji). Each takes `{ richTextEditorUI, editorAPI, ... }` directly.
- `Editor/Configs/` — cross-cutting engine wiring that isn't tied to one node feature (NonCategorizedOperation, CustomStyles) — same old `{ richTextEditorUI, editorAPI }` pattern, not part of the extension migration.
- `Editor/MenuBar/` — old-path wiring for the menu bar (`ConfigureView`, `ConfigurePreview`, `ConfigureTemplate`, `ConfigureSettings`), same `{ richTextEditorUI, editorAPI }` pattern.
- `Editor/BlockComponentPlacement/`, `Editor/BlockResize/`, `Editor/BlockPopoverAppearanceHandler/` — shared low-level utilities threaded into several `configureXxx` calls.
- `Editor/NodeQuery/` — stateless DOM traversal (see below).
- `Editor/_Utilities/` — code block language/theme lists, font family options, and other cross-feature helpers.
- Exposed via `#editor` (only `Configs`, `MenuBar`, and `_Utilities` are barreled — `Editor/Extensions/` keeps its own narrower `#editor-extensions` alias).

**`UI/`** — the SolidJS Web Component layer: `RichTextEditorUI` (`UI/RichTextEditorUI/`) and everything it renders.
- `UI/Components/Extensions/` — new-architecture components, one folder per extension (`Link/LinkToolbarButton`, `Link/LinkPopover`, `Mention/MentionPopover`). Consumed through an extension's `components` field — never statically imported by `RichTextEditorUI`. Exposed via `#ui-extensions`.
- `UI/Components/ToolbarButtons/`, `UI/Components/NodePopovers/`, `UI/PopoverControllers/` — old-architecture per-feature UI, still statically mounted and unconditionally imported by `RichTextEditorUI`/`App`/`EditorToolbar` for every feature not yet migrated.
- `UI/Components/EditorToolbar/` — resolves each toolbar button slot by checking every active extension's `components.toolbarButtons` map for that slot's name first, falling back to the static per-feature component map otherwise. A toolbar button's name does **not** have to equal its owning extension's name — `toolbarButtons` is a `Record<ToolbarButtonValue, Component<{ uiPort }>>`, so one extension can own several buttons under one adapter's `uiPort`. `Formatting` is the first case of this: it will eventually own `bold`/`italic`/`underline`/... all 17 format-related buttons, but currently only owns `bold` (see caveat below) — each button it doesn't yet own must stay out of `StaticToolbarButtonValue`'s exclusion until that button actually migrates, or the static map entry becomes dead.
- `UI/Constants/` — old name vocabulary (`MenuBarButtonsName`, `ToolbarButtonsName`). Do not merge with `Ports/ToolbarButtons/`, the new-architecture equivalent every migrated extension actually reads its name from.
- Exposed via `#ui`.

**`RichTextEditor/`** (top-level, package root — a peer of `Ports/`/`Adapters/`/`Editor/`/`UI/`/`Extensions/`, not nested under any of them) — the composition root: `RichTextEditor`, the `HTMLElement` subclass and the package's actual public entry point (`new RichTextEditor({ extensions: [...] })`, exported from `src/index.ts`). It's the one tier allowed to import from every other tier — gluing them all together is its entire job, so it isn't bound by the "cross-tier imports only through an alias" rule the way a feature inside Editor/ or UI/ is. Its constructor mounts `RichTextEditorUI` (`#ui`), builds each extension's Adapter and narrows it to `adapter.editorPort` via `configure({ adapter, editorAPI })`, and unconditionally calls every old-path `configureXxx({ richTextEditorUI, editorAPI, ... })` (`#editor`) for features not yet migrated.
- `RichTextEditor/BuildUIPorts/` walks each constructed Adapter instance's concrete class (`instanceof`) to fill in `UIPortsContextValue` for the UI layer — has to run here, before adapters get narrowed down to `uiExtensions`, and imports `UIPortsContextValue` straight from `#ui` (legal specifically because this tier is exempt from the Editor/UI split).
- `RichTextEditor/_Utilities/` — the default toolbar layout. Lives here rather than `Editor/_Utilities/` since `RichTextEditor.ts` is its only consumer.
- `RichTextEditor/CreateRangeX/` — builds the engine's `RangeX`/`editorAPI` instance from an optional `storedSnapshot`.
- Reached from `src/index.ts` via a plain relative import (`./RichTextEditor`) — no alias of its own yet, since nothing inside another tier needs to import from it.

### Package-internal import aliases

Cross-tier imports must go through the `package.json` `imports` field, never a relative path reaching into another tier's folder from outside it:

| Alias | Points to |
|---|---|
| `#ports` | `src/Ports/index.ts` |
| `#adapters` | `src/Adapters/index.ts` |
| `#editor` | `src/Editor/index.ts` |
| `#editor-extensions` | `src/Editor/Extensions/index.ts` |
| `#ui-extensions` | `src/UI/Components/Extensions/index.ts` |
| `#ui` | `src/UI/index.ts` |

### Wiring a new extension end-to-end

1. Add its name to `Ports/Extensions/ExtensionsName.ts`.
2. Define `XxxEditorPort`, `XxxUiPort`, and every supporting state/listener type in `Adapters/XxxAdapter/XxxAdapter-types.ts` — all of it lives together in the Adapter's own folder, not in `Ports/Components/`.
3. Implement `XxxAdapter` in `Adapters/XxxAdapter/XxxAdapter.ts` — internal state + listeners, `get uiPort(): XxxUiPort` and `get editorPort(): XxxEditorPort` as two separate, non-overlapping narrowed views (see `Adapters/CLAUDE.md`).
4. Write Editor-side wiring in `Editor/Extensions/ConfigureXxx/` — `configureXxx({ editorPort, editorAPI }) => cleanup`.
5. Build UI components in `UI/Components/Extensions/Xxx/`. A popover/overlay component owned directly by the Adapter (mounted via `createOverlayMount` in the Adapter's own constructor, e.g. `LinkPopover`, `MentionPopover`) still takes `uiPort: XxxUiPort` as a prop — it's 1:1 with its Adapter by construction, no ambiguity possible. A toolbar-button component (anything registered under `components.toolbarButtons`) instead reads its port through `useUIPortsContext()` (`UI/Components/App/App.tsx`) and throws if the field is null — add the extension's field to `UIPortsContextValue` there and to the `instanceof` chain in `RichTextEditor/BuildUIPorts/BuildUIPorts.ts`. This is what lets `customComponent` (or any other slot) have more than one owning extension, which a `uiPort` prop threaded through `EditorToolbar`'s single-owner `Dynamic` resolution can't express.
6. Compose everything with `createExtension({ name: extensionsName.xxx, defaultSettings, createAdapter, configure, components })` in `Extensions/Xxx/Xxx.ts`. `ExtensionComponents<UIPort>` still parameterizes over `UIPort` (toolbar-button components structurally satisfy it despite taking no props — a function assignable to a slot promising fewer props than it declares needing is unsound, but the reverse — a function that takes no props slotted where `Component<{ uiPort }>` is expected — is exactly what TypeScript allows, since it's free to ignore the prop) — this keeps `UIPort`/`EditorPort` inferring from `XxxAdapter`'s actual `uiPort`/`editorPort` property types against the `AdapterBlueprint` constraint, unchanged from before.
7. Export it from `src/index.ts`. Consumers opt in via `new RichTextEditor({ extensions: [Xxx()] })` — nothing renders or wires up otherwise.

### Caveats

- `Link`, `Mention`, `Formatting`, `UndoRedo`, `Symbols`, and `FindReplace` have migrated. Every other feature (Table, Image, Video, Audio, Embed, CodeBlock, List, TodoList, BlockQuote, TemplateVariable, Emoji, ...) is still unconditionally constructed inside `RichTextEditor`'s constructor regardless of the `extensions` array — migrating one of them is a large, deliberate task, not a byproduct of unrelated changes.
- `Formatting` is a partial migration, not a finished one: `FormattingAdapter` models all 17 format-style state slices (its Editor-side wiring receives all 17 in one payload per selection-change event regardless), but only `BoldToolbarButton` has actually been rewired to consume it via `uiPort`. The other 16 buttons (Italic, Underline, Color, LineHeight, ...) still run on the old `FormatStylesButtonsStateManager`/`ToolbarButtonsActionManager` in parallel — both paths independently subscribe to the same engine `selectionStylesChangeEventType` event. Migrating each remaining button means: rewire its component to `uiPort`/`onXxxUpdate`, add it to `Formatting`'s `components.toolbarButtons`, and add its name to `EditorToolbar.tsx`'s `StaticToolbarButtonValue` exclusion so the now-dead static entry doesn't linger.
- Small utilities are duplicated per tier on purpose (e.g. `assertNever` exists separately under `UI/ErrorHandling/`, `Editor/ErrorHandling/`, and `Adapters/_Utilities/ErrorHandling/`), as is toolbar-button vocabulary (`Ports/ToolbarButtons/ToolbarButtonsName.ts` vs. the older `UI/Constants/ToolbarButtonsName.ts`). This is intentional — migrating a feature should never risk breaking the untouched old path.
- Sibling Adapters/PopoverControllers must not import types from one another, even when nearly identical — duplicate instead.
- There is currently no validation that a `toolbarButtons` layout entry referencing an extension-owned name actually has a matching extension present — an unmatched name silently renders nothing rather than throwing.

---

## Commenting Style

This repository is open-source. Comments are written for end users — developers reading and potentially modifying the source code. Good comments:
- Explain **why** a constraint exists or what a behavior means, not just what the code does
- Engine-specific terms (`$$display`, `"block multi-line"`, etc.) are fine to use — they will be covered by engine documentation and users are expected to know them
- Describe the contract: what is guaranteed, and what will throw
