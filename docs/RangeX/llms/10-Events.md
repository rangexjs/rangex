# 10. Events

RangeX has two distinct event systems: **editor events** (high-level editor state changes) and **DOM events** (native browser events on editor elements). Both are accessed through `editorAPI`.

---

## Editor events

Subscribe via `editorAPI.subscribeEditorEvent`, which returns an unsubscribe function:

```ts
const unsubscribe = editorAPI.subscribeEditorEvent({
  type: "selection-in",
  callback: () => {
    // editor gained focus
  },
});

// later, to stop listening:
unsubscribe();
```

There is no separate `unsubscribeEditorEvent` method — the return value of `subscribeEditorEvent` is the unsubscribe function.

### Microtask batching

All editor events are batched. Multiple `scheduleEvent` calls within the same synchronous tick queue only one microtask. On that microtask, all pending events are atomically collected and dispatched in a fixed order. This means callbacks always fire asynchronously, after the current synchronous work completes, and multiple changes in the same tick produce exactly one round of events.

Fixed dispatch order: `selection-in` → `editor-selection-change` → `table-selection-change` → `selection-styles-change` → `list-child-nodes-change` → `table-structure-change` → `snapshot-before-add` → `snapshot-index-change` → `selection-out`.

To force dispatch of any pending events immediately, without waiting for the microtask, call `editorAPI.flushEditorEvents()`:

```ts
editorAPI.flushEditorEvents();
```

If no events are pending, this is a no-op.

### All 9 editor event types

**`"selection-in"`**
Fired when the editor gains focus (selection enters the editor).

```ts
callback: () => void
```

---

**`"editor-selection-change"`**
Fired when the caret or selection position changes. Also automatically schedules `"selection-styles-change"` in the same batch, so you do not need to subscribe to both.

```ts
callback: () => void
```

---

**`"table-selection-change"`**
Fired when the table cell selection changes (cells highlighted inside a table, separate from the regular caret selection). Also automatically schedules `"selection-styles-change"`.

```ts
callback: ({ tables: Set<Table> }) => void
```

`tables` is the set of `Table` nodes whose cell selection changed in this batch.

---

**`"selection-styles-change"`**
Fired when the format styles at the current selection change. This covers both cases: the selection moved to text with different formatting, or formatting was applied to the current selection.

```ts
callback: ({ selectionFormatStyles: SelectionFormatStyles }) => void
```

