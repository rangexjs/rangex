# 8. Selection

## LiveBoundaryPoints

`LiveBoundaryPoints` is the editor's internal state that represents the current selection. It lives on `RootEditable` and is the single source of truth for where the caret or selection is — not the browser's native `Selection` API.

Its initial value points to the `RootEditable` itself at offset 0. Both endpoints always refer to `ContentFlowNode`s inside the `RootEditable`. The `live` prefix reflects that it stays valid even as the DOM mutates around it — it tracks node references directly, not DOM positions.

## How the native selection syncs to LiveBoundaryPoints

The browser fires a ``selectionchange`` event whenever the user moves the caret or makes a selection. The editor responds in this sequence:

**1. Manageability check** — the selection is *manageable* if both conditions hold:
- The anchor and focus nodes both belong to the same `RootEditable`
- The anchor node (or one of its ancestors) is an editable `EditorElement` — i.e. not inside a `DetachedContext` and not stranded in a fully non-editable region up to the `RootEditable` root

If not manageable, `LiveBoundaryPoints` is not updated.

**2. Validation** — if manageable, the selection is validated. This step may adjust the browser's focus point to keep the selection within a coherent editable context:
- If the anchor is editable but the focus has drifted outside the anchor's editing host → the focus is pulled back to the editing host's boundary
- If the anchor is editable but the focus lands on a non-editable node → the focus is moved to the nearest editable node in the selection direction
- Symmetric rules apply when the anchor itself is non-editable (the focus is constrained to the topmost non-editable boundary)

**3. Sync** — after validation, the selection's boundary points are resolved to `EditorText` references. If both endpoints are non-editable, or if a table cell selection is currently active (the table has its own selection model), `LiveBoundaryPoints` is not updated. Otherwise, if the resolved boundary points differ from the current state, `LiveBoundaryPoints` is updated and the pending format state is cleared.

> The native browser selection is the trigger — `LiveBoundaryPoints` is the result.

## The reverse direction: keeping the native selection in sync after user-driven mutations

When a DOM mutation is caused by user input (e.g., pressing backspace removes content), the editor engine explicitly updates the native Selection API to match the new `LiveBoundaryPoints` after the mutation completes. This is necessary because the browser engine may adjust the native selection on its own in response to the DOM change and fire a `selectionchange` event. Without the explicit update from the editor engine, that `selectionchange` would trigger the sync flow above — and the browser engine's adjusted selection would overwrite the `LiveBoundaryPoints` the editor engine just set. By explicitly syncing the native selection right after each user-driven mutation, the editor engine ensures the incoming `selectionchange` finds no difference and produces no change.

## Why programmatic changes do NOT sync the native selection

When `LiveBoundaryPoints` changes due to a programmatic operation (e.g., calling `editorAPI.updateSelectionStyles(...)`), the editor engine does **not** update the native Selection API. This is intentional: the user may have focus on an external input (e.g., a URL field in a popover) while applying a formatting change. Automatically syncing the native selection would steal focus from that external input, which is the wrong behavior.

## Common mistake: programmatic changes without re-focusing

If you call `editorAPI.updateSelectionStyles(...)` without re-focusing the editor afterward, the following happens:

1. The editor engine mutates the DOM (splitting or merging nodes to apply formatting)
2. The browser engine adjusts its native selection in response to the DOM change
3. A `selectionchange` event fires; the editor engine resolves it back into `LiveBoundaryPoints` — potentially landing on a different position than intended

**Fix:** after a programmatic change, call `editorAPI.focus()`. This focuses the editor and syncs the native Selection API to the current `LiveBoundaryPoints`, so the subsequent `selectionchange` finds no difference and does nothing.

If you need to sync the native selection without moving focus (e.g., the editor is already focused), use `editorAPI.getEditorSelection().syncToNativeSelection()` instead.

## EditorSelection

`EditorSelection` is a view over `LiveBoundaryPoints`. It is always in sync with it — whenever `LiveBoundaryPoints` changes, `EditorSelection` reflects the new state. Obtain it via `editorAPI.getEditorSelection()`.

**Important:** reading and writing boundary points through `EditorSelection` only affects `LiveBoundaryPoints` — the native Selection API is not touched. The one exception is `syncToNativeSelection()`, which explicitly pushes the current boundary points into the native browser Selection.

