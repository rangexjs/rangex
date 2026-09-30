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
  version: number;
  snapshot: RootEditableSnapshot;
  glyphFormatterInlineTagsOrder: GlyphFormatterInlineTag[];
}
```

`version` is the package's snapshot version at the time the snapshot was created. It only changes on a main version bump of the package, and it tells `migrateStoredSnapshot` which migrations a persisted snapshot still needs (see [Migrating a `StoredSnapshot`](#migrating-a-storedsnapshot)).

`snapshot` is a recursive plain-object serialization of the entire `RootEditable` tree. Every element and text node is captured as a data object with no DOM references — it is fully JSON-serializable and safe to send to a backend or write to `localStorage`.

`glyphFormatterInlineTagsOrder` is stored alongside the tree because it is configuration that is tightly coupled to the content: it determines both how HTML is serialized and how inline tag styles cascade. Storing it with the snapshot ensures that restoring the content also restores the correct rendering behavior, even if the configuration changes between sessions.

**Creating a `StoredSnapshot`:**

```ts
const storedSnapshot = editorAPI.createStoredSnapshot();
// → StoredSnapshot — safe to JSON.stringify and persist
```

Call this whenever you want to save the current content — e.g. on `editorSelectionChange`, on a debounced timer, or when the user explicitly saves.

**Restoring from a `StoredSnapshot`:**

Always run the persisted snapshot through `migrateStoredSnapshot` first, then pass the result to `createEditorAPI` instead of a `RootEditable` node:

```ts
import { createEditorAPI, migrateStoredSnapshot } from "@rangex/core";

const result = migrateStoredSnapshot({ storedSnapshot: JSON.parse(savedJson) });

if (!result.isValid) {
  throw new Error(result.reason);
}

const { editorAPI } = createEditorAPI({
  rootEditableFrom: {
    type: "snapshot",
    storedSnapshot: result.storedSnapshot,
  },
  shadowRootOptions: { mode: "open", serializable: true },
});
```

The engine reconstructs the full `RootEditable` tree from the snapshot and mounts it. All `EditorNode`s are re-created and re-extended with their `$$`-prefixed API. The caret is not restored — `LiveBoundaryPoints` starts at the initial default position.

`createEditorAPI` does **not** migrate or validate the snapshot. It only checks `version` and throws if it doesn't equal the package's snapshot version:

- `version` is older → throws `"StoredSnapshot's version is older than the package's version. Migrate it with migrateStoredSnapshot first."`
- `version` is newer → throws `"StoredSnapshot's version is newer than the package's version. Update the package."`
- `version` is not a number that can be compared (e.g. `NaN`) → throws `"StoredSnapshot's version is invalid."`

---

## Migrating a StoredSnapshot

When the shape of `StoredSnapshot` changes in a new main version of the package, snapshots persisted by an older version can't be loaded as they are. `migrateStoredSnapshot` (imported from `"@rangex/core"`) upgrades such a snapshot to the current shape and validates it.

```ts
import { migrateStoredSnapshot } from "@rangex/core";

const result = migrateStoredSnapshot({ storedSnapshot });
```

**Params:**

```ts
interface MigrateStoredSnapshotParams {
  storedSnapshot: UnmigratedStoredSnapshot;
}

/** A StoredSnapshot of any version. Only `version` is trusted, the rest of its shape depends on that version. */
interface UnmigratedStoredSnapshot {
  version: number;
}
```

**Result:**

```ts
type MigrateStoredSnapshotResult =
  | {
      isValid: true;
      didMigrate: boolean;             // true if at least one migration ran
      storedSnapshot: StoredSnapshot;  // current shape, safe to pass to createEditorAPI / createSnapshotView
    }
  | {
      isValid: false;
      reason: string;
    };
