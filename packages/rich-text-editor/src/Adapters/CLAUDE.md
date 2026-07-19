# CLAUDE.md

An Adapter (`XxxAdapter/XxxAdapter.ts`) is the runtime object holding one extension's state. It exposes two narrowed views built for their specific consumer: `uiPort`, passed to UI components as their `uiPort` prop, and `editorPort`, passed to `configureXxx` (e.g. `configureLink` in `Editor/Extensions/ConfigureLink/ConfigureLink.ts`) as `{ editorPort, editorAPI }`. The extension's own `configure` field (`Extensions/Link/Link.ts`) is where the two meet: `configure: ({ adapter, editorAPI }) => configureLink({ editorPort: adapter.editorPort, editorAPI })` — that line narrows the adapter down to `editorPort` before anything Editor-side runs.

## What it holds

The private fields (e.g. `#toolbarButton`, `#view`, `#mode`, `#displayText`, `#url`, `#toggleButtons` on `LinkAdapter`) are the adapter's real, current state. `uiPort` exposes the ones the UI reads through individual getters (`toolbarButton`, `view`, `mode`, ...); `editorPort` exposes whichever ones the Editor actually reads the same way. Which fields end up on which port is decided per adapter by who reads them — `LinkEditorPort` has no state getters at all since Link's Editor-side wiring never reads state directly, while `MentionEditorPort` exposes `filteredItems` because `HandlePopoverAppearance` needs it.

## Listeners

Every state slice has its own `Set` of listeners, split by direction:
- **`#xxxListeners`** (`#viewListeners`, `#modeListeners`, ...) — UI-side subscribers, notified whenever `updateState` changes that slice. Registered via `uiPort.subscribe({ type: "view", callback })`, removed via `unsubscribe`. Both route through a private `#updateListener` if-chain keyed on `type`, ending in `assertNever` — so adding a new state slice without wiring it into subscribe/unsubscribe is a compile error.
- **`#onXxxListeners`** (`#onViewChangeListeners`, `#onCancelListeners`, `#onInsertListeners`, `#onModifyListeners`, `#onToolbarClickListeners`, `#onUnwrapListeners`) — Editor-side subscribers, registered through `editorPort.onXxx(callback)`. Each `onXxx` returns its own unsubscribe function by closing over `Set.delete`.

`subscribe`/`unsubscribe`/`setPopover`/`emitXxx` are defined directly inline inside `uiPort`'s returned object literal, so the logic lives in exactly one place.

## Getters

`uiPort`'s `toolbarButton`, `view`, `mode`, etc. expose each private field's current value, read-only. They let a UI component read the adapter's current state synchronously on mount (`createSignal(uiPort.toolbarButton.checked)`), ahead of the first `subscribe` callback firing.

## `emitXxx()` — UI → Editor

Called by UI components in response to user interaction (a toolbar click, a popover form submit, a cancel). Each `emitXxx()`, defined inline on `uiPort`, walks its matching `#onXxxListeners` set and calls every registered Editor-side callback — the path a user action takes back to the Editor.

## `updateState(params)` — the class's own field-update mechanism

The adapter class uses this internally to mutate its private fields and notify their listeners. `UpdateXxxPopoverStateParams` makes every field optional — only the slices present in `params` get assigned and have their listeners notified. This is the sanctioned way to mutate a private field after construction; `#view`/`#mode` (or any other slice) should always go through it, even from other methods within the same adapter.

The Editor side is expected to reach state changes through more specific, semantically-named methods the adapter's `editorPort` exposes (e.g. a `setAlign(value)`), which forward to `updateState` internally (`this.#updateState({ align: value })`) — `updateState` is the mechanism, the named methods are the contract Editor code calls. `LinkEditorPort.updateState` is currently exposed directly as a shortcut, kept as-is rather than fixed mid-migration.

## `uiPort` / `editorPort`

`get uiPort()` and `get editorPort()` each return a fresh object literal, built for their consumer: `uiPort` carries the getters, `subscribe`/`unsubscribe`, `setPopover`, and every `emitXxx`; `editorPort` carries the `popover` getter (throws until the element is mounted via `uiPort.setPopover`), `updateState`, and every `onXxx` registration.

**Note:** Adapters have so far been designed UI-first — the adapter's shape follows what the UI component needs to render and subscribe to, and `editorPort` is the narrower slice carved out afterward for the Editor side. Keep that direction in mind when building a new one: start from what the UI needs, then narrow down to `editorPort`.
