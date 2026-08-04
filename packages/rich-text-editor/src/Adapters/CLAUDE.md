# CLAUDE.md

An Adapter (`XxxAdapter/XxxAdapter.ts`) is the runtime object holding one extension's state. It exposes two narrowed views built for their specific consumer: `uiPort`, passed to UI components as their `uiPort` prop, and `editorPort`, passed to `configureXxx` (e.g. `configureLink` in `Editor/Extensions/ConfigureLink/ConfigureLink.ts`) as `{ editorPort, editorAPI }`. The extension's own `configure` field (`Extensions/Link/Link.ts`) is where the two meet: `configure: ({ adapter, editorAPI }) => configureLink({ editorPort: adapter.editorPort, editorAPI })` — that line narrows the adapter down to `editorPort` before anything Editor-side runs.

## What it holds

The private fields (e.g. `#toolbarButton`, `#view`, `#mode`, `#displayText`, `#url`, `#toggleButtons` on `LinkAdapter`) are the adapter's real, current state. `uiPort` exposes the ones the UI reads through individual getters (`toolbarButton`, `view`, `mode`, ...); `editorPort` exposes whichever ones the Editor actually reads the same way. Which fields end up on which port is decided per adapter by who reads them — `LinkEditorPort` has no state getters at all since Link's Editor-side wiring never reads state directly, while `MentionEditorPort` exposes `filteredItems` because `HandlePopoverAppearance` needs it.

## Listeners

Every state slice has its own `Set` of listeners, split by direction, both following the same shape: a named `onXxx(callback)` method that registers the callback and returns its own unsubscribe function by closing over `Set.delete`.
- **`#xxxListeners`** (`#viewListeners`, `#modeListeners`, ...) — UI-side subscribers, notified whenever `updateState` changes that slice. Registered via `uiPort.onXxxUpdate(callback)` (`onViewUpdate`, `onModeUpdate`, ...) — the `Update` suffix marks it as a state push from the Adapter to the UI, one method per state slice, named after its getter.
- **`#onXxxListeners`** (`#onViewChangeListeners`, `#onCancelListeners`, `#onInsertListeners`, `#onModifyListeners`, `#onToolbarClickListeners`, `#onUnwrapListeners`) — Editor-side subscribers, registered through `editorPort.onXxx(callback)` (`onViewChange`, `onCancel`, ...) — a verb or `Change` suffix marks it as an event emitted from the UI to the Editor, with no getter counterpart.

Only build an `onXxxUpdate`/`onXxx` method for a slice actually consumed from that side — `MentionAdapter` still tracks `#itemsListeners`/`#queryListeners` internally but doesn't expose them on `uiPort`, since nothing reads them from there.

`onXxxUpdate`/`emitXxx` are defined directly inline inside `uiPort`'s returned object literal, so the logic lives in exactly one place.

## Getters

`uiPort`'s `toolbarButton`, `view`, `mode`, etc. expose each private field's current value, read-only. They let a UI component read the adapter's current state synchronously on mount (`createSignal(uiPort.toolbarButton.checked)`), ahead of the first `onXxxUpdate` callback firing.

## `emitXxx()` — UI → Editor

Called by UI components in response to user interaction (a toolbar click, a popover form submit, a cancel). Each `emitXxx()`, defined inline on `uiPort`, walks its matching `#onXxxListeners` set and calls every registered Editor-side callback — the path a user action takes back to the Editor.

## `updateState(params)` — the class's own field-update mechanism

The adapter class uses this internally to mutate its private fields and notify their listeners. `UpdateXxxStateParams` makes every field optional — only the slices present in `params` get assigned and have their listeners notified, checked with `!== undefined` (never truthiness — a falsy-but-valid value like `false` or `""` must still update). This is the sanctioned way to mutate a private field after construction; `#view`/`#mode` (or any other slice) should always go through it, even from other methods within the same adapter.