```

Always check `isValid` first; `didMigrate` only exists on a valid result. When `didMigrate` is `true`, write the returned `storedSnapshot` back to storage so the migration doesn't run again on the next load.

**What it does, in order:**

1. Checks `version`:
   - not a non-negative integer → `{ isValid: false, reason: "StoredSnapshot's version is invalid." }`
   - newer than the package's snapshot version → `{ isValid: false, reason: "StoredSnapshot's version is newer than the package's version. Update the package." }`
2. Deep-clones the given snapshot — the argument is never mutated.
3. Runs the migrations one version at a time, from the snapshot's `version` up to the package's snapshot version. Migrations only go forward; there is no downgrade.
4. Validates the result:
   - `glyphFormatterInlineTagsOrder` must be an array that contains every `GlyphFormatter` inline tag exactly once, otherwise `{ isValid: false, reason: "GlyphFormatterInlineTagsOrder must contain every inline tag exactly once." }` (or `"GlyphFormatterInlineTagsOrder must be an array."` when it is not an array).
   - `snapshot` must pass the `RootEditableSnapshot` validation (see [SnapshotValidation](#snapshotvalidation)); on failure, `reason` is the validation's reason.
5. Returns `{ isValid: true, didMigrate, storedSnapshot }`.

A malformed snapshot (e.g. a missing `snapshot` field) never throws — any error raised while migrating or validating is returned as `{ isValid: false, reason }`, where `reason` is the error's message.

**Your own migrations:** `migrateStoredSnapshot` only migrates the engine's shape. Changes in your own data inside the snapshot (e.g. the shape of a component's `customStorage`) are not handled by it — run your own migrations on the returned `storedSnapshot` after `migrateStoredSnapshot` succeeded, and before passing it to `createEditorAPI`.

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

`SnapshotView` is a read-only, plain-object rendering of a `StoredSnapshot`, meant for building the output (HTML/DOM) without mounting an editor instance. It is derived one-way from a `StoredSnapshot`: editor-only properties (e.g. `shouldSelectBeforeRemove`) are dropped, and everything needed to build the DOM (tag names, attributes, children) is added.

It is created via `createSnapshotView` (imported from `"@rangex/core"`):

```ts
import { createSnapshotView } from "@rangex/core";

const { snapshotView } = createSnapshotView({ storedSnapshot });

