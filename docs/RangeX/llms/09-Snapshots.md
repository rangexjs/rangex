# 9. Snapshots

RangeX uses two distinct snapshot types, each serving a different purpose:

| Type | Purpose | Includes caret | Persisted? |
|---|---|---|---|
| `StoredSnapshot` | Persistence — save to DB, restore on reload | No | Yes |
| `EditorSnapshot` | In-memory undo/redo — lives in the `SnapshotTimeline` | Yes | No |

They are structurally different objects. `StoredSnapshot` is designed to be JSON-serialized and stored. `EditorSnapshot` contains `UniqueId`-based caret references and is only valid during the same session.

---

## StoredSnapshot

```ts
interface StoredSnapshot {
  version: string;
  snapshot: RootEditableSnapshot;
  glyphFormatterInlineTagsOrder: GlyphFormatterInlineTag[];
}
```

`snapshot` is a recursive plain-object serialization of the entire `RootEditable` tree. Every element and text node is captured as a data object with no DOM references — it is fully JSON-serializable and safe to send to a backend or write to `localStorage`.

`glyphFormatterInlineTagsOrder` is stored alongside the tree because it is configuration that is tightly coupled to the content: it determines both how HTML is serialized and how inline tag styles cascade. Storing it with the snapshot ensures that restoring the content also restores the correct rendering behavior, even if the configuration changes between sessions.

**Creating a `StoredSnapshot`:**

```ts
const storedSnapshot = editorAPI.createStoredSnapshot();
// → StoredSnapshot — safe to JSON.stringify and persist
```

Call this whenever you want to save the current content — e.g. on `editorSelectionChange`, on a debounced timer, or when the user explicitly saves.

**Restoring from a `StoredSnapshot`:**

Pass the snapshot to the `RangeX` constructor instead of a `RootEditable` node:

```ts
const rangeX = new RangeX({
  rootEditableFrom: {
    type: "snapshot",
    storedSnapshot: JSON.parse(savedJson),
  },
  shadowRootOptions: { mode: "open", serializable: true },
});
```

The engine reconstructs the full `RootEditable` tree from the snapshot and mounts it. All `EditorNode`s are re-created and re-extended with their `$$`-prefixed API. The caret is not restored — `LiveBoundaryPoints` starts at the initial default position.

---

## EditorSnapshot

```ts
interface EditorSnapshot {
  editorNodeSnapshot: EditorNodeSnapshot;
  rangeSnapshot: RangeSnapshot;
  tableSelectionSnapshot: TableSelectionSnapshot;
}

interface RangeSnapshot {
  startTextId: UniqueId;
  startOffset: number;
  endTextId: UniqueId;
  endOffset: number;
}

interface TableSelectionSnapshot {
  anchorTableCellId: UniqueId | null;
  focusTableCellId: UniqueId | null;
}
```

`editorNodeSnapshot` is the same recursive tree serialization as in `StoredSnapshot`. `rangeSnapshot` stores the caret position using `UniqueId` references — stable identifiers assigned to each `EditorNode` that survive DOM patching during undo/redo. `tableSelectionSnapshot` captures which table cells were selected (if any).