The Editor side should reach state changes through a semantically-named method on `editorPort` wherever one exists — either adapter-specific, or composed in from a shared `Adapters/_Utilities/SharedPorts/` fragment the same way `LinkEditorPort extends UnwrapPort` already does (`BlockAlignPort`'s `setAlign(align)` is the same idea, already composed into `ImageEditorPort`/`VideoEditorPort`/`AudioEditorPort`/`EmbedEditorPort`). Calling `updateState` directly — the way every current call site does today (`HandleLinkClick`, `HandleToolbarLinkClick`, `HandlePopoverAppearance`, `LoadMentionItems`, ...) — is the fallback for state that has no semantic method. Both `LinkEditorPort.updateState` and `MentionEditorPort.updateState` are exposed this way only because neither adapter has needed one yet, not because a direct `updateState` call is the intended end state.

## `XxxAdapter-types.ts` file order

Types are laid out in the order their consumer reads them, UI-first (see note below), not alphabetically or by when they were written. Reference `ImageAdapter-types.ts`:

1. `CreateAdapterConstructor<Settings>` params (plus the `Settings` interface, if any).
2. Plain value/union types used by state slices (`ImageObjectFitValue`, `ImageSwapCheckState`, ...).
3. The aggregate `XxxState` interface (all slices optional) and `UpdateXxxStateParams extends XxxState`.
4. Emit-param types that appear directly in a `uiPort` method signature (e.g. `ImageEmitSwapParams`, used by `emitSwap(params: ImageEmitSwapParams)`) — these stay early, grouped with the other UI-facing types, since `uiPort` needs them.
5. `UpdateXxxFn` types — one per state slice, the UI-side push signatures used by `onXxxUpdate`.
6. Any UI-only nested sub-port interface (e.g. a bespoke `XxxUISwapPopover` with just a `setElement` method) — only needed for a nested overlay that isn't just a plain `UIOverlayMount`/`EditorOverlayMount`; once it is (as `ImageAdapter`'s, `VideoAdapter`'s, `AudioAdapter`'s, and `EmbedAdapter`'s `swapCardOverlay` all are now), it reuses those generic types directly instead of a bespoke pair. No Adapter currently needs this bespoke shape — `CodeBlockAdapter`/`TableAdapter` are the remaining `popover`-based ones (see below) and have no nested swap overlay at all — but the step stays numbered here for whichever Adapter needs it next.
7. `XxxUIPort` itself.
8. Any Editor-only nested sub-port interface (the Editor-side counterpart of step 6) and Editor-only param types (`ImageAttrChange`).
9. `OnXxxFn` types — the Editor-side listener registrations (`OnImageAttrChangeFn`, `OnImageSwapFn`). These go **here**, right before `XxxEditorPort`, never grouped with the step-5 `UpdateXxxFn` block even though both are "just function types" — a `UpdateXxxFn` is UI-facing (Adapter → UI push), an `OnXxxFn` is Editor-facing (UI → Editor event), and each belongs next to the port that actually consumes it.
10. `XxxEditorPort` itself.

## `uiPort` / `editorPort`

`get uiPort()` and `get editorPort()` each build one object literal for their consumer — `uiPort` carries the getters, `onXxxUpdate` per state slice, and every `emitXxx`; `editorPort` carries `updateState` and every `onXxx` registration — and memoize it in a private field (`this.#uiPort ??= { ... }`) so repeated access returns the same object rather than rebuilding it.

### Adapters that own their own overlay (popover or anchored)

An Adapter with its own floating element (`LinkAdapter`, `MentionAdapter`, `LineHandlerAdapter`) builds one `createOverlayMount({ overlayHost, component, props })` (from `Adapters/_Utilities`) in its constructor and stores it in a private field. Its `uiOverlayMount`/`editorOverlayMount` are never flattened onto `uiPort`/`editorPort` directly — each is assigned to its own named field instead, so an Adapter that ends up owning more than one overlay just adds another differently-named field rather than colliding on generic names like `mount`/`unmount`. The field name says which mechanism backs it, since `createOverlayMount` itself is agnostic to both:
- **`popover`** — element still uses the native Popover API (`showPopover({ source })`/`hidePopover()`), e.g. `CodeBlockAdapter`, `TableAdapter`.
- **`anchoredOverlay`** — element is a plain, always-mounted div shown/hidden via `createAnchoredOverlayController`'s `.hide-anchored` class, positioned with CSS anchor positioning (`position-anchor` set from the anchor element's `data-rx-anchor-name` attribute) instead of `showPopover({ source })`'s implicit anchor. `LinkAdapter`, `MentionAdapter`, `EmojiAdapter`, `TemplateVariableAdapter`, `LineHandlerAdapter`, `ImageAdapter`, `VideoAdapter`, `AudioAdapter`, `EmbedAdapter` — the rest (`popover`, above) are expected to migrate to this over time, since it drops the Popover API dependency entirely. `ImageAdapter`/`VideoAdapter`/`AudioAdapter`/`EmbedAdapter` additionally each own a second, independent anchored overlay (`swapCardOverlay`) — an Adapter isn't limited to one anchored overlay any more than one popover. It's mounted as its own top-level `createOverlayMount` (a sibling in the shared overlay container, not DOM-nested inside the main one) deliberately: an anchored element's containing block is its nearest positioned ancestor, and CSS anchor positioning requires the anchor to be a flat-tree descendant of that containing block (unless the containing block is the initial containing block) — nesting `swapCardOverlay` inside the main overlay (itself `position: absolute`) would put `figure` outside that reachable subtree and silently break its anchor. `CommandMenuAdapter` is the same idea but doesn't go through `createOverlayMount` at all — its UI component is statically rendered in the App tree rather than Adapter-mounted (see its own file for why), so it exposes the raw `HTMLDivElement` directly instead of a `UIOverlayMount`/`EditorOverlayMount` pair.

Either way, `uiPort.<field>.setElement(element)` is called from the floating component's own `ref`; `editorPort.<field>` then exposes `element` (throws until set), `isMounted`, `mount()`, `unmount()` — except `CommandMenuAdapter`'s `anchoredOverlay`, which is just the element itself (no lifecycle methods, since nothing mounts/unmounts it).

`props: { uiPort: this.uiPort }` is safe to pass eagerly here — `this.uiPort` is a class getter that only builds an object of lazy nested getters; none of them touch `#overlayMount` until actually read later (e.g. `.setElement` from the component's own `ref`, well after construction finishes).

**Note:** Adapters have so far been designed UI-first — the adapter's shape follows what the UI component needs to render and subscribe to, and `editorPort` is the narrower slice carved out afterward for the Editor side. Keep that direction in mind when building a new one: start from what the UI needs, then narrow down to `editorPort`.

`LinkAdapter`/`MentionAdapter` are the reference pattern, not a one-off for those two features. The older per-feature mechanisms still driving every not-yet-migrated feature — `ToolbarButtonsStateManager`, `ToolbarButtonsActionManager`, the `PopoverControllers`, and their kind — are slated to become Adapters themselves. When one of them migrates, model its Adapter on `LinkAdapter`/`MentionAdapter` rather than inventing a new shape.

## Every Adapter needs an `id`

Every Adapter class exposes a `get id()` getter, placed right after the constructor, returning its entry from `Ports/AdapterIds/AdapterIds.ts` (e.g. `get id() { return adapterIds.link; }`). This is how `RichTextEditor/BuildUIPorts/BuildUIPorts.ts` picks an Adapter out of a plain array without importing its concrete class (an `instanceof` check would force a bundler to keep that class even when the consumer never opted into the extension, defeating tree-shaking).

Adding a new Adapter means all of the following, not just the Adapter class itself:
1. Add its id to `adapterIds` in `Ports/AdapterIds/AdapterIds.ts`.
2. Add the `get id()` getter on the new Adapter class.
3. Add the class to the `Adapter` union in `Adapters/_Utilities/Utilities-types.ts`.
4. Add its `uiPort` type to `AdapterUIPorts` in that same file (`UIPortsContextValue` maps off this — nothing to touch in `UI/Components/App/App.tsx` itself).
5. Add its `if (adapter.id === adapterIds.xxx) { uiPorts.xxxUIPort = adapter.uiPort as XxxUIPort; }` block to `BuildUIPorts.ts`, alphabetized alongside the rest.