snapshotView.styles  // string — CSS stylesheet text
snapshotView.tree    // ElementView — the root of the view tree
```

Like `createEditorAPI`, `createSnapshotView` does not migrate the snapshot — pass it through `migrateStoredSnapshot` first. It throws the same errors when `version` is older (`"StoredSnapshot's version is older than the package's version. Migrate it with migrateStoredSnapshot first."`), newer (`"StoredSnapshot's version is newer than the package's version. Update the package."`) or not comparable (`"StoredSnapshot's version is invalid."`).

**`snapshotView.styles`**

A CSS text string containing the complete set of default styles required to render the view correctly. This includes display and layout rules for all editor element types, default `ContentLine` and `GlyphFormatter` style attribute values, table column and row sizing rules, inline-tag visual styles derived from `glyphFormatterInlineTagsOrder` (bold, italic, underline, etc.), and internal structural element styles. Inject this into a `<style>` element alongside the rendered view:

```ts
const styleEl = document.createElement("style");
styleEl.textContent = snapshotView.styles;
previewContainer.appendChild(styleEl);
```

**`snapshotView.tree` — the view tree**

A recursive plain-object mirror of the editor tree. Every node is a `NodeView`, which is one of three shapes:

*Element:*
```ts
{
  customStorage: any;                  // value from $$customStorage on the live node
  type: "element";
  localName: string;                   // tag name, e.g. "p", "span", "svg", "math"
  attributes: Record<string, string>;
  childNodes: NodeView[];
}
```

*Text:*
```ts
{
  customStorage: any;                  // value from $$customStorage on the live node
  type: "text";
  data: string;                        // the text content
}
```

*Comment* (only appears inside `DetachedContext` shadow content):
```ts
{
  customStorage: any;                  // always null, kept for consistency
  type: "comment";
  data: string;
}
```

To find out which editor node an element came from, read `attributes["data-rx-editor-role"]` (e.g. `"content-line"`, `"block-component"`).

**Namespaces**

Elements carry no `namespaceURI`. When the tree is turned into an HTML string and parsed by the HTML parser (`innerHTML`, `setHTMLUnsafe`, `DOMParser`), the parser assigns namespaces itself: `svg` and `math` switch to SVG and MathML for their descendants, and `foreignObject`, `desc` and `title` inside SVG switch back to HTML. When creating DOM nodes directly with `document.createElementNS`, apply the same rules: use the SVG namespace from an `svg` element down, the MathML namespace from a `math` element down, and the HTML namespace everywhere else (including inside `foreignObject`).

**`GlyphFormatter` — inline tag expansion**

A `GlyphFormatter` element's `childNodes` are not its raw text children. They are wrapped in plain elements for its active inline tags, nested in the order of `glyphFormatterInlineTagsOrder` (the first active tag is outermost). These wrapper elements have an empty `attributes` object and `customStorage: null`. A `GlyphFormatter` with `inline-tags="strong em"` and the text `"hello"` (with `glyphFormatterInlineTagsOrder` starting with `"strong"`, then `"em"`) produces:

```ts
{
  customStorage: null,
  type: "element",
  localName: "span",
  attributes: { "data-rx-editor-role": "glyph-formatter", /* ... */ },
  childNodes: [
    {
      customStorage: null,
      type: "element",
      localName: "strong",
      attributes: {},
      childNodes: [
        {
          customStorage: null,
          type: "element",
          localName: "em",
          attributes: {},
          childNodes: [{ customStorage: null, type: "text", data: "hello" }]
        }
      ]
    }
  ]
}
```

This mirrors the serialized HTML (`<strong><em>hello</em></strong>`) and lets a renderer walk the tree without applying `glyphFormatterInlineTagsOrder` itself.

**`DetachedContext` — shadow DOM content**

A `DetachedContext` element holds schema-free shadow DOM content. Its only child is a `template` element that carries the shadow root settings as attributes, and whose `childNodes` are the shadow content:

```ts
{
  customStorage: /* ... */,
  type: "element",
  localName: "div",
  attributes: { "data-rx-editor-role": "detached-context", /* ... */ },
  childNodes: [
    {
      customStorage: null,
      type: "element",
      localName: "template",
      attributes: { shadowrootmode: "open", shadowrootserializable: "" },
      childNodes: [ /* element, text and comment nodes, all with customStorage: null */ ]
    }
  ]
}
```

This is declarative shadow DOM. Written out as an HTML string and parsed with a parser entry point that supports it (`setHTMLUnsafe`, `Document.parseHTMLUnsafe`, or a page load), the browser creates the shadow root itself. `innerHTML` ignores `shadowrootmode`, and appending a `template` element created through the DOM API does nothing, so when building DOM nodes directly, detect a `template` child with a `shadowrootmode` attribute, call `attachShadow` on its parent instead, and append the template's children into the shadow root:

```ts
for (const child of node.childNodes) {
  const isShadowRootTemplate =
    child.type === "element" &&
    child.localName === "template" &&
    child.attributes.shadowrootmode !== undefined;

  if (isShadowRootTemplate) {
    const shadowRoot = el.attachShadow({
      mode: child.attributes.shadowrootmode as ShadowRootMode,
      serializable: child.attributes.shadowrootserializable !== undefined,
    });
    for (const shadowChild of child.childNodes) {
      shadowRoot.append(materialize(shadowChild)); // materialize: NodeView → Node
    }
    continue;
  }

  el.append(materialize(child));
}
```

A `DetachedContext` whose `localName` is `"slot"` has no children: a `slot` element cannot host a shadow root.

---

## SnapshotManager

`snapshotManager` is a singleton exported from `"@rangex/core"`, independent of any particular editor instance. It exists so a `StoredSnapshot` can be inspected and edited programmatically without mounting a live editor instance at all — e.g. a server-side job migrating old content, or bulk-editing saved documents. It converts between two plain-object forms of a node that can be used in a server environment — no browser APIs needed:

- **`EditorNodeSnapshot`** — this is what `StoredSnapshot`/`EditorSnapshot` are built from.
- **`EditorNodeDraft`** — the same plain snapshot object, but with a DOM-like navigation/mutation API attached directly onto it, letting you walk and splice it with familiar DOM-style calls. It is **not** a separate class and has no live DOM behind it — it behaves like a detached, in-memory DOM tree, entirely outside the browser and outside any live editor instance.

```ts
import { snapshotManager } from "@rangex/core";
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

