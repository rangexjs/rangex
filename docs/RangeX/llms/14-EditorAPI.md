# 14. EditorAPI

`EditorAPI` is the main interface through which consumers interact with the editor at runtime. It is the direct return value of `createEditorAPI()`:

```ts
const { editorAPI } = createEditorAPI({ ... });
```

`editorAPI` is a plain object whose methods close over the editor's internal state — it can be passed around freely.

---

## Properties

### `host`

```ts
readonly host: HTMLElement
```

The plain element that owns the editor's shadow root. Append this to the document to mount the editor:

```ts
document.body.appendChild(editorAPI.host);
```

### `shadowRoot`

```ts
readonly shadowRoot: ShadowRoot
```

The `ShadowRoot` attached to `host`. All editor DOM — the `RootEditable`, styles, the caret anchor, and internal structural elements — lives inside this shadow root. Useful when:

- Querying elements within the shadow tree
- Targeting CSS from an external stylesheet that needs shadow DOM scope
- Mounting anchored UI relative to the shadow host

### `rootEditable`

```ts
readonly rootEditable: RootEditable
```

The `RootEditable` node — the top-level editor element. This is the same node passed (or constructed from a snapshot) to `createEditorAPI`. Direct access is needed for tree traversal, node creation context, and any operation that takes a `RootEditable` parameter.

---

## State

### `getIsSelectionActive()`

```ts
getIsSelectionActive(): boolean
```

Returns `true` when the editor currently has focus (i.e., there is an active selection inside the editor). Does not distinguish between a collapsed caret and a range selection — both count as active.

### `getIsTextAreaEditable()` / `setIsTextAreaEditable(params)`

```ts
getIsTextAreaEditable(): boolean
setIsTextAreaEditable(isTextAreaEditable: boolean): void
```

Gets or sets the editor's editable state. When `false`, the framework forces `contenteditable="false"` on all elements at the DOM level, regardless of each node's logical `EditState`. This is the global read-only toggle.

`setIsTextAreaEditable` is idempotent — calling it with the current value is a no-op. When changed, the new state propagates immediately to all editor elements.

When `isTextAreaEditable = false`:
- All DOM mutations are blocked
- DOM events registered via `registerDOMEvent` do **not** fire
- Editor events (`editorSelectionChange`, `selectionStylesChange`, etc.) still fire normally

### `getIsTextAnimation()` / `setIsTextAnimation(params)`

```ts
getIsTextAnimation(): boolean
setIsTextAnimation(isTextAnimation: boolean): void
```

Gets or sets whether text animation is active. When `true`, each `GlyphFormatter` created for newly typed characters receives a `data-interactive-text-animation="true"` attribute. The consumer targets this attribute with CSS to produce an enter animation — for example, fading a character in from opacity 0 to 1 as the user types.

The attribute is removed automatically when the CSS animation ends. While the attribute is present, the `GlyphFormatter` is not merged with adjacent ones that have matching formats — this ensures each newly typed character keeps its own element and its own animation lifecycle. Once the animation ends, normal merging resumes.

This is `false` by default.

---

## Focus and selection sync

### `focus()`

```ts
focus(): void
```

Programmatically focuses the editor. Syncs the native `Selection` API to the current `LiveBoundaryPoints`, then moves browser focus into the editor's shadow DOM.

### `getEditorSelection()`

```ts
getEditorSelection(): EditorSelection
```