`EditorSnapshot`s are **not created or pushed by consumers directly**. They are managed entirely by the `SnapshotTimeline` (see [section 11](#11-snapshottimeline)). Consumers signal that a change happened via `registerSnapshotBoundary()`, and the timeline decides when to commit a snapshot.

**Reading the current snapshots:**

```ts
const timeline = editorAPI.getSnapshotTimeline();

timeline.editorSnapshots  // Array<() => EditorSnapshot> — one callback per snapshot in the timeline
timeline.currentIndex     // number — which snapshot is currently active
```

`editorSnapshots` returns an array of callbacks — calling one returns a deep clone of that snapshot. This means only the snapshot you actually read is cloned, so the cost is paid on demand. `currentIndex` is the index of the snapshot the editor is currently at. After `stepBack()` it decrements; after `stepForward()` it increments.

```ts
const getSnapshot = timeline.editorSnapshots[timeline.currentIndex];
const snapshot = getSnapshot(); // EditorSnapshot — a fresh, mutable deep clone
```

---

## SnapshotView

`SnapshotView` is a read-only, plain-object rendering of a `StoredSnapshot`. It is created via `createSnapshotView` (imported from `"rich-text-area"`) and is useful for rendering a content preview without mounting a full `RangeX` editor instance.

```ts
import { createSnapshotView } from "rich-text-area";

const { snapshotView } = createSnapshotView({ storedSnapshot });

snapshotView.styles  // string — CSS stylesheet text
snapshotView.tree    // RootEditableView — plain-object tree
```

**`snapshotView.styles`**

A CSS text string containing the complete set of default styles required to render the view correctly. This includes display and layout rules for all editor element types, default `ContentLine` and `GlyphFormatter` style attribute values, table column and row sizing rules, inline-tag visual styles derived from `glyphFormatterInlineTagsOrder` (bold, italic, underline, etc.), and internal structural element styles. Inject this into a `<style>` element alongside the rendered view:

```ts
const styleEl = document.createElement("style");
styleEl.textContent = snapshotView.styles;
previewContainer.appendChild(styleEl);
```

**`snapshotView.tree` — the view tree**

A recursive plain-object mirror of the editor tree. Each node in the tree follows one of two shapes:

*Element node:*
```ts
{
  type: string;               // data-editor-role name (e.g. "content-line", "glyph-formatter")
  customStorage: any;         // value from $$customStorage on the live node
  namespaceURI: string;       // e.g. "http://www.w3.org/1999/xhtml" (HTML), "http://www.w3.org/2000/svg" (SVG), "http://www.w3.org/1998/Math/MathML" (MathML)
  localName: string;          // tag name (e.g. "p", "span", "svg", "math")
  attributes: Record<string, string>;
  childNodes: EditorNodeView[];
}
```

Use `document.createElementNS(node.namespaceURI, node.localName)` to recreate any element correctly regardless of namespace.

*Text node:*
```ts
{
  type: string;               // e.g. "basic-text", "beam-text"
  customStorage: any;         // value from $$customStorage on the live node
  data: string;               // the text content
}
```


**`GlyphFormatterView` — inline tag expansion**

`GlyphFormatterView` differs from other element views. Its `childNodes` are not the raw text children — they are wrapped in intermediate `GlyphFormatterInlineTagView` nodes representing the active inline tags in their serialization order:

```ts
interface GlyphFormatterInlineTagView {
  type: "glyph-formatter-inline-tag-view";
  namespaceURI: "http://www.w3.org/1999/xhtml";
  localName: GlyphFormatterInlineTag;   // e.g. "strong", "em"
  childNodes: (GlyphFormatterInlineTagView | BasicTextView | OneVisualUnitTextView)[];
}
```

So a `GlyphFormatter` with `inline-tags="strong em"` and text `"hello"` produces:

```ts
{
  type: "glyph-formatter",
  localName: "span",
  attributes: { ... },
  childNodes: [
    {
      type: "glyph-formatter-inline-tag-view",
      localName: "strong",
      childNodes: [
        {
          type: "glyph-formatter-inline-tag-view",
          localName: "em",
          childNodes: [{ type: "basic-text", data: "hello" }]
        }
      ]
    }
  ]
}
```

This mirrors what the serialized HTML output would look like (`<strong><em>hello</em></strong>`) and lets a renderer walk the tree without needing to apply the `glyphFormatterInlineTagsOrder` itself.

**`DetachedContextView` — shadow DOM content**

`DetachedContextView` has `childNodes: NodeView[]` — a generic tree of `{ type: "element" | "text" | "comment", ... }` nodes. This reflects the schema-free shadow DOM content, which has no editor-specific type information.

To render a `DetachedContextView`, call `attachShadow({ mode: "open" })` on the host element and append the materialized `childNodes` into the shadow root — not the element's light DOM. Skip this when `localName` is `"slot"`: a `slot` element can't host a shadow root, and its `childNodes` is always empty:

```ts
const el = document.createElementNS(node.namespaceURI, node.localName);
// set attributes...
if (node.localName !== "slot") {
  const shadowRoot = el.attachShadow({ mode: "open" });
  for (const child of node.childNodes) {
    shadowRoot.append(materialize(child)); // materialize: NodeView → Node
  }
}
```

---

## SnapshotManager

`snapshotManager` is a singleton exported from `"rich-text-area"`, independent of any particular `RangeX` instance. It exists so a `StoredSnapshot` can be inspected and edited programmatically without mounting a live `RangeX` instance at all — e.g. a server-side job migrating old content, or bulk-editing saved documents. It converts between two plain-object forms of a node that can be used in a server environment — no browser APIs needed:

- **`EditorNodeSnapshot`** — this is what `StoredSnapshot`/`EditorSnapshot` are built from.
- **`EditorNodeDraft`** — the same plain snapshot object, but with a DOM-like navigation/mutation API attached directly onto it, letting you walk and splice it with familiar DOM-style calls. It is **not** a separate class and has no live DOM behind it — it behaves like a detached, in-memory DOM tree, entirely outside the browser and outside any live editor instance.

```ts
import { snapshotManager } from "rich-text-area";
```

### `createDraftFromSnapshot(editorNodeSnapshot)`

```ts
createDraftFromSnapshot<T extends EditorNodeSnapshot>(editorNodeSnapshot: T): FromSnapshotToDraft<T>
```

`structuredClone`s the input first (the original is never mutated), then recursively decorates the clone into a `Draft` tree. Use this when you have a stored/persisted `EditorNodeSnapshot` (e.g. loaded from a database) and want to edit it programmatically — reorder children, splice in a new node, remove a subtree — before restoring it into a live `RootEditable` or persisting it again.

### `cloneDraftNode(editorNodeDraft)`

```ts
cloneDraftNode<T extends EditorNodeDraft>(editorNodeDraft: T): T
```

Deep-clones an existing `Draft` node into a fresh, detached `Draft` tree. Equivalent to `Node.cloneNode(true)` for Drafts: use it to duplicate a subtree so it can be inserted elsewhere without sharing state with the original.

### `createSnapshotFromDraft(editorNodeDraft)`

```ts
createSnapshotFromDraft<T extends EditorNodeDraft>(editorNodeDraft: T): FromDraftToSnapshot<T>
```

The finalize step: a plain `structuredClone` with no re-decoration, producing a plain `EditorNodeSnapshot` again — ready to pass to `validate*Snapshot` (see [SnapshotValidation](#snapshotvalidation)), persist, or use as `rootEditableFrom: { type: "snapshot", storedSnapshot }`.

### `validate({ rootEditableSnapshot })`

```ts
validate(params: { rootEditableSnapshot: RootEditableSnapshot }): ValidateSnapshotResult
```

Runs full structural validation on a `RootEditableSnapshot` tree — see [SnapshotValidation](#snapshotvalidation) for the complete rules and output shape. This is the single entry point that validates an entire tree top-down; the individual `validate*Snapshot` functions documented there (also exported standalone from `"rich-text-area"`) can be called on any node kind independently, without going through `snapshotManager`.

**Typical flow:**

```ts
const draft = snapshotManager.createDraftFromSnapshot(storedSnapshot.snapshot);

// ...mutate draft with DOM-like calls (draft.append(...), draft.firstChild.remove(), etc.)...

const editedSnapshot = snapshotManager.createSnapshotFromDraft(draft);

const result = snapshotManager.validate({ rootEditableSnapshot: editedSnapshot });

if (result.isValid) {
  // safe to persist, or restore via rootEditableFrom: { type: "snapshot", storedSnapshot: { ...storedSnapshot, snapshot: editedSnapshot } }
} else {
  console.error(result.reason, result.failedSnapshot);
}
```

---

## SnapshotValidation

Spec for `EditorNodeSnapshot` structural validation — every `validate*Snapshot` function (one per node kind, all exported from `"rich-text-area"`) follows these rules.

### Purpose

Validate an `EditorNodeSnapshot` tree is structurally sound before it's trusted as a valid `StoredSnapshot` — e.g. before persisting to DB, before loading into a live `RootEditable`.

### Core rule: downward-only

Each `EditorNodeSnapshot` kind is validated independently, node by node. A node checks its own props and, if its kind requires specific descendants, checks its children (recursively, as deep as the requirement needs). A node never checks its ancestors or siblings — no upward look, no lateral look.

Example: `InlineComponent` with `content.type === "linked-characters"` requires exactly one `NestedEditable` child with matching `content.type === "linked-characters"`. Validating the `InlineComponent` checks for that `NestedEditable`. Validating that `NestedEditable` does NOT check whether it's contained by an `InlineComponent` — that direction of the relationship is the parent's responsibility, checked once, from the parent's side only.

Consequence: a node's validator is fully determined by its own kind and props. It never needs a "current position in tree" concept. It also means the same node kind can be validated identically whether it's reached top-down from `RootEditable` or validated standalone.

### Traversal

Validation starts at `RootEditableSnapshot` and walks down through `childNodes`. Each node kind:

1. Validates its own required props are present and internally consistent.
2. If its schema requires descendants of a specific kind/shape (not just "any valid child"), locates and validates those descendants meet the requirement.
3. Recurses into `childNodes` (or equivalent child fields — `listItemSnapshotProps`, `tableCellSnapshotProps`, `shadowTreeSnapshot`, etc.) so every reachable node gets its own pass.

A node is valid only if it and everything below it is valid. Validation stops at the first failure encountered (fail-fast) — it does not keep walking to collect every violation in the tree.

### Output shape

Validation does not throw. Every `validate*Snapshot` function returns a result describing whether the node (and everything below it) is valid and, if not, where and why it failed:

```ts
type ValidateSnapshotResult =
  | { isValid: true }
  | {
      isValid: false;
      sourceSnapshot: EditorNodeSnapshot;
      failedSnapshot: EditorNodeSnapshot;
      reason: string;
    };
```

- `sourceSnapshot` is the node whose own validation step is what caught the failure — the actual object reference. Per the downward-only model, a check is often a parent reaching into a child (e.g. `List` checking a `ListItem`'s `NestedEditable.display`), so this is the parent (`List`) whose check body is what failed, not necessarily the node that actually holds the wrong value.
- `failedSnapshot` is the node that actually holds the malformed field — the actual object reference. When a check is purely local (a node validating its own field), `sourceSnapshot` and `failedSnapshot` are the same node; when it's a parent reaching into a child, they differ.
- `reason` is a human-readable explanation specific enough to act on (what was checked, what was expected, what was found).

### Default: type-shape match only

Most props have no structural requirement beyond matching their declared type. Unless a prop's spec below calls out an extra requirement (e.g. "requires a matching descendant"), validating it is just confirming the value satisfies its type — nothing more.

Example: `RootEditableSnapshot.editState` has no cross-node requirement, so validating it only checks the value is a valid `RootEditableEditState`. No further rule to enforce.

`RootEditable` and `NestedEditable` are both `ScopedEditable`s, and both carry `allowed*` restriction props (`allowedComponents`, `allowedContentLineLocalNames`, `allowedContentLineStyleAttrNames`, `allowedGlyphFormatterStyleAttrNames`, `allowedGlyphFormatterInlineTags`). Each restriction is checked against the **outermost** matching node within that `ScopedEditable`'s scope (see [Outermost X](02-KeyDefinitions.md#outermost-x)) — traversal stops at any nested `ScopedEditable` boundary, which validates its own `allowed*` restrictions against its own scope independently.

### Fields shared by every EditorNode

Two fields — `uniqueId` and `customStorage` — appear on every `EditorNodeSnapshot` kind, so instead of repeating them under each node below, they're specified once here.

- `uniqueId` must be a string, not `undefined`, and unique across the entire tree — no two nodes, anywhere, share the same value. Generation should happen via `createUniqueId`. Uniqueness is checked once, by `RootEditable` (see its section below).
- `customStorage` must not be `undefined`, and must survive `JSON.stringify` without throwing (catches `BigInt`s and circular references). This is a deliberately loose check, not a full JSON-shape validation — values that `JSON.stringify` silently coerces or drops instead of rejecting (`Date`s, `Map`s, `Set`s, functions, `Symbol`s, class instances) are not caught; keeping `customStorage` to genuinely plain JSON data is the caller's responsibility.

### Node-by-node requirements

#### RootEditable

- `uniqueId` uniqueness is checked here across the whole tree (see "Fields shared by every EditorNode" above).
- `childNodes` must be non-empty — a `RootEditable` cannot have zero children.
- `display`:
  - `"block multi-line"` — `childNodes` may contain one or more `RootEditableChild` (`ContentLine` or `BlockComponentLine`), in any mix/order.
  - `"block single-line"` — `childNodes` must contain exactly one `ContentLine` (a `BlockComponentLine` is not valid here).
- Every `ContentLine` that is a direct child of `RootEditable` must have a `localName` that is a `BlockContentLineLocalName` (`"p"`, `"h1"`–`"h6"`) — applies under both `display` values.
- `allowedComponents` — whitelist of allowed `componentName` values (`InlineComponent` / `BlockComponent`). `null` means no restriction, nothing to check. Otherwise, every outermost `Component` within this `RootEditable`'s scope must have its `componentName` included in the list.
- `allowedContentLineLocalNames` — whitelist of allowed block `ContentLine` `localName`s (`"p"`, `"h1"`–`"h6"`). `null` means no restriction. Otherwise, every outermost `ContentLine` within this `RootEditable`'s scope must have its `localName` included in the list — except `"p"`, which is always allowed regardless of the list's contents, even an empty `[]` (it's the fallback localName the live engine retags to, so it can never be excluded). This is in addition to, not instead of, the `BlockContentLineLocalName` type check above — the type check confirms the value is a valid block localName at all, this checks it's one this particular `RootEditable` permits.
- `allowedContentLineStyleAttrNames` — whitelist of `structuredStyle` keys a `ContentLine` may set. `null` means no restriction. Otherwise, for every outermost `ContentLine` within this `RootEditable`'s scope, every key present in its `structuredStyle` must be included in the list — a key outside the list is a violation even if its value would otherwise be valid.
- `allowedGlyphFormatterStyleAttrNames` — same as `allowedContentLineStyleAttrNames`, but for the `structuredStyle` keys of every outermost `GlyphFormatter` within this `RootEditable`'s scope.
- `allowedGlyphFormatterInlineTags` — whitelist of inline format tags (e.g. `"strong"`, `"em"`) a `GlyphFormatter` may carry. `null` means no restriction. Otherwise, for every outermost `GlyphFormatter` within this `RootEditable`'s scope, every tag present in its `inlineTagsArray` must be included in the list.

#### NestedEditable

- `childNodes` must be non-empty — a `NestedEditable` cannot have zero children.
- `content`:
  - `{ type: "default" }`, `{ type: "list-item" }`, `{ type: "table-cell" }` — no extra requirement is checked here. Confirming this `NestedEditable`'s `content.type`/`display` actually matches what its parent (`InlineComponent`, `BlockComponent`, `List`, `TableCell`) requires is the parent's job, checked once from the parent's side when the parent is validated — not re-checked here.
  - `{ type: "linked-characters" }` — `display` must be `"inline"`. This is a same-node consistency check (both `content` and `display` are fields on this `NestedEditable`, not a look at its parent or child), and it's what makes the next two rules well-defined. With `display` forced to `"inline"`, the display rule below already guarantees exactly one `ContentLine` child with `localName: "span"`. On top of that, `content.type: "linked-characters"` adds one more requirement: that `ContentLine` must contain at least one `FilledContentLineChild` — a lone `BeamText` (the empty-line sentinel) is not enough, it can never be empty.
- `display`:
  - `"block multi-line"` — `childNodes` may contain one or more `NestedEditableChild` (`ContentLine` or `BlockComponentLine`), in any mix/order. Every direct `ContentLine` child's `localName` must be a `BlockContentLineLocalName` (`"p"`, `"h1"`–`"h6"`).
  - `"block single-line"` — `childNodes` must contain exactly one `ContentLine` (a `BlockComponentLine` is not valid here), and its `localName` must be a `BlockContentLineLocalName`.
  - `"inline"` — `childNodes` must contain exactly one `ContentLine`, and its `localName` must be `"span"`.
- `allowedComponents` — whitelist of allowed `componentName` values (`InlineComponent` / `BlockComponent`). `null` means no restriction, nothing to check. Otherwise, every outermost `Component` within this `NestedEditable`'s scope must have its `componentName` included in the list.
- `allowedContentLineLocalNames` — whitelist of allowed block `ContentLine` `localName`s (`"p"`, `"h1"`–`"h6"`). `null` means no restriction. Otherwise, every outermost `ContentLine` within this `NestedEditable`'s scope must have its `localName` included in the list — except `"p"`, which is always allowed regardless of the list's contents, even an empty `[]`. This only has anything to check when `display` is `"block multi-line"` or `"block single-line"` — when `display` is `"inline"`, the only reachable `ContentLine` is always `localName: "span"`, which is never subject to this whitelist (block-only localNames vs. the fixed inline `"span"`), so the check is a no-op.
- `allowedContentLineStyleAttrNames` — whitelist of `structuredStyle` keys a `ContentLine` may set. `null` means no restriction. Otherwise, for every outermost `ContentLine` within this `NestedEditable`'s scope, every key present in its `structuredStyle` must be included in the list — a key outside the list is a violation even if its value would otherwise be valid. Applies regardless of `display` — both `"span"` and block `ContentLine`s carry `structuredStyle`.
- `allowedGlyphFormatterStyleAttrNames` — whitelist of `structuredStyle` keys a `GlyphFormatter` may set. `null` means no restriction. Otherwise, for every outermost `GlyphFormatter` within this `NestedEditable`'s scope, every key present in its `structuredStyle` must be included in the list.
- `allowedGlyphFormatterInlineTags` — whitelist of inline format tags (e.g. `"strong"`, `"em"`) a `GlyphFormatter` may carry. `null` means no restriction. Otherwise, for every outermost `GlyphFormatter` within this `NestedEditable`'s scope, every tag present in its `inlineTagsArray` must be included in the list.

#### ContentLine

- `childNodes` must be either exactly one `BeamText` and nothing else (the "empty" case — `BeamText` is the sentinel that prevents the line from collapsing), or at least one `FilledContentLineChild` (any `ContentLineChild` except `BeamText`) with no `BeamText` present at all (the "non-empty" case). A mix of `BeamText` alongside real content is not valid — `BeamText` only ever appears alone.
- In the non-empty case, `InlineComponentText` alone doesn't count as content: at least one child must be neither `BeamText` nor `InlineComponentText` (it may still appear alongside real content).
- `structuredStyle`:
  - If `localName` is a `BlockContentLineLocalName` (`"p"`, `"h1"`–`"h6"`) — `structuredStyle` is required to fully match `ContentLineStructuredStyle` (not `Partial<ContentLineStructuredStyle>`): every key it defines must be present with a valid value. Missing even one key is a violation.
  - If `localName` is `"span"` — `structuredStyle` is meaningless: whether it's empty, partial, or fully populated makes no difference, since it has no effect either way. No requirement to enforce.
- `styleAttrs` must always be an empty object (`{}`), regardless of `localName`. A `ContentLine`'s style is expressed exclusively through `structuredStyle` — raw CSS `styleAttrs` is never used on this node.

#### BeamText

- No rules.

#### GlyphFormatter

- `childNodes` must be non-empty.
- `structuredStyle` — optional, no restriction beyond the base type shape (`Partial<GlyphFormatterStructuredStyle>`); any subset of keys, including none, is valid.
- `inlineTagsArray` — optional, no restriction beyond the base type shape; any subset of `GlyphFormatterInlineTag`, including an empty array, is valid.
- `styleAttrs` must always be an empty object (`{}`). A `GlyphFormatter`'s style is expressed exclusively through `structuredStyle` — raw CSS `styleAttrs` is never used on this node.

#### BasicText

- `data` must not be empty.
- `data` must contain only single-code-point characters — no multi-code-point glyphs (surrogate pairs, emoji, grapheme clusters).

#### OneVisualUnitText

- `data` must not be a single-code-point character — that belongs in `BasicText`. `data` here is treated as one atomic unit regardless of how many code points it contains (e.g. deleting it removes all of `data` at once), so multiple code points forming a single visual unit — a surrogate pair, emoji, or multi-code-point grapheme cluster (including ZWJ sequences) — are all valid.

#### InlineComponent

- `childNodes` must be non-empty.
- `componentName` must be a non-empty string containing only characters matching the regex `[a-z0-9-]`.
- `content`:
  - `{ type: "custom" }` — `childNodes` may contain zero or more outermost `NestedEditable` nodes. Every outermost `NestedEditable` must have `content.type: "default"` and `display: "inline"`.
  - `{ type: "linked-characters" }` — `childNodes` must contain exactly one outermost `NestedEditable` node, and it must have `content.type: "linked-characters"`. `display: "inline"` on that `NestedEditable` doesn't need a separate check here — it's already guaranteed by the `NestedEditable`'s own validation (`content.type: "linked-characters"` requires `display: "inline"`, see the `NestedEditable` section above).

#### InlineComponentText

- No rules.

#### BlockComponentLine

- `childNodes` must be exactly `[BlockComponentTextHolder, BlockComponent, BlockComponentTextHolder]`, in that order.

#### BlockComponentTextHolder

- `childNodes` must contain exactly one `BlockComponentText`.

#### BlockComponentText

- No rules.

#### BlockComponent

- `childNodes` must be non-empty.
- `componentName` must be a non-empty string containing only characters matching the regex `[a-z0-9-]`.
- A `NestedEditable` living inside a `List` or `Table` is still technically the outermost `NestedEditable` from `BlockComponent`'s point of view (there's no other `NestedEditable` between it and here), but `BlockComponent` skips it entirely wherever this section talks about "outermost `NestedEditable`" below: validating it is the `List`/`Table`'s responsibility, not `BlockComponent`'s.
- `content`:
  - `{ type: "custom" }` — `childNodes` may contain zero or more outermost `NestedEditable`, `List`, and `Table` nodes, in any mix/order. Every outermost `NestedEditable` must have `content.type: "default"`.
  - `{ type: "list" }` — `childNodes` must contain exactly one `List`, and no `NestedEditable` outside of it.
  - `{ type: "styled-block" }` — `childNodes` must contain exactly one outermost `NestedEditable` with `content.type: "default"`.
- Every outermost `NestedEditable` must have `display: "block multi-line"` or `display: "block single-line"`.

#### HTMLLayout

- No rules.

#### SVGLayout

- No rules.

#### MathMLLayout

- No rules.

#### List

- `childNodes` must contain at least one `ListItem`.
- For every `ListItem` in `childNodes`, its outermost `NestedEditable` must have:
  - `display: "block multi-line"` if `lineType` is `"multi-line"`, or `display: "block single-line"` if `lineType` is `"single-line"`.
  - `editState: "inherit"`.
  - `content.type: "list-item"` is not checked here — that's `ListItem`'s own responsibility, see below.
- `listItemSnapshotProps` is a stored blueprint used to create future `ListItem`s, not a live node reachable elsewhere in the tree, so it's validated by its own dedicated rules instead of the normal `NestedEditable` rules:
  - `listItemSnapshotProps.childNodes` must contain exactly one outermost `NestedEditable`.
  - That `NestedEditable`'s `display` must match `lineType` the same way as above (`"block multi-line"` for `"multi-line"`, `"block single-line"` for `"single-line"`).
  - That `NestedEditable`'s `content.type` must be `"list-item"`.
  - That `NestedEditable`'s `childNodes` must be empty. This is the opposite of the normal `NestedEditable` rule ("`ContentFlowNode` can't be empty") — the blueprint's `NestedEditable` is a template that hasn't been populated with real content yet, so it's required to start empty rather than forbidden from being empty.

#### ListItem

- `childNodes` must contain exactly one outermost `NestedEditable`, and it must have `content.type: "list-item"`.

#### Table

- `colGroups` — every value must be greater than `0`, and the values must sum to exactly `1000`. The array's length must match the actual number of columns (see the `childNodes` rule below).
- `rowGroups` — must be non-empty, and every value must be at least `minRowHeight`. The array's length must match the actual number of rows (see the `childNodes` rule below).
- `minColWidth` must be at least `20`.
- `minRowHeight` must be at least `20`.
- `defaultRowHeight` must be at least `20`.
- `childNodes` must be either empty, or fully describe a structure consistent with `colGroups`/`rowGroups`:
  - The first entry must be a `TableColGroup`, and its own `childNodes` (its `TableCol` elements) must have a length equal to `colGroups.length` — this is the "actual number of columns" `colGroups` is checked against above.
  - Every entry after that must be a `TableSection`, and there must be at least one. No two `TableSection`s may share the same `localName` — at most one `"thead"`, one `"tbody"`, and one `"tfoot"`.
  - Flattening every `TableRow` across all `TableSection`s, in document order, gives the actual number of rows — this is what `rowGroups.length` is checked against above.
  - Every `TableCell` across every `TableRow`, accounted for by its `colSpan`/`rowSpan`, must tile the `rowGroups.length` × `colGroups.length` grid exactly: every coordinate in that grid is covered by exactly one `TableCell` — no gaps, no overlaps.
  - Every `TableCell` must be nested under the `TableRow` its span begins in, not merely a `TableRow` it happens to cover via `rowSpan`. A `TableCell` spanning multiple rows is only "contained" by the first of them — if it's listed under a later row instead, that's invalid even though the grid still tiles without gaps or overlaps.
  - Every `TableCell`'s outermost `NestedEditable` must have `editState` equal to the `Table`'s own `tableCellsEditable` value.
- `tableCellSnapshotProps` is a stored blueprint used to create future `TableCell`s, not a live node reachable elsewhere in the tree, so it's validated by its own dedicated rules instead of the normal `NestedEditable` rules:
  - `tableCellSnapshotProps.childNodes` must contain exactly one outermost `NestedEditable`.
  - That `NestedEditable`'s `content.type` must be `"table-cell"`.
  - That `NestedEditable`'s `display` must be `"block multi-line"`.
  - That `NestedEditable`'s `childNodes` must contain exactly one `ContentLine`, and that `ContentLine` must contain exactly one `BeamText`.

#### TableColGroup

- No rules.

#### TableCol

- No rules.

#### TableSection

- `childNodes` must be non-empty.

#### TableRow

- `childNodes` must be non-empty.

#### TableCell

- `childNodes` must contain exactly one outermost `NestedEditable`.
- That `NestedEditable`'s `content.type` must be `"table-cell"`.
- That `NestedEditable`'s `display` must be `"block multi-line"`.

#### DetachedContext

- If `localName` is `"slot"`, `shadowTreeSnapshot` must be empty — a `"slot"` element can't host a shadow root, so it can never actually be constructed live with shadow content.
- Otherwise, `shadowTreeSnapshot` has no rules beyond each entry being a valid `NodeSnapshot` — no further structural requirement on top of that, since its content is schema-free by design.