Runs full structural validation on a `RootEditableSnapshot` tree — see [SnapshotValidation](#snapshotvalidation) for the complete rules and output shape. This is the single entry point that validates an entire tree top-down; the individual `validate*Snapshot` functions documented there (also exported standalone from `"@rangex/core"`) can be called on any node kind independently, without going through `snapshotManager`.

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

Spec for `EditorNodeSnapshot` structural validation — every `validate*Snapshot` function (one per node kind, all exported from `"@rangex/core"`) follows these rules.

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

- `uniqueId` is a required string, must be non-empty and contain only ASCII letters, digits, `_` and `-` (it is used as part of a CSS anchor name, `--<uniqueId>`, so any other character breaks anchor positioning), and must be unique across the entire tree — no two nodes, anywhere, share the same value. Generation should happen via `createUniqueId`. Format and uniqueness are checked once, by `RootEditable` (see its section below).
- `customStorage` must not be `undefined`, and must survive `JSON.stringify` without throwing (catches `BigInt`s and circular references). This is a deliberately loose check, not a full JSON-shape validation — values that `JSON.stringify` silently coerces or drops instead of rejecting (`Date`s, `Map`s, `Set`s, functions, `Symbol`s, class instances) are not caught; keeping `customStorage` to genuinely plain JSON data is the caller's responsibility.

### Node-by-node requirements

#### RootEditable

- `uniqueId` format and uniqueness are checked here across the whole tree: every node's `uniqueId` must be non-empty, contain only ASCII letters, digits, `_` and `-`, and differ from every other node's `uniqueId`.
- `childNodes` must be non-empty — a `RootEditable` cannot have zero children.
- `display`:
  - `"block multi-line"` — `childNodes` may contain one or more `RootEditableChild` (`ContentLine` or `BlockComponentLine`), in any mix/order.
  - `"block single-line"` — `childNodes` must contain exactly one `ContentLine` (a `BlockComponentLine` is not valid here).
- Every `ContentLine` that is a direct child of `RootEditable` must have a `localName` that is a `BlockContentLineLocalName` (`"p"`, `"h1"`–`"h6"`) — applies under both `display` values.
- `allowedComponents` — whitelist of allowed component `name` values (`InlineComponent` / `BlockComponent`). `null` means no restriction, nothing to check. Otherwise, every outermost `Component` within this `RootEditable`'s scope must have its `name` included in the list.
- `allowedContentLineLocalNames` — whitelist of allowed block `ContentLine` `localName`s (`"p"`, `"h1"`–`"h6"`). `null` means no restriction. Otherwise, every outermost `ContentLine` within this `RootEditable`'s scope must have its `localName` included in the list — except `"p"`, which is always allowed regardless of the list's contents, even an empty `[]` (it's the fallback localName the live engine retags to, so it can never be excluded). This is in addition to, not instead of, the `BlockContentLineLocalName` type check above — the type check confirms the value is a valid block localName at all, this checks it's one this particular `RootEditable` permits.
- `allowedContentLineStyleAttrNames` — no requirement to enforce. A block `ContentLine` always carries every `structuredStyle` key (see [ContentLine](#contentline)); keys outside the list are held at the `localName` default by the live engine, so their presence is not a violation.
- `allowedGlyphFormatterStyleAttrNames` — whitelist of `structuredStyle` keys a `GlyphFormatter` may set. `null` means no restriction. Otherwise, for every outermost `GlyphFormatter` within this `RootEditable`'s scope, every key present in its `structuredStyle` must be included in the list.
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
- `allowedComponents` — whitelist of allowed component `name` values (`InlineComponent` / `BlockComponent`). `null` means no restriction, nothing to check. Otherwise, every outermost `Component` within this `NestedEditable`'s scope must have its `name` included in the list.
- `allowedContentLineLocalNames` — whitelist of allowed block `ContentLine` `localName`s (`"p"`, `"h1"`–`"h6"`). `null` means no restriction. Otherwise, every outermost `ContentLine` within this `NestedEditable`'s scope must have its `localName` included in the list — except `"p"`, which is always allowed regardless of the list's contents, even an empty `[]`. This only has anything to check when `display` is `"block multi-line"` or `"block single-line"` — when `display` is `"inline"`, the only reachable `ContentLine` is always `localName: "span"`, which is never subject to this whitelist (block-only localNames vs. the fixed inline `"span"`), so the check is a no-op.
- `allowedContentLineStyleAttrNames` — no requirement to enforce, same as for `RootEditable`. `"span"` ContentLines are not affected either — their `structuredStyle` has no effect.
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
- `name` must be a non-empty string containing only characters matching the regex `[a-z0-9-]`.
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
- `name` must be a non-empty string containing only characters matching the regex `[a-z0-9-]`.
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