Returns the `EditorSelection` instance associated with this editor. Always returns the same object — it is live and auto-updates. See [section 8](#8-selection) for the full `EditorSelection` API.

### `getSnapshotTimeline()`

```ts
getSnapshotTimeline(): SnapshotTimeline
```

Returns the `SnapshotTimeline` for undo/redo. Always returns the same object. See [section 11](#11-snapshottimeline) for the full `SnapshotTimeline` API.

### `getFindReplace()`

```ts
getFindReplace(): FindReplace
```

Returns the `FindReplace` instance associated with this editor. Always returns the same object — the instance starts in the disabled state; call `.enable()` before use. See [section 12](#12-findreplace) for the full `FindReplace` API.

---

## Custom styles

### `replaceCustomStyles(styleSheetText)`

```ts
replaceCustomStyles(styleSheetText: string): void
```

Replaces the entire contents of the custom `<style>` element inside the editor's shadow DOM with the provided CSS string. This is a full replacement — not an append. Pass an empty string to clear all custom styles.

The custom stylesheet is scoped to the shadow DOM and does not affect the outer page. Use it for consumer-defined styles such as:
- Custom `ContentLine` tag styles (`h1`, `h2`, `p` appearance)
- Table, list, or component visual appearance
- Color themes for inline tags

```ts
editorAPI.replaceCustomStyles(`
  h1 { font-size: 2em; font-weight: bold; }
  p  { margin: 0; }
  strong { color: inherit; }
`);
```

---

## External drag

### `startExternalDrag(event)`

```ts
startExternalDrag(event: DragEvent): void
```

Starts a drag operation on the `RootEditable` using a `DragEvent` that did not originate from the `RootEditable` itself (for example, `dragstart` on an element outside the editor). This lets consumers drag external content (a sidebar item, a file, a custom drag handle) into the editor by forwarding the `DragEvent` to this method, reusing the same drag-start handling the editor applies to its own internal drags.

```ts
externalElement.addEventListener("dragstart", (event) => {
  editorAPI.startExternalDrag(event);
});
```

---

## Content mutations

All mutation methods operate on `ContentFlowNode` boundary points (`fromNode`/`fromOffset`, `toNode`/`toOffset`). They auto-normalize to DOM order where relevant and require that the boundary points fall within an editable zone (`EditState = "editable"`). If the boundary points are invalid, a descriptive error is thrown.

### `insertNode(params)`

```ts
insertNode(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  lines: Line[];
  breakBeforeInsert: boolean;
}): void
```

Inserts one or more `Line[]` nodes into the editor at the given **collapsed** boundary point. A range (from ≠ to) is not accepted — you must collapse the selection before calling this.

- `lines` — array of `Line` nodes to insert. Must not be empty.
- `breakBeforeInsert` — controls how the **first** line is handled:
  - `false` — the first `ContentLine`'s child nodes are merged **inline** into the existing line at the cursor. No new line element is created; the content is placed directly at the cursor position within the current line.
  - `true` — a line break is performed first (equivalent to pressing Enter), then the first `ContentLine`'s child nodes are merged into the new line position.

Every line after the first always has its own preceding line break — `breakBeforeInsert` only affects the first.

`BlockComponentLine`s in the array always split the current line and insert as a new block, regardless of `breakBeforeInsert`.

After insertion, `LiveBoundaryPoints` is collapsed to the end of the inserted content. 

**Important:** `insertNode` does not call `registerSnapshotBoundary()` automatically. If you want this action to appear in the undo history, call `editorAPI.getSnapshotTimeline().registerSnapshotBoundary()` after inserting.

### `removeNodesInRange(params)`

```ts
removeNodesInRange(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}): void
```

Removes all editor content between `fromNode`/`fromOffset` and `toNode`/`toOffset`. The boundary points are auto-normalized to DOM order before removal. After removal, `LiveBoundaryPoints` is collapsed to the start boundary.

If `fromNode`/`fromOffset` === `toNode`/`toOffset` (collapsed), no content is removed.

Same snapshot caveat as `insertNode`: call `registerSnapshotBoundary()` if the action should appear in the undo history.

### `cloneNodesInRange(params)`

```ts
cloneNodesInRange(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}): { clonedLines: Line[] }
```

Returns a deep copy of all `Line` nodes in the given range as a `Line[]`. Does **not** modify the editor tree. The cloned lines are detached — they can be held in memory and passed to `insertNode` later (e.g. for copy-paste, drag-and-drop, duplication).

The boundary points are auto-normalized to DOM order.

---

## Plain text

### `getPlainText(params)`

```ts
getPlainText(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}): string
```

Extracts the plain text content of the given range as a single string. Crosses `GlyphFormatter` wrappers and text node boundaries transparently — formatting is ignored, only character data is returned. The boundary points are auto-normalized to DOM order.

**Prefer this over `.textContent`:** the native `.textContent` on editor elements includes `InlineComponentText` and `BlockComponentText` sentinel nodes, which are structural placeholders and not part of the user-visible content. `getPlainText` filters these out and returns only the actual editable characters.

This is the bulk read path: call it once to get a full string for a range. For character-by-character scanning adjacent to a boundary point, use `createPlainTextScanner` instead.

### `createPlainTextScanner(params)`

```ts
createPlainTextScanner(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  direction: "forward" | "backward";
}): { plainTextScanner: PlainTextScanner }
```

Returns a lazy `PlainTextScanner` generator that walks character by character from the given boundary point in the given direction. At each step, the generator yields:

```ts
interface PlainTextScanStep {
  toText: FormattableText; // current boundary text node
  toOffset: number;        // current offset in that text node
  data: string;            // all characters accumulated so far
}
```

`data` accumulates as you step — after `n` steps, `data` holds the full `n`-character prefix (forward) or suffix (backward) scanned so far.

**Scope:** The scanner stays within a single block `ContentLine`. It crosses `GlyphFormatter` wrappers and `BasicText`/`OneVisualUnitText` node boundaries, but **stops at `InlineComponent` boundaries** — it will not enter or cross an inline component.

**`fromNode` resolution:** If `fromNode` resolves to a non-`FormattableText` (e.g. `BeamText`), the returned scanner is an empty generator that yields nothing.

**Usage — mention trigger detection:**

```ts
const { plainTextScanner } = editorAPI.createPlainTextScanner({
  fromNode: caretText,
  fromOffset: caretOffset,
  direction: "backward",
});

for (const { data, toText, toOffset } of plainTextScanner) {
  if (data.startsWith("@")) {
    // found the @mention trigger — data is the full typed word
    break;
  }
  if (data.length > 50) {
    // give up after 50 chars — no trigger found nearby
    break;
  }
}
```

---

## Wrapping — block components

### `getBlockWrappableSegment(params)`

```ts
getBlockWrappableSegment(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}): BlockWrappableSegment | null
```

Resolves a `BlockWrappableSegment` for the given range — the set of contiguous top-level `Line` nodes inside a shared `"block multi-line"` `ScopedEditable` that spans the selection. Returns `null` only when the `RootEditable` has `$display === "block single-line"`, because in that case no `ScopedEditable` ancestor with `$display === "block multi-line"` exists. In a multi-line editor the function always resolves a segment, using the innermost `"block multi-line"` `ScopedEditable` that contains both boundary points (which may be a `NestedEditable` if the selection is inside one).

The start/end lines returned by the segment are always **direct children** of the enclosing `ScopedEditable` — not arbitrarily deep descendants. If `fromNode` is nested inside a `BlockComponent`, the segment resolves to the `BlockComponentLine` that contains it.

The boundary points are auto-normalized to DOM order. Requires that both points are in an editable zone.

**`BlockWrappableSegment` API:**

```ts
class BlockWrappableSegment {
  // Returns the direct-child line boundaries inside the enclosing ScopedEditable.
  getLineBoundaries(): { startLine: Line; endLine: Line }

  // Returns the ScopedEditable that is the direct parent of both lines.
  getCommonScopedEditable(): ScopedEditable

  // Returns a segment for the parent context, or null if there is no outer BlockComponent.
  getUpperSegment(): BlockWrappableSegment | null

  // Moves the selected lines into the given block component.
  // blockComponentLine — the container BlockComponentLine
  // target — the NestedEditable or List that will receive the selected lines
  wrapInto(params: {
    blockComponentLine: BlockComponentLine;
    target: NestedEditable | List;
  }): void
}
```

`wrapInto` re-validates that the line boundaries are still wrappable at call time — if the tree changed since `getBlockWrappableSegment` was called (e.g. another mutation happened), it throws. Always call `wrapInto` synchronously after getting the segment.

**`getUpperSegment()`** walks up from the current `ScopedEditable` to the nearest outer `ScopedEditable` and returns a `BlockWrappableSegment` representing the single line in that outer scope that contains the current one. Returns `null` if there is no outer `ScopedEditable`. Use this when you want to operate on the outer block rather than its inner content — for example, to move the entire blockquote element rather than the lines inside it.

**Checking whether wrapping is permitted — `$$allowedComponents`**

The engine allows nested block components by default. Restrictions are expressed via `$$allowedComponents` on the `ScopedEditable`. To check if a specific component type is allowed before wrapping:

```ts
const blockWrappableSegment = editorAPI.getBlockWrappableSegment({
  fromNode,
  fromOffset,
  toNode,
  toOffset,
});

if (!blockWrappableSegment) {
  return false; // single-line editor
}

const scopedEditable = blockWrappableSegment.getCommonScopedEditable();
const { $$allowedComponents } = scopedEditable;

if ($$allowedComponents === null) {
  // null means no restrictions — all components are allowed
  return true;
}

const isAllowed = allowedComponents.every((componentName) =>
  $$allowedComponents.includes(componentName),
);
```

**Example — wrapping selected lines into a blockquote:**

```ts
const segment = editorAPI.getBlockWrappableSegment({
  fromNode: selection.fromText,
  fromOffset: selection.fromOffset,
  toNode: selection.toText,
  toOffset: selection.toOffset,
});

if (segment) {
  const leftHolder = createBlockComponentTextHolder();
  const rightHolder = createBlockComponentTextHolder();
  const nestedEditable = createNestedEditable({ display: "block multi-line", /* ... */ });
  const blockComponent = createBlockComponent({ childNodes: [nestedEditable], /* ... */ });
  const blockComponentLine = createBlockComponentLine({
    leftBlockComponentTextHolder: leftHolder,
    blockComponent,
    rightBlockComponentTextHolder: rightHolder,
  });

  segment.wrapInto({ blockComponentLine, target: nestedEditable });
}
```

---

## Wrapping — inline components

### `getInlineWrappableSegments(params)`

```ts
getInlineWrappableSegments(params: {
  fromNode: ContentFlowNode;
  fromOffset: number;
  toNode: ContentFlowNode;
  toOffset: number;
}): InlineWrappableSegment[]
```

Resolves zero or more `InlineWrappableSegment`s for the given range. Unlike `getBlockWrappableSegment`, this returns an array because a multi-line selection spans multiple `ContentLine`s — one segment per line.

- **Same-ContentLine selection** — returns 0 or 1 segment. Returns 0 if the range contains no `RangeSensitiveNode` (e.g. the selection is collapsed on a `BeamText`).
- **Cross-ContentLine selection** — returns one segment per block `ContentLine` in the range. Each is clipped to the selection boundaries on the first and last line; middle lines get full-line segments. `ContentLine`s with no wrappable content are excluded.

The boundary points are auto-normalized to DOM order. Requires editable zone validation.

**`InlineWrappableSegment` API:**

```ts
class InlineWrappableSegment {
  // Returns the text-level boundary points for this segment.
  getBoundaryPoints(): {
    startText: FormattableText | InlineComponentText;
    startOffset: number;
    endText: FormattableText | InlineComponentText;
    endOffset: number;
  }

  // Returns the block ContentLine that contains this segment.
  getContentLine(): ContentLine

  // Returns a segment for the surrounding InlineComponent, or null if not inside one.
  getUpperSegment(): InlineWrappableSegment | null

  // Returns all InlineComponents that are fully contained within this segment.
  getInlineComponentListInSegment(): InlineComponent[]

  // Moves the selected text into the given inline component.
  // inlineComponent — the container element
  // target — the NestedEditable that will receive the selected text
  wrapInto(params: {
    inlineComponent: InlineComponent;
    target: NestedEditable;
  }): void
}
```

**`getUpperSegment()`** walks up one level to the outer `InlineComponent` and returns a segment whose boundary points sit at the edges of that outer context (the `InlineComponentText` sentinels adjacent to it). Returns `null` when the segment is already at the top level of the block `ContentLine` (no enclosing `InlineComponent`).

Use this when a component must always wrap at the **topmost** level of the `ContentLine`. For example: the user has a selection inside a "link" component and wants to add a "comment" component — but "comment" is designed to always sit at the top level, never nested inside other inline components. In that case, call `getUpperSegment()` repeatedly until it returns `null`, then wrap that outermost segment with the comment:

```ts
let segment = inlineWrappableSegment;
let upper = segment.getUpperSegment();
while (upper !== null) {
  segment = upper;
  upper = segment.getUpperSegment();
}
// segment is now at the topmost level of the ContentLine
segment.wrapInto({ inlineComponent: commentContext, target: commentEditable });
```

**Example — wrapping selection into a link:**

```ts
const segments = editorAPI.getInlineWrappableSegments({
  fromNode: selection.fromText,
  fromOffset: selection.fromOffset,
  toNode: selection.toText,
  toOffset: selection.toOffset,
});

for (const segment of segments) {
  const inlineComponent = createInlineComponent({ /* ... */ });
  const nestedEditable = createNestedEditable({ /* ... */ });
  inlineComponent.$$append(nestedEditable);

  segment.wrapInto({ inlineComponent, target: nestedEditable });
}
```

---

## Replacing a component

### `replaceComponentTop(fromComponentTop, callback)`

```ts
replaceComponentTop<TComponentTop extends ComponentTop>(
  fromComponentTop: TComponentTop,
  callback: (extractedLines: Line[]) => TComponentTop,
): void
```

Replaces a `ComponentTop` (an `InlineComponent` or a `BlockComponentLine`) with a different `ComponentTop`, while preserving the `Line`s nested inside it. Use this to convert between the inline and block forms of a nested component (e.g. promoting an inline code span into a block codeblock, or the reverse) without losing its content.

- `fromComponentTop` — the `ComponentTop` to replace. Must be contained by the `RootEditable`.
- `callback` — receives `extractedLines`, the `Line`s that were nested inside `fromComponentTop`, and must return the new `ComponentTop` to install in its place.

After replacement, `LiveBoundaryPoints` is collapsed to the end of the newly inserted `ComponentTop`.

```ts
editorAPI.replaceComponentTop(inlineCodeComponent, (extractedLines) => {
  const nestedEditable = createNestedEditable({
    content: { type: "default" },
    display: "block multi-line",
    childNodes: extractedLines,
  });

  return createBlockComponentLine({
    leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
    blockComponent: createBlockComponent({
      componentName: "codeblock",
      content: { type: "custom" },
      childNodes: [nestedEditable],
    }),
    rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
  });
});
```

---

## Persistence snapshot

### `createStoredSnapshot()`

```ts
createStoredSnapshot(): StoredSnapshot
```

Creates a serializable snapshot of the current editor content for **persistence** (e.g. saving to a database). Returns:

```ts
interface StoredSnapshot {
  version: string;                                     // core version at snapshot time
  snapshot: RootEditableSnapshot;                      // full tree snapshot
  glyphFormatterInlineTagsOrder: GlyphFormatterInlineTag[]; // serialization order
}
```

`StoredSnapshot` differs from the undo/redo snapshot format in one key way: **it does not include caret position**. Caret position is ephemeral and meaningless for storage.

The snapshot is a deep, plain-object representation of the entire editor tree — every element, attribute, and text node, recursively. It can be safely serialized to JSON.

To restore a `StoredSnapshot`, pass it as `rootEditableFrom` to `createEditorAPI`:

```ts
const { editorAPI } = createEditorAPI({
  rootEditableFrom: {
    type: "snapshot",
    storedSnapshot,
  },
  shadowRootOptions: { mode: "open", serializable: true },
});
```

**Note:** `createStoredSnapshot()` snapshots the current live state of the editor. If you need to capture state at a specific undo/redo step, first call `stepTo({ index })` on the `SnapshotTimeline` (obtained via `editorAPI.getSnapshotTimeline()`), then call `createStoredSnapshot()`.

---

## Destroying the editor

### `destroy()`

```ts
destroy(): void
```

Tears down the editor instance: walks the tree to release per-node interactive bindings, then unregisters the instance from internal bookkeeping. Call this when the editor is being permanently removed (e.g. unmounting `editorAPI.host` from the document) to avoid leaking listeners and internal state. Does not remove `editorAPI.host` from the document itself — remove it separately if it's still attached.

---

## Events (cross-references)

**`subscribeEditorEvent(params)`** — subscribe to editor lifecycle events (`"editor-selection-change"`, `"selection-styles-change"`, etc.). See [section 10 — Events](#10-events) for the full event type reference, payloads, and dispatch order.

**`flushEditorEvents()`** — dispatch any pending editor events immediately instead of waiting for the microtask. See [section 10 — Events](#10-events) for the microtask batching behavior this bypasses.

**`registerDOMEvent(params)`** — register DOM event listeners on `EditorElement`s via a centralized `when` predicate. See [section 10 — Events](#10-events) for the full specification, the reason to prefer this over `.addEventListener`, and read-only mode behavior.

**`registerEventInterceptor(params)`** — intercept events (`"keydown"`, `"beforeinput"`, `"paste"`, `"copy"`, `"cut"`, `"dragstart"`, `"dragenter"`, `"dragover"`, `"dragleave"`, `"drop"`, `"dragend"`) before the engine processes them. Return `true` from the interceptor to cancel engine handling. See [section 10 — Events](#10-events) for the full specification and the difference from `registerDOMEvent`.