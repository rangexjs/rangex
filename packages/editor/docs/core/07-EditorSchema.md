# 7. EditorSchema

The EditorSchema is a set of structural rules that governs how `EditorNode`s may be nested within a `RootEditable` — defining valid parent, child, and sibling relationships between node types, and the property constraints each node must satisfy. All descendants of a `RootEditable` are subject to the schema. The only exception is `DetachedContext`'s shadow DOM, which is a schema-free zone.

## Structural relationships

Each node type has typed `Parent`, `Sibling`, and `Child` constraints, shown as type aliases in [section 4](#4-editor-node-types) for every node type:

```ts
type ContentLineParent  = RootEditable | NestedEditable
type ContentLineSibling = ContentLine | BlockComponentLine
type ContentLineChild   = BeamText | GlyphFormatter | BasicText
                        | OneVisualUnitText | InlineComponent
                        | InlineComponentText
```

The `$$`-prefixed mutation methods on each node use these types as their parameter types — TypeScript prevents inserting a structurally invalid node at compile time.

## Enforcement

**At mutation time** — all structural changes inside a `RootEditable` must go through the `$$`-prefixed mutation methods, which route through `UpdateStructure` internally. Direct DOM manipulation (`appendChild`, `removeChild`, etc.) bypasses the schema and must not be used.
**At insertion time** — additional invariants are enforced each time a node is inserted into a `RootEditable`:

- Every `ContentFlowNode` must have at least one child so `LiveBoundaryPoints` always has a valid text node to point into. This is validated at insertion time and the engine never auto-injects children — the caller is always responsible. The one exception is `InlineComponentText` sentinels: the engine auto-manages these around `InlineComponent` nodes on insertion (see [`InlineComponent` in section 4](#inlinecomponent)).

**Post-mutation normalization** — after each mutation pipeline completes, the engine runs a normalization pass that silently corrects `$$allowed*` violations. No error is thrown; disallowed content is adjusted automatically:

- `$$allowedComponents` — a `Component` whose `$$name` is not in the list is automatically unwrapped (its content moved to the parent, the element removed)
- `$$allowedContentLineLocalNames` — a block `ContentLine` with a `localName` not in the list has its tag changed to `"p"`. Inline `"span"` ContentLines are not subject to this normalization.
- `$$allowedContentLineStyleAttrNames` — style attributes on a block `ContentLine` not in the list are reset to the default for its `localName` (from `$$contentLineLocalNamesStyle`), not removed — block `ContentLine`s always carry every style key. Inline `"span"` ContentLines are not subject to this normalization.
- `$$allowedGlyphFormatterStyleAttrNames` — style attributes on a `GlyphFormatter` not in the list are removed
- `$$allowedGlyphFormatterInlineTags` — inline tags on a `GlyphFormatter` not in the list are removed

**Intentionally unenforced during mutation** — some rules are enforced only at the public API boundary, not at every intermediate mutation step (which would make complex multi-step operations unnecessarily difficult):

- A `linked-characters` `NestedEditable`'s `ContentLine` must contain a `FilledContentLineChild`.
- A `List` must contain at least one `ListItem`.

## Display modes

`RootEditable` and `NestedEditable` each have a `$display` property that constrains their children:

| `$display` | Allowed children | Required `ContentLine.localName` |
|---|---|---|
| `"block multi-line"` | One or more `Line` nodes (`ContentLine` or `BlockComponentLine`) | `BlockContentLineLocalName` (`"p"` \| `"h1"`–`"h6"`) |
| `"block single-line"` | Exactly one `ContentLine` (block layout) | `BlockContentLineLocalName` (`"p"` \| `"h1"`–`"h6"`) |
| `"inline"` | Exactly one `ContentLine` (inline layout) | `"span"` |

## Content types

`InlineComponent` and `BlockComponent` have a `$content.type` that constrains their inner structure:

**`InlineComponent.$content.type`:**

| Value | Rule |
|---|---|
| `"custom"` | Zero or more outermost `NestedEditable`s; each must have `$content.type = "default"` and `$display = "inline"` |
| `"linked-characters"` | Exactly one outermost `NestedEditable` with `$content.type = "linked-characters"` and `$display = "inline"` |

An `InlineComponentText` sentinel is always inserted on any side of an `InlineComponent` that has no sibling.

**`BlockComponent.$content.type`:**

| Value | Rule |
|---|---|
| `"custom"` | Zero or more outermost `NestedEditable`, `List`, and `Table` nodes; each outermost `NestedEditable` must have `$content.type = "default"` and `$display = "block multi-line"` or `"block single-line"` |
| `"list"` | Exactly one outermost `List`; no other `NestedEditable` outside the `List` |
| `"styled-block"` | Exactly one outermost `NestedEditable` with `$content.type = "default"` |

## Other node-specific rules

**`ContentLine`:** Empty → must contain a `BeamText`. Non-empty → must contain a `FilledContentLineChild` (any `ContentLineChild` except `BeamText`).

**`BlockComponentLine`:** Fixed structure: `[BlockComponentTextHolder, BlockComponent, BlockComponentTextHolder]`.

**`BlockComponentTextHolder`:** Must contain a `BlockComponentText`.

**`List`:** `$lineType` determines the `$display` of the outermost `NestedEditable` in each `ListItem` — `"multi-line"` → `"block multi-line"`, `"single-line"` → `"block single-line"`. The outermost `NestedEditable`'s `$editState` must be `"inherit"`.

**`ListItem`:** Must contain exactly one outermost `NestedEditable` with `$content.type = "list-item"`.

**`TableCell`:** Must contain exactly one outermost `NestedEditable` with `$content.type = "table-cell"` and `$display = "block multi-line"`.