`SelectionFormatStyles` describes the current format state (line tag names, line CSS styles, text CSS styles, inline tags) across the selection, plus any pending format state (format that will apply to the next typed character). This type is covered in detail in [section 13](#13-selection-formatting).

When a table has an active cell selection, the payload reflects the format across those cells rather than `LiveBoundaryPoints`.

---

**`"list-child-nodes-change"`**
Fired when the children of one or more `List` nodes change.

```ts
callback: ({ lists: Set<List> }) => void
```

`lists` is the set of `List` nodes whose children changed in this batch.

---

**`"table-structure-change"`**
Fired when the structure of one or more `Table` nodes changes (rows, columns, cells added or removed).

```ts
callback: ({ tables: Set<Table> }) => void
```

`tables` is the set of `Table` nodes whose structure changed in this batch.

---

**`"snapshot-before-add"`**
Fired when a snapshot is about to be committed to the undo/redo timeline. This gives consumers the opportunity to cancel the snapshot push.

```ts
callback: ({ event: EventController }) => void
```

`EventController` has three members:

```ts
event.cancelable      // boolean — true only if at least one snapshot already exists in the timeline
event.preventEvent()  // cancels the snapshot push; throws if event.cancelable is false
event.eventPrevented  // boolean — whether preventEvent() was called
```

The event fires after the snapshot session timer has expired (600ms after the last registered change, by default), not immediately when a change occurs. See [section 11](#11-snapshottimeline) for details on how the timeline decides when to fire this event.

---

**`"snapshot-index-change"`**
Fired when the current snapshot index changes — i.e., after a step back, step forward, step to, or a new snapshot being pushed.

```ts
callback: () => void
```

---

**`"selection-out"`**
Fired when the editor loses focus (selection leaves the editor).

```ts
callback: () => void
```

---

## DOM events — `registerDOMEvent`

`registerDOMEvent` attaches a native DOM event listener to `EditorElement` nodes that match a predicate. It returns an unregister function.

```ts
const unregister = editorAPI.registerDOMEvent({
  when: ({ element }) => isComponent(element),  // fires only on Component nodes (inline or block)
  eventListener: {
    type: "click",
    listener: (event) => {
      // event is a PointerEvent
    },
    options: { capture: true },  // AddEventListenerOptions — 'signal' is excluded
  },
});

unregister(); // removes the listener from all matching elements
```

`when` is called with the `EditorElement` that the event fires on. Return `true` to attach the listener to that element, `false` to skip it. All standard DOM event types are available (`click`, `pointerdown`, `keydown`, `focus`, `input`, etc.).

### Why use `registerDOMEvent` instead of `.addEventListener`

Using native `.addEventListener` directly on editor elements is unreliable because editor nodes are regularly created, destroyed, and re-created:

- When the user copies and pastes content (Ctrl+C / Ctrl+V), the pasted nodes are new DOM nodes — they will not have any manually-attached listeners.
- When content is loaded from a `StoredSnapshot`, all nodes are reconstructed from scratch — again, no manually-attached listeners.
- When a node is moved or re-inserted through any editor operation, the same applies.

`registerDOMEvent` solves this by registering the spec (the `when` predicate + listener) centrally. The framework re-applies it to all matching elements whenever they connect or reconnect to the editor, ensuring listeners are always present regardless of how the node was created or inserted.

### DOM events and read-only mode

When the editor is in read-only mode (`setIsTextAreaEditable(false)`), all interactivity is removed from editor elements — registered DOM event listeners **will not fire**. This is intentional: read-only mode completely strips all interactive behavior from the editor.

---

## Event interception — `registerEventInterceptor`

`registerEventInterceptor` lets a consumer intercept a specific event **before the engine processes it**. If the interceptor returns `true`, the engine skips its own handling for that event and calls `event.preventDefault()` on the browser event. It returns an unregister function.

```ts
const unregister = editorAPI.registerEventInterceptor({
  type: "keydown",
  interceptor: (event) => {
    // event is a KeyboardEvent
    if (event.code === "Tab") {
      return true; // cancel engine handling — consumer handles Tab externally
    }
    return false; // let the engine process normally
  },
});

unregister(); // removes the interceptor
```

The interceptable event types are:

| `type`        | Native event      | Typical engine action cancelled                    |
|---------------|-------------------|----------------------------------------------------|
| `"keydown"`   | `KeyboardEvent`   | New line, deletion, directional keys, history nav  |
| `"beforeinput"` | `InputEvent`    | Printable character insertion, deletion            |
| `"paste"`     | `ClipboardEvent`  | Paste handling                                     |
| `"copy"`      | `ClipboardEvent`  | Copy handling                                      |
| `"cut"`       | `ClipboardEvent`  | Cut handling                                       |
| `"dragstart"` | `DragEvent`       | Initializing the drag payload for an internal content drag |
| `"dragenter"` | `DragEvent`       | Drag-and-drop tracking state initialization        |
| `"dragover"`  | `DragEvent`       | Drop indicator (caret/line) positioning            |
| `"dragleave"` | `DragEvent`       | Hiding drop indicators                             |
| `"drop"`      | `DragEvent`       | Content insertion/reordering from an internal drag |
| `"dragend"`   | `DragEvent`       | Drag-and-drop tracking state cleanup               |

### Interceptor return value

- Return `true` — cancel engine handling. The engine calls `event.preventDefault()` and returns without executing its normal logic.
- Return `false` — let the engine proceed normally.

### Multiple interceptors

All registered interceptors for a given event type always run. If **any** interceptor returns `true`, the engine is cancelled — there is no short-circuit. This ensures every interceptor has the opportunity to observe the event regardless of what others decide.

### Difference from `registerDOMEvent`

`registerDOMEvent` is observation-only — the engine always processes the event. `registerEventInterceptor` is the only way to prevent the engine's built-in handling of the event.