### from / to vs anchor / focus

Unlike the native Selection API, `EditorSelection` uses `from` / `to` boundary points rather than anchor / focus. `from` and `to` reflect whatever is stored in `LiveBoundaryPoints` — they are not guaranteed to be in DOM order. To determine which end corresponds to the user's anchor or focus, use `direction`:

- `direction === "forward"` → anchor = `from`, focus = `to`
- `direction === "backward"` → anchor = `to`, focus = `from`
- `direction === "none"` → directionless; the selection has no determinable direction. This can occur in multiple cases — for example, double-clicking a word selects it with a directionless selection on some OS/browser combinations. Whether the selection is collapsed or not is independent of this value. See the [W3C Selection API — directionless](https://w3c.github.io/selection-api/#dfn-directionless).

`domDirection` gives the relative DOM ordering of `from` vs `to` as computed from their positions in the tree. Use it when you need to know whether `from` comes before `to` in the DOM — the two do not have a guaranteed ordering.

### Methods

| Method | Description |
|---|---|
| `getBoundaryPoints()` | Returns `{ fromText, fromOffset, toText, toOffset }`. Both text references are always `EditorText` nodes — never element-level boundary points. |
| `setBoundaryPoints({ fromNode, fromOffset, toNode, toOffset })` | Sets new boundary points on `LiveBoundaryPoints`. Accepts `ContentFlowNode` (more permissive than `getBoundaryPoints`). Silently ignored if either point is outside this `RootEditable` or invalid. Does not update the native Selection API. |
| `isValidBoundaryPoints()` | Returns `true` if the current boundary points are within the same editable context. |
| `collapse({ whereTo: "from" \| "to" })` | Collapses the selection to the `from` or `to` end. |
| `syncToNativeSelection()` | Pushes the current `LiveBoundaryPoints` into the native browser Selection API. Anchor maps to the DOM-start boundary point; focus maps to the DOM-end boundary point. Not automatic — call it explicitly when you need the native caret/selection to reflect the current editor state (e.g. after `insertNode`, or `removeNodesInRange`). **Why not automatic:** the user might have focus on an external element (e.g. a URL input in a link popover) and auto-syncing would steal focus from there. |

## EditorRange

`EditorRange` is a utility class for inspecting a span of editor content. Think of it as the editor's equivalent of a `StaticRange` — it captures a snapshot of two boundary points at construction time and does not stay in sync with the DOM or with `LiveBoundaryPoints`. Unlike `EditorSelection`, which reflects `LiveBoundaryPoints` as-is, `EditorRange` **always normalizes its boundary points into DOM order** (start ≤ end) in the constructor. This means it is safe to query `startText` / `endText` without worrying about which end came first — regardless of how the `fromNode`/`toNode` were passed in, `start` is always the earlier point in the DOM.

Construct it directly:

```ts
import { EditorRange } from "@rangex/core";

const range = new EditorRange({ fromNode, fromOffset, toNode, toOffset });
// fromNode / toNode accept ContentFlowNode — resolved to EditorText internally
// start and end are guaranteed: startText ≤ endText in DOM order
```

### Boundary point properties

All four properties resolve to `EditorText` — never element-level nodes.

| Property | Type | Description |
|---|---|---|
| `startText` | `EditorText` | The earlier text node in DOM order |
| `startOffset` | `number` | Offset within `startText` |
| `endText` | `EditorText` | The later text node in DOM order |
| `endOffset` | `number` | Offset within `endText` |

### State properties

| Property | Type | Description |
|---|---|---|
| `collapsed` | `boolean` | `true` when `startText === endText && startOffset === endOffset` — both endpoints are the same point |
| `isSameDOMTree` | `boolean` | `true` when `startText` and `endText` are in the same connected DOM tree (not detached or disconnected from each other) |

### Validity

```ts
range.isValidBoundaryPoints() // → boolean
```

Returns `true` when all three conditions hold:
- `isSameDOMTree` — both endpoints are in the same connected tree
- `isCorrectOrder` — start is before or equal to end in the DOM (always `true` for a freshly constructed `EditorRange` since the constructor normalizes order)
- Same `EditingRoot` — both endpoints resolve to the same `EditingRoot` via their editable context

### Line containment properties

These are useful for checking whether a range spans across line boundaries.

| Property | Type | Description |
|---|---|---|
| `isSameContentLine` | `boolean` | `true` when both endpoints' closest `ContentLine` ancestor is the same node — regardless of whether that `ContentLine` is block or inline |
| `isSameBlockContentLine` | `boolean` | `true` when both endpoints resolve to the same block-level `ContentLine`. Walks up past inline `ContentLine`s (inside inline `NestedEditable`s) to find the nearest block `ContentLine`. For example, two endpoints in different inline `NestedEditable`s both contained by the same block `ContentLine` return `true`. |
| `isSameBlockComponentLine` | `boolean` | `true` when both endpoints are within the same `BlockComponentLine` |
| `isSameBlockLine` | `boolean` | `true` when both endpoints are within the same block-level `Line` — either a block `ContentLine` or a `BlockComponentLine` |

### `containsRangeSensitiveNode`

```ts
range.containsRangeSensitiveNode // → boolean
```

`true` when at least one `RangeSensitiveNode` (`BasicText`, `OneVisualUnitText`, or `Component`) falls — even partially — between the start and end boundary points. "Partially" means even a single Unicode code point of a `BasicText` being within the range is enough to return `true`. Conversely, if the range spans only `RangeNeutralNode`s (e.g. only `InlineComponentText` sentinels between two `InlineComponent`s), this returns `false`.

### `isSinglePoint`

```ts
range.isSinglePoint // → boolean
```

`true` when both of the following hold:
- `containsRangeSensitiveNode` is `false`
- The start and end are in the same line (`isSameContentLine || isSameBlockComponentLine`)

**This is not the same as `collapsed`.** A range can span across `RangeNeutralNode`s (`BeamText`, `InlineComponentText`, `BlockComponentText`) on the same line and still be `isSinglePoint` — because those nodes carry no meaningful range content. In contrast, `collapsed` requires both endpoints to be the exact same text node at the exact same offset.

### Methods

| Method | Returns | Description |
|---|---|---|
| `isDescendant({ container, start, end })` | `boolean` | Checks whether the specified endpoint(s) are descendants of `container`. Pass `start: true` to check `startText`, `end: true` to check `endText`, or both. At least one must be `true`. |
| `isPointInRange({ node, offset })` | `boolean` | Delegates to the native `Range.isPointInRange`. Returns `true` if the given `{ node, offset }` falls within the range. |
| `comparePoint({ node, offset })` | `{ position: "before" \| "inRange" \| "after" }` | Delegates to the native `Range.comparePoint`. Returns where the given point sits relative to the range. |
| `isIntersectsNode({ node })` | `boolean` | Delegates to the native `Range.intersectsNode`. Returns `true` if the range overlaps with the given node at all. |
| `compareBoundaryPoints({ how, sourceRange })` | `"before" \| "equal" \| "after"` | Compares a boundary point of this range against a boundary point of `sourceRange`. `how` controls which pair is compared: `"startToStart"` \| `"startToEnd"` \| `"endToEnd"` \| `"endToStart"`. Delegates to the native `Range.compareBoundaryPoints`. |
| `getBoundingClientRect()` | `DOMRect` | Returns the bounding client rect of the range. Delegates to the native `Range.getBoundingClientRect`. |
| `scrollIntoView(params)` | `void` | Scrolls the viewport so the range is visible. `params` accepts standard `ScrollIntoViewOptions`. For `isSinglePoint` ranges (same line, no `RangeSensitiveNode`), scrolls the start boundary point into view using an internal caret-aware scroll; for all other ranges, scrolls the common ancestor container element. |

### Typical pattern: EditorSelection → EditorRange

`EditorSelection` reflects `LiveBoundaryPoints` as-is (unordered). `EditorRange` gives you a DOM-ordered, static snapshot to query against. The common pattern is to read from `EditorSelection` and immediately construct an `EditorRange`:

```ts
const { fromText, fromOffset, toText, toOffset } = editorSelection.getBoundaryPoints();
const range = new EditorRange({ fromNode: fromText, fromOffset, toNode: toText, toOffset });
// range.startText / range.endText are now always in DOM order, regardless of selection direction
```
