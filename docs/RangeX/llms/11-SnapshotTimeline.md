# 11. SnapshotTimeline

`SnapshotTimeline` is the undo/redo system. Each `RangeX` instance has exactly one timeline. Consumers access it via `editorAPI.getSnapshotTimeline()`, which returns a `SnapshotTimeline`.

```ts
const timeline = editorAPI.getSnapshotTimeline();
```

---

## Reading timeline state

```ts
timeline.editorSnapshots   // Array<() => EditorSnapshot> — one callback per snapshot in the timeline
timeline.currentIndex      // number — index of the currently active snapshot
timeline.canStepBack       // boolean — whether undo is possible
timeline.canStepForward    // boolean — whether redo is possible
```

`editorSnapshots` returns an array of callbacks. Call one to get a deep clone of that snapshot — only the snapshot you read is cloned. `currentIndex` is `0` at the oldest snapshot (the initial state captured on construction). After each `stepBack()` it decrements; after each `stepForward()` it increments.

```ts
const snapshot = timeline.editorSnapshots[timeline.currentIndex](); // EditorSnapshot
```

---

## Navigating the timeline

```ts
timeline.stepBack()            // undo — moves to currentIndex - 1
timeline.stepForward()         // redo — moves to currentIndex + 1
timeline.stepTo({ index: 3 }) // jump to any index in the timeline
```

All three methods reconcile the `RootEditable` against the target snapshot (DOM patching), then fire `"selection-styles-change"` and `"snapshot-index-change"` events.

- `stepBack()` throws if `canStepBack` is `false`.
- `stepForward()` throws if `canStepForward` is `false`.
- `stepTo()` throws if `index` is out of range (below 0 or above the last index). It is a no-op if the target index equals `currentIndex`.

---

## Snapshot commit flow — `registerSnapshotBoundary`

When a consumer makes a change to the editor (inserts a component, changes a table's properties, etc.), it calls `registerSnapshotBoundary()` to declare that a snapshotworthy change occurred:

```ts
timeline.registerSnapshotBoundary();
```

This does **not** push a snapshot immediately. Instead it triggers the following sequence:

1. All snapshots after `currentIndex` are discarded (branching — redo history is cleared).
2. A `"snapshot-before-add"` event is scheduled (fires in the next microtask).
3. The consumer's `"snapshot-before-add"` listener receives `{ event: EventController }` and may call `event.preventEvent()` to cancel.
4. If not cancelled, the snapshot is committed to the timeline and `"snapshot-index-change"` fires.

This design gives consumers full control over whether a snapshot is actually saved — for example, to prevent saving a snapshot mid-gesture, or to merge multiple rapid changes.

`registerSnapshotBoundary()` always schedules `"snapshot-before-add"` in the next microtask — there is no session merging. The session merging described below applies only to internal framework causes (keyboard character insertions and deletions).

---

## Session merging — how the framework batches keyboard events

The framework internally calls the equivalent of `registerSnapshotBoundary` for every user input (keystrokes, cut, paste, drag-and-drop, formatting changes, table structure changes). Not all of these create a snapshot immediately — keyboard character insertions and deletions use **session merging**:

- The first keystroke in a new typing session sets a 600ms timer.
- Any further keystrokes before the timer fires are grouped into the same session.
- When the timer fires (600ms after the first keystroke in the session), the snapshot is committed.
- A keystroke after the timer has already fired starts a new session.

The effect is that continuous typing is captured as one undo step, while typing with long pauses produces separate steps.

All other input types (Enter/newline, cut, paste, drag-and-drop, format changes, table structure changes) commit a snapshot **immediately**, not as part of a session.

---

## Redo branching

Any change to the editor — including every keystroke — discards all snapshots ahead of `currentIndex` before the new snapshot is committed. This is the standard linear undo/redo model: if you undo three steps and then type something, the three undone states are permanently gone.

---

## Memory limits — `maxSnapshotCount` and `snapshotPruneInterval`

The timeline caps memory usage using two configurable properties:

```ts
timeline.maxSnapshotCount    // default: 1000
timeline.snapshotPruneInterval  // default: 10
```

When the number of snapshots reaches `maxSnapshotCount`, the timeline prunes the array before adding the new entry. Pruning removes every `snapshotPruneInterval`-th entry from the array (except the oldest snapshot at index 0, which is always preserved). With the defaults, every 10th entry is removed, thinning out the middle of the history while keeping the oldest state intact.

Both properties are gettable and settable:

```ts
timeline.maxSnapshotCount = 500;
timeline.snapshotPruneInterval = 5;
```
