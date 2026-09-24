# 4. Editor Node Types

## Node collections

These TypeScript union types define the categories every EditorNode belongs to. They are the ground truth for type narrowing throughout the API.

```ts
// Top-level union
type EditorNode = EditorElement | EditorText

// Element categories
type EditorElement =
  | ScopedEditable
  | Line
  | GlyphFormatter
  | Component
  | BlockComponentTextHolder
  | LayoutUnit
  | DetachedContext

type ScopedEditable = RootEditable | NestedEditable
type Line           = ContentLine | BlockComponentLine
type Component  = InlineComponent | BlockComponent
type LayoutUnit     =
  | HTMLLayout | SVGLayout | MathMLLayout
  | List | ListItem
  | Table | TableSection | TableRow | TableCell | TableCol | TableColGroup

// Text categories
type EditorText         = BeamText | BasicText | OneVisualUnitText | ComponentText
type ComponentText  = InlineComponentText | BlockComponentText

// Cross-cutting categories

/** All EditorNodes except LayoutUnit and DetachedContext. The only nodes LiveBoundaryPoints can point into. */
type ContentFlowNode = Exclude<EditorNode, LayoutUnit | DetachedContext>

/** Elements that carry an EditState (contenteditable logic). */
type EditStateElement = ScopedEditable | Component | List

/** The Line-level anchor of a nested component: an InlineComponent, or the BlockComponentLine of a BlockComponent. */
type ComponentTop = InlineComponent | BlockComponentLine

/** Elements that support StructuredStyle (CSS properties via API). */
type StructuredStyleElement = ContentLine | GlyphFormatter

/** ContentFlowNodes where a boundary-point selection is meaningful. */
type SelectableNode = EditorText | Component

/** Texts that can carry inline formatting (children of GlyphFormatter). */
type FormattableText = BasicText | OneVisualUnitText

/** SelectableNodes where the offset within the node matters. */
type RangeSensitiveNode = FormattableText | Component

/** SelectableNodes where the offset has no impact. */
type RangeNeutralNode = BeamText | ComponentText

// Utility collections
type FilledContentLineChild = Exclude<ContentLineChild, BeamText>
type ContentLineText        = Extract<EditorText, ContentLineChild>
type TablePart              = Table | TableCell | TableColGroup | TableCol | TableSection | TableRow
type ListPart               = List | ListItem
```

## DOMPublicPropsBase

Every EditorNode exposes the following traversal properties. All types are narrowed to the valid EditorNode types for that node — not raw DOM types.

| Property | Description |
|---|---|
| `$$parentElement` | Typed parent (or `null`) |
| `$$childNodes` | Typed child array |
| `$$firstChild` / `$$lastChild` | Typed first/last child |
| `$$previousSibling` / `$$nextSibling` | Typed siblings |
| `$$editorRole` | The `data-editor-role` string of this node |
| `$$rootEditable` | The `RootEditable` this node belongs to |
| `$$isContentEditable` | Whether the node is currently editable in the DOM |
| `$$customStorage` *(get/set)* | `any`. Free-form slot for consumer use. Must be JSON-serializable (string, number, boolean, null, plain objects, or arrays). |

## RootEditable

- **HTML element:** `div`
- **`data-editor-role`:** `root-editable`
- **Category:** `ScopedEditable`

```ts
type RootEditableParent  = null
type RootEditableSibling = null
type RootEditableChild   = ContentLine | BlockComponentLine
```

The top-level container for all editor content. Every `EditorNode` tree lives under exactly one `RootEditable`. It owns one `LiveBoundaryPoints` instance — analogous to how `document` owns the `Selection API`.

**`$display`** determines the layout constraint on its children:
- `"block multi-line"` — can hold one or more `Line` nodes
- `"block single-line"` — restricted to a single `ContentLine`

**`$editState`** is `"true" | "false"`. When `isTextAreaEditable` is set to `false` on the `EditorAPI`, `contenteditable="false"` is forced on all elements regardless of their individual `$editState`.

**Public API:**

- **`$$display`** *(readonly)* — `"block multi-line" | "block single-line"`. Set at construction time, not changeable after.

- **`$$contentLineLocalNamesStyle`** *(get/set)* — `{ p, h1, h2, h3, h4, h5, h6 }` where each key maps to a `ContentLineStructuredStyle`. This is the **default style** applied to a block `ContentLine` when no explicit style is defined on it. Setting this does not override styles already set on existing lines — it only affects lines whose style is unset. `"span"` ContentLines (inline context) are not covered by this mapping and carry no default styles.

- **`$$allowedComponents`** *(get/set)* — `string[] | null`. Whitelist of allowed component names (the string identifier of an `InlineComponent` or `BlockComponent`). When a component is not in the list, inserting it causes it to be **unwrapped** by the schema — the component element is removed and only its text content is kept. `null` = all components allowed.

- **`$$allowedContentLineLocalNames`** *(get/set)* — `BlockContentLineLocalName[] | null`. Restricts which block `ContentLine` localNames (`"p"`, `"h1"`–`"h6"`) are valid in this editable. Violations are schema-enforced. `null` = all allowed. `"span"` ContentLines in inline NestedEditables are never subject to this constraint.

- **`$$allowedContentLineStyleAttrNames`** *(get/set)* — `ContentLineStyleAttrName[] | null`. Restricts which CSS style attributes may be set on `ContentLine`s. `null` = all allowed.

- **`$$allowedGlyphFormatterStyleAttrNames`** *(get/set)* — `GlyphFormatterStyleAttrName[] | null`. Restricts which CSS style attributes may be set on `GlyphFormatter`s. `null` = all allowed.

- **`$$allowedGlyphFormatterInlineTags`** *(get/set)* — `GlyphFormatterInlineTag[] | null`. Restricts which inline format tags (e.g. `"strong"`, `"em"`) may be applied. `null` = all allowed.

- **`$$prepend(...lines)`** — inserts `ContentLine | BlockComponentLine` nodes at the beginning of the `RootEditable`.

- **`$$append(...lines)`** — inserts `ContentLine | BlockComponentLine` nodes at the end of the `RootEditable`.

## NestedEditable

- **HTML element:** `div`
- **`data-editor-role`:** `nested-editable`
- **Category:** `ScopedEditable`

```ts
type NestedEditableParent  = InlineComponent | BlockComponent | LayoutUnit
type NestedEditableSibling = NestedEditable | LayoutUnit | DetachedContext
type NestedEditableChild   = ContentLine | BlockComponentLine
```

An editable region nested inside a component. Unlike `RootEditable`, it has a parent and can be placed inline or as a block.

**`$display`** — `"block multi-line" | "block single-line" | "inline"`. In addition to the block variants available on `RootEditable`, `NestedEditable` can also be `"inline"` when it lives inside an `InlineComponent`.

**`$editState`** — `"true" | "false" | "inherit"`. The `"inherit"` value means the editable state follows the parent's resolved state. This is the typical value for `NestedEditable`s inside components — the parent `InlineComponent` or `BlockComponent` controls editability.

**`$content`** — describes the semantic role of this editable region:

- `{ type: "default" }` — general purpose. No special constraints beyond the schema rules.

- `{ type: "linked-characters", unwrap: "if-modified" | "if-empty" }` — the text inside is tied to the component identity (e.g. a mention like `@JohnDoe`). The `ContentLine` it contains must always have a `FilledContentLineChild` — it can never be empty. The `unwrap` policy controls when the component is automatically dismantled:
  - `"if-modified"` — unwrap as soon as the user edits the text content
  - `"if-empty"` — unwrap only when the text becomes empty

- `{ type: "list-item" }` — internally managed. Set automatically when created via `createListItem`. Do not set manually.

- `{ type: "table-cell" }` — internally managed. Set automatically when created via `createTableCell`. Do not set manually.

**Public API** (inherits `DOMPublicPropsBase` and `$$allowed*` from `ScopedEditablePublicProps`):

- **`$$content`** *(readonly)* — the `NestedEditableContent` object describing this editable's role.
- **`$$display`** *(readonly)* — the display mode. Set at construction time.
- **`$$prepend(...children)`** / **`$$append(...children)`** — insert `ContentLine | BlockComponentLine` nodes.
- **`$$before(...siblings)`** / **`$$after(...siblings)`** — insert `NestedEditable | LayoutUnit | DetachedContext` nodes adjacent to this one.
- **`$$replaceWith(...replacements)`** — replace this node in the tree.
- **`$$remove()`** — remove this node from its parent.

## ContentLine

- **HTML element:** `p`, `h1`–`h6` (determined by `localName`, configurable at creation)
- **`data-editor-role`:** `content-line`
- **Category:** `Line`

```ts
type ContentLineParent  = RootEditable | NestedEditable
type ContentLineSibling = ContentLine | BlockComponentLine
type ContentLineChild   =
  | BeamText
  | GlyphFormatter
  | BasicText
  | OneVisualUnitText
  | InlineComponent
  | InlineComponentText
```

The main content container. Every paragraph, heading, or single-line of text lives in a `ContentLine`. Its `localName` maps directly to the HTML tag used in the DOM and in serialized output.

**`localName` is constrained by its parent `ScopedEditable`'s `$display`:**
- Block context (`"block multi-line"` or `"block single-line"`) → `BlockContentLineLocalName`: `"p"` | `"h1"`–`"h6"`
- Inline context (`"inline"`) → must be `"span"`

`ContentLineLocalName = BlockContentLineLocalName | "span"`.

**Empty vs non-empty rule:**
- An empty `ContentLine` must contain exactly one `BeamText` — the sentinel that prevents the line from collapsing and gives `LiveBoundaryPoints` a valid node to point to.
- A non-empty `ContentLine` must contain at least one `FilledContentLineChild` (any `ContentLineChild` except `BeamText`).

**`$display`** — `"block" | "inline"`. Reflects the CSS display of the line. `"inline"` applies when the `ContentLine` is inside a `NestedEditable` with `$display: "inline"` (e.g. a single-line inline component).

**Structured style properties** (`ContentLineStyleAttrName`):
`lineHeight`, `paddingBlock`, `paddingInline`, `textAlign`, `textIndent`.
These are the only CSS properties settable on a `ContentLine` via the API. Applied via `updateSelectionStyles` or defaulted from `$$contentLineLocalNamesStyle` on the owning `ScopedEditable`.

**Public API** (inherits `DOMPublicPropsBase`):

- **`$$localName`** *(readonly)* — `ContentLineLocalName`: `"p"` | `"h1"`–`"h6"` for block ContentLines, `"span"` for inline ContentLines.
- **`$$display`** *(readonly)* — `"block"` or `"inline"`.
- **`$$before(...siblings)`** / **`$$after(...siblings)`** — insert `ContentLine | BlockComponentLine` nodes adjacent to this one.
- **`$$replaceWith(...replacements)`** — replace this node in the tree.
- **`$$remove()`** — remove this node from its parent.

> Note: `ContentLine` has no `$$append`/`$$prepend`. Its inline children (text nodes, `GlyphFormatter`s, `InlineComponent`s) are managed through the editor API (`insertNode`, `updateSelectionStyles`, `wrapInto`), not via direct child manipulation.

## GlyphFormatter

- **HTML element:** `span`
- **`data-editor-role`:** `glyph-formatter`
- **Category:** standalone (no named category)

```ts
type GlyphFormatterParent  = ContentLine
type GlyphFormatterSibling = GlyphFormatter | BasicText | OneVisualUnitText | InlineComponent
type GlyphFormatterChild   = BasicText | OneVisualUnitText
```

The inline formatting wrapper. Wraps one or more `FormattableText` nodes and carries both inline tag formatting and CSS styles.

**Key design — flat, never nested:** `GlyphFormatter`s are never nested inside each other. Instead, all active formats on a piece of text are stored flat on a single element via the `inline-tags` attribute (space-separated tag names, e.g. `inline-tags="strong em"`). This eliminates the complexity of splitting, merging, and reordering overlapping format ranges that nested elements would require.

```html
<!-- internal DOM representation -->
<span data-editor-role="glyph-formatter" inline-tags="strong em">hello</span>

<!-- serialized HTML output (order determined by glyphFormatterInlineTagsOrder) -->
<strong><em>hello</em></strong>
```

**Available inline tags** (`GlyphFormatterInlineTag`):
`"b"`, `"code"`, `"del"`, `"em"`, `"i"`, `"ins"`, `"kbd"`, `"mark"`, `"s"`, `"strong"`, `"sub"`, `"sup"`, `"u"`, `"var"`

**Structured style properties** (`GlyphFormatterStyleAttrName`):
`backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `letterSpacing`, `textDecoration`.
These are the only CSS properties settable on a `GlyphFormatter` via the API.

**Inline tag styles** — each inline tag can have its own visual style overrides (configured via `updateGlyphFormatterInlineTagsOrder`). Available style properties per tag: `backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontStyle`, `fontVariant`, `fontWeight`, `letterSpacing`, `paddingInline`, `textDecoration`, `textShadow`, `textTransform`, `verticalAlign`, `wordSpacing`.

**`glyphFormatterInlineTagsOrder`**

An array of `GlyphFormatterInlineTag` that serves two purposes:

1. **HTML serialization order** — when outputting HTML, the flat `inline-tags` attribute is converted to nested elements in this order (e.g. `["strong", "em"]` → `<strong><em>text</em></strong>`).
2. **CSS rule precedence** — default styles for each inline tag are generated as CSS rules in this order. A tag appearing **later** in the array wins when two active tags conflict on the same CSS property (standard cascade — last rule wins).

Default styles per tag: `strong`/`b` → `fontWeight: bolder`, `em`/`i`/`var` → `fontStyle: italic`, `ins`/`u` → `textDecoration: underline`, `del`/`s` → `textDecoration: line-through`, `mark` → `backgroundColor: yellow`, `sub` → `verticalAlign: sub`, `sup` → `verticalAlign: super`, `code`/`kbd` → `fontFamily: monospace`.

Set via `rootEditableFrom: { type: "node", glyphFormatterInlineTagsOrder: [...] }` at init, or updated at runtime via `editorAPI.updateGlyphFormatterInlineTagsOrder(...)`. Stored in `StoredSnapshot` so it persists alongside content.

**Public API** (inherits `DOMPublicPropsBase` only):

`GlyphFormatter` has no node-specific public methods. Consumers never manipulate it directly — all formatting is applied and read through `updateSelectionStyles` and the `selectionStylesChange` event on the `EditorAPI`.

## InlineComponent

- **HTML element:** `span`
- **`data-editor-role`:** `inline-component`
- **Category:** `Component`

```ts
type InlineComponentParent  = ContentLine
type InlineComponentSibling = GlyphFormatter | BasicText | OneVisualUnitText | InlineComponentText
type InlineComponentChild   = NestedEditable | LayoutUnit | DetachedContext
```

The inline component primitive. Used to build any inline component — mentions, links, template variables, spoilers, embeds, etc. Lives directly inside a `ContentLine`.

**`$content`** — `{ type: "custom" } | { type: "linked-characters" }`.
- `"custom"` — general purpose inline component. Can contain zero or more `NestedEditable` nodes, each with `$content.type: "default"` and `$display: "inline"`.
- `"linked-characters"` — the component's identity is tied to its text (e.g. a resolved mention). Must contain exactly one `NestedEditable` with `$content: { type: "linked-characters", unwrap: ... }` and `$display: "inline"`.

**`$editState`** — `"false" | "inherit"`. The `InlineComponent` itself is never the editable root — editability is delegated to its `NestedEditable` children. `"inherit"` means the children's editability follows the parent `ContentLine`'s editable state.

**`InlineComponentText` sentinels** — An `InlineComponentText` is automatically inserted on any side of the `InlineComponent` that has no sibling. This gives the caret a valid text boundary point to land on adjacent to the component during navigation.

**Public API** (inherits `DOMPublicPropsBase`):

- **`$$componentName`** *(readonly)* — the string identifier for this component type. Must match an entry in the owning `ScopedEditable`'s `$$allowedComponents` list, or the component will be unwrapped by the schema.
- **`$$content`** *(readonly)* — the content type of this component.
- **`$$shouldSelectBeforeRemove`** *(get/set)* — when `true`, the component is selected as a unit before being removed (e.g. on backspace/delete), giving the user visual feedback before deletion.
- **`$$shouldSelectOnNavigation`** *(get/set)* — when `true`, navigating the caret into the component selects it as a whole unit rather than entering it.
- **`$$isFullyEditable`** *(readonly)* — `true` when the `InlineComponent` itself is editable (`$isEditStateEditable`) **and** every direct `NestedEditable` child is also editable. Both conditions must hold.
- **`$$isCrossable`** *(readonly)* — `true` when `$content.type === "linked-characters"` and `$isFullyEditable` is `true`. Controls what happens when the caret is **outside** the component and a deletion key (backspace/delete) is pressed toward it:
  - `false` — the component is treated as an atomic unit; the entire component is removed in one operation.
  - `true` — the editor crosses into the component's content and removes characters one by one, as if the component boundary were transparent.
  
  When the caret is already **inside** the component, deletion always operates character by character regardless of `$$isCrossable`.
- **`$$unwrap()`** — dismantles the component and reinserts its inline content into the parent `ContentLine`.
- **`$$prepend(...children)`** / **`$$append(...children)`** — insert `NestedEditable | LayoutUnit | DetachedContext` children.

## BlockComponent

- **HTML element:** `div`
- **`data-editor-role`:** `block-component`
- **Category:** `Component`

```ts
type BlockComponentParent  = BlockComponentLine
type BlockComponentSibling = BlockComponentTextHolder
type BlockComponentChild   = NestedEditable | LayoutUnit | DetachedContext
```

The block component primitive. Used to build any block-level component — codeblocks, blockquotes, collapsibles, etc. Unlike `InlineComponent`, a `BlockComponent` never sits directly inside a `ContentLine` — it always lives inside a `BlockComponentLine`, flanked by a `BlockComponentTextHolder` on each side:

```html
<div data-editor-role="block-component-line">
	<span data-editor-role="block-component-text-holder">#BlockComponentText</span>
	<div  data-editor-role="block-component">...</div>
	<span data-editor-role="block-component-text-holder">#BlockComponentText</span>
</div>
```

**`$content`** — governs the allowed children:
- `{ type: "custom" }` — general purpose. Can contain zero or more `NestedEditable`, `List`, and `Table` nodes. Each outermost `NestedEditable` must have `$content.type: "default"` (unless inside a `List` or `Table`).
- `{ type: "list" }` — must contain exactly one `List`. No other `NestedEditable` outside the `List`.
- `{ type: "styled-block" }` — must contain exactly one `NestedEditable` with `$content.type: "default"`.

**`$editState`** — `"false" | "inherit"`. Same semantics as `InlineComponent` — the component itself is never the editable root; editability is delegated to its `NestedEditable` children.

**`$$isCrossable`** — `true` when `$content.type` is `"list"` or `"styled-block"` and `$isFullyEditable` is `true`. Same deletion semantics as on `InlineComponent`: when the caret is outside and a deletion key is pressed toward it, `false` removes the entire component atomically; `true` crosses into the content and removes characters one by one. When the caret is already inside, deletion always operates character by character.

**Public API** (inherits `DOMPublicPropsBase` and `ComponentPublicProps`):

- **`$$componentName`** *(readonly)* — string identifier for this component type.
- **`$$content`** *(readonly)* — the content type.
- **`$$shouldSelectBeforeRemove`** *(get/set)* — select the component as a unit before removal.
- **`$$shouldSelectOnNavigation`** *(get/set)* — select as a unit when the caret navigates into it.
- **`$$isFullyEditable`** *(readonly)* — `true` when the `BlockComponent` itself and all direct `NestedEditable` children are editable.
- **`$$isCrossable`** *(readonly)* — see above.
- **`$$unwrap()`** — dismantles the component and reinserts its `Line` children into the parent `ScopedEditable`.
- **`$$prepend(...children)`** / **`$$append(...children)`** — insert `NestedEditable | LayoutUnit | DetachedContext` children.

## BlockComponentLine

- **HTML element:** `div`
- **`data-editor-role`:** `block-component-line`
- **Category:** `Line`

```ts
type BlockComponentLineParent  = RootEditable | NestedEditable
type BlockComponentLineSibling = ContentLine | BlockComponentLine
type BlockComponentLineChild   = BlockComponentTextHolder | BlockComponent
```

The wrapper `Line` for a block component. Sits at the same level as `ContentLine` — a direct child of a `ScopedEditable`. It has a fixed internal structure that is always:

```html
<div data-editor-role="block-component-line">
	<span data-editor-role="block-component-text-holder">#BlockComponentText</span>
	<div  data-editor-role="block-component">...</div>
	<span data-editor-role="block-component-text-holder">#BlockComponentText</span>
</div>
```

Consumers never construct this structure manually — it is created automatically by `createBlockComponentLine`, which also creates the two `BlockComponentTextHolder`s.

**Public API** (inherits `DOMPublicPropsBase`):

- **`$$before(...siblings)`** / **`$$after(...siblings)`** — insert `ContentLine | BlockComponentLine` nodes adjacent to this one.
- **`$$replaceWith(...replacements)`** — replace this node in the tree.
- **`$$remove()`** — remove this node from its parent.

> Note: no `$$append`/`$$prepend` — the internal structure is fixed and managed by the framework.

## BlockComponentTextHolder

- **HTML element:** `span`
- **`data-editor-role`:** `block-component-text-holder`
- **Category:** standalone (part of `EditorElement`)

```ts
type BlockComponentTextHolderParent  = BlockComponentLine
type BlockComponentTextHolderSibling = BlockComponent
type BlockComponentTextHolderChild   = BlockComponentText
```

A structural sentinel element. Always contains exactly one `BlockComponentText`, and exists purely to give the caret valid text boundary points on either side of the `BlockComponent` — analogous to the role `InlineComponentText` plays around an `InlineComponent`.

Consumers never interact with this node directly. It is created and managed entirely by the framework.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

## DetachedContext

- **HTML element:** `div`, `span`, or `slot` (configurable via `localName`, default `"div"`)
- **`data-editor-role`:** `detached-context`
- **Category:** standalone (part of `EditorElement`, excluded from `ContentFlowNode`)

```ts
type DetachedContextParent  = InlineComponent | BlockComponent | LayoutUnit
type DetachedContextSibling = NestedEditable | LayoutUnit | DetachedContext
type DetachedContextChild   = never
```

The schema-free escape hatch. Its `EditorNode` child type is `never` — from the schema's perspective it has no children. Instead, unless `$$localName` is `"slot"`, it owns a **shadow DOM** — exposed through the standard `shadowRoot` property `DetachedContext` inherits from `HTMLElement` — where schema rules are not enforced. The consumer can freely manipulate the DOM structure inside it using standard DOM APIs (`.appendChild`, `.remove`, etc.) and place any content: `Element`, `Text`, or `Comment` nodes — MathML, video, iframes, dialogs, popovers, whatever the use case requires.

No EditorNodes, no `LiveBoundaryPoints`, no editor interaction logic applies inside the shadow DOM. Useful for content that should render visually inside the editor but sit entirely outside its editing model.

A `"slot"` element can't host a shadow root, so a slot-based `DetachedContext` has no shadow DOM at all — its native `shadowRoot` property is always `null`.

**Public API** (inherits `DOMPublicPropsBase`):

- **`$$localName`** *(readonly)* — `"div"`, `"span"`, or `"slot"`.
- **`$$before(...siblings)`** / **`$$after(...siblings)`** — insert `NestedEditable | LayoutUnit | DetachedContext` nodes adjacent to this one.
- **`$$replaceWith(...replacements)`** — replace this node in the tree.
- **`$$remove()`** — remove this node from its parent.

---

# Text Nodes

All text nodes are DOM `Text` nodes extended in-place. They share the same base public API (`TextPublicPropsBase` → `DOMPublicPropsBase`) and have no node-specific public methods — text content is managed through the editor API, not direct manipulation.

## BasicText

- **DOM type:** `Text`
- **`data-editor-role`:** `basic-text`
- **Categories:** `EditorText`, `FormattableText`, `RangeSensitiveNode`

```ts
type BasicTextParent  = ContentLine | GlyphFormatter
type BasicTextSibling = GlyphFormatter | BasicText | OneVisualUnitText | InlineComponent
```

The primary carrier of editable text. Holds one or more single-code-point characters (e.g. `"hello"`). It cannot hold multi-code-point glyphs such as surrogate pairs, emoji, or grapheme clusters — those each live in their own `OneVisualUnitText` node.

`BasicText` is fully managed by the engine. Consumers never create or manipulate it directly — the engine handles splitting, merging, and updating text nodes as the user types.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

## OneVisualUnitText

- **DOM type:** `Text`
- **`data-editor-role`:** `one-visual-unit-text`
- **Categories:** `EditorText`, `FormattableText`, `RangeSensitiveNode`

```ts
type OneVisualUnitTextParent  = ContentLine | GlyphFormatter
type OneVisualUnitTextSibling = GlyphFormatter | BasicText | OneVisualUnitText | InlineComponent
```

The opposite of `BasicText`: holds exactly one multi-code-point glyph — a surrogate pair, emoji, or grapheme cluster (e.g. `"😊"`). This ensures navigation can jump the entire glyph atomically rather than landing inside it. Each such glyph gets its own node.

`OneVisualUnitText` is fully managed by the engine. Consumers never create or manipulate it directly.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

## BeamText

- **DOM type:** `Text`
- **`data-editor-role`:** `beam-text`
- **Categories:** `EditorText`, `RangeNeutralNode`

```ts
type BeamTextParent  = ContentLine
type BeamTextSibling = null
```

The sentinel for an empty `ContentLine`. Always contains `\n` (NEW_LINE) and is the sole child of any `ContentLine` that has no other content. Its presence prevents the line from collapsing to zero height and guarantees `LiveBoundaryPoints` always has a valid node to point to. As a `RangeNeutralNode`, its offset has no impact on selection.

Fully managed by the engine — automatically inserted and removed as the `ContentLine` gains or loses real content.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

## InlineComponentText

- **DOM type:** `Text`
- **`data-editor-role`:** `inline-component-text`
- **Categories:** `EditorText`, `ComponentText`, `RangeNeutralNode`

```ts
type InlineComponentTextParent  = ContentLine
type InlineComponentTextSibling = InlineComponent
```

A sentinel automatically inserted on any side of an `InlineComponent` where there is no sibling, or where the sibling is another `InlineComponent`. Gives the caret a valid text boundary point to land on adjacent to the component during navigation. As a `RangeNeutralNode`, its offset has no impact on selection.

Fully managed by the engine — consumers never create or manipulate it directly.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

## BlockComponentText

- **DOM type:** `Text`
- **`data-editor-role`:** `block-component-text`
- **Categories:** `EditorText`, `ComponentText`, `RangeNeutralNode`

```ts
type BlockComponentTextParent  = BlockComponentTextHolder
type BlockComponentTextSibling = null
```

The sole child of a `BlockComponentTextHolder`. Gives the caret valid text boundary points on either side of the `BlockComponent` inside a `BlockComponentLine`. As a `RangeNeutralNode`, its offset has no impact on selection.

Fully managed by the engine — consumers never create or manipulate it directly.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

## LayoutUnit

`LayoutUnit` is a category of EditorNodes used to build structure inside a `Component` (or inside another `LayoutUnit`). Unlike other EditorNode categories, `LayoutUnit` nodes are **not** `ContentFlowNode`s — `LiveBoundaryPoints` cannot point into them.

`LayoutUnit` members:

| Group | Types |
|---|---|
| Generic layouts | `HTMLLayout`, `SVGLayout`, `MathMLLayout` |
| List | `List`, `ListItem` |
| Table | `Table`, `TableSection`, `TableRow`, `TableCell`, `TableCol`, `TableColGroup` |

Base parent/sibling/child types (shared by all `LayoutUnit`s unless specialized below):

```ts
type LayoutUnitParent  = InlineComponent | BlockComponent | LayoutUnit
type LayoutUnitSibling = NestedEditable | LayoutUnit | DetachedContext
type LayoutUnitChild   = NestedEditable | LayoutUnit | DetachedContext
```

**Public API base (all LayoutUnits):** inherits `DOMPublicPropsBase`. `LayoutUnitPublicProps` adds no extra properties — no shared `$$`-prefixed API beyond traversal.

---

### HTMLLayout

- **DOM type:** `HTMLElement` (`localName` is any key of `HTMLElementTagNameMap`)
- **`data-editor-role`:** `html-layout`
- **Category:** `LayoutUnit`

```ts
type HTMLLayoutParent  = LayoutUnitParent  // InlineComponent | BlockComponent | LayoutUnit
type HTMLLayoutSibling = LayoutUnitSibling
type HTMLLayoutChild   = LayoutUnitChild
```

A wrapper for any standard HTML element (`blockquote`, `figure`, `details`, `button`, etc.) placed inside a `Component`. Use `HTMLLayout` for any HTML structural or interactive element that is not a list or table.

**Public API:**

| Property / Method | Type | Description |
|---|---|---|
| `$$localName` _(read-only)_ | `HTMLLayoutLocalName` | The HTML tag name (e.g. `"blockquote"`, `"figure"`) |
| `$$replaceWith(...nodes)` | `(...LayoutUnitReplacementList) => void` | Replace this node with sibling-valid nodes |
| `$$before(...nodes)` | `(...HTMLLayoutSibling[]) => void` | Insert nodes before this node |
| `$$after(...nodes)` | `(...HTMLLayoutSibling[]) => void` | Insert nodes after this node |
| `$$prepend(...nodes)` | `(...HTMLLayoutChild[]) => void` | Prepend children |
| `$$append(...nodes)` | `(...HTMLLayoutChild[]) => void` | Append children |
| `$$remove()` | `() => void` | Remove this node |

---

### SVGLayout

- **DOM type:** `SVGElement` (`localName` is any key of `SVGElementTagNameMap`)
- **`data-editor-role`:** `svg-layout`
- **Category:** `LayoutUnit`

```ts
type SVGLayoutParent  = LayoutUnitParent
type SVGLayoutSibling = LayoutUnitSibling
type SVGLayoutChild   = LayoutUnitChild
```

A wrapper for any SVG element inside a `Component`. The editor wraps the element but does not interpret SVG content.

**Public API:** same shape as `HTMLLayout` — `$$localName`, `$$replaceWith`, `$$before`, `$$after`, `$$prepend`, `$$append`, `$$remove`.

---

### MathMLLayout

- **DOM type:** `MathMLElement` (`localName` is any key of `MathMLElementTagNameMap`)
- **`data-editor-role`:** `math-ml-layout`
- **Category:** `LayoutUnit`

```ts
type MathMLLayoutParent  = LayoutUnitParent
type MathMLLayoutSibling = LayoutUnitSibling
type MathMLLayoutChild   = LayoutUnitChild
```

A wrapper for any MathML element inside a `Component`. Same shape as `HTMLLayout`.

**Public API:** same shape as `HTMLLayout` — `$$localName`, `$$replaceWith`, `$$before`, `$$after`, `$$prepend`, `$$append`, `$$remove`.

---

### List

- **DOM type:** `HTMLElement` (`ol` or `ul`)
- **`data-editor-role`:** `list`
- **Category:** `LayoutUnit`, `EditStateElement`

```ts
type ListParent  = LayoutUnitParent
type ListSibling = LayoutUnitSibling
type ListChild   = ListItem
```

An ordered or unordered list. Its `EditState` can be `"true"` or `"inherit"`. The `lineType` property is set at creation time and controls the inner structure of each `ListItem`:

- `"multi-line"` — each `ListItem` can contain multiple `ContentLine`s
- `"single-line"` — each `ListItem` holds exactly one `ContentLine`

**Item structure — snapshot mechanism:**

When a `List` is created, the engine builds a `listItemSnapshotProps` blueprint exactly once and stores it on the node. Every `ListItem` created afterward — whether via `$$insertItem` or by the engine during editing — is cloned from that stored snapshot. This guarantees every new item starts with the same initial structure.

The optional `createPreLayout` callback (passed at creation time) lets you customize that structure. It receives a `nestedEditable()` factory and must return an array of `LayoutUnitChild[]` that contains the created `NestedEditable` somewhere (the engine validates this). Without `createPreLayout`, the default is a single `NestedEditable` with `content.type = "list-item"`, `editState = "inherit"`, and display matching `lineType`.

```ts
// Example: list item with a custom wrapper LayoutUnit around the editable area
createList({
  localName: "ul",
  lineType: "single-line",
  createPreLayout: ({ nestedEditable }) => {
    const ne = nestedEditable({ allowedGlyphFormatterInlineTags: ["b", "i"] });
    return [createHTMLLayout({ localName: "div", childNodes: [ne] })];
  },
});
```

**Public API:**

| Property / Method | Type | Description |
|---|---|---|
| `$$localName` _(read-only)_ | `"ol" \| "ul"` | List element type |
| `$$insertItem({ whereToIndex?, lines })` | `ListInsertItemFn` | Insert a new `ListItem` at the given index (defaults to end), populated with the provided `Line` nodes |
| `$$replaceWith(...nodes)` | `(...LayoutUnitReplacementList) => void` | Replace this node |
| `$$before(...nodes)` | `(...ListSibling[]) => void` | Insert before |
| `$$after(...nodes)` | `(...ListSibling[]) => void` | Insert after |
| `$$remove()` | `() => void` | Remove this node |

---

### ListItem

- **DOM type:** `HTMLElement` (`li`)
- **`data-editor-role`:** `list-item`
- **Category:** `LayoutUnit`

```ts
type ListItemParent  = List
type ListItemSibling = LayoutUnitSibling
type ListItemChild   = LayoutUnitChild
```

A single item inside a `List`. Always created and managed internally by `List` (via `$$insertItem` or snapshot restore) — consumers do not create `ListItem` nodes directly.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

### Table

- **DOM type:** `HTMLElement` (`table`)
- **`data-editor-role`:** `table`
- **Category:** `LayoutUnit`

```ts
type TableParent  = LayoutUnitParent
type TableSibling = LayoutUnitSibling
type TableChild   = TableColGroup | TableSection
```

Root of the table structure. Contains exactly one `TableColGroup` (column sizing) followed by one or more `TableSection`s. Internally maintains a `tableGrid` (`TableGridRow[]`) that maps every cell's position, span, and section membership — all row/column operations operate on this grid model.

Most table methods accept a discriminated union: `{ type: "selection" }` (acts on the current anchor/focus cell selection) or `{ type: "explicit"; tableCells: TableCell[] }` (acts on explicitly provided cells).

**Cell structure — snapshot mechanism:**

When a `Table` is created, the engine builds a `tableCellSnapshotProps` blueprint exactly once and stores it on the node. Every `TableCell` created afterward — whether by insert row, insert column, split cell, or any other operation — is cloned from that stored snapshot. This guarantees every new cell starts with the same initial structure.

The optional `createPreLayout` callback (passed at creation time) lets you customize that structure. It receives a `nestedEditable()` factory and must return an array of `LayoutUnitChild[]` that contains the created `NestedEditable` somewhere (the engine validates this and throws if it does not). Without `createPreLayout`, the default is a single `NestedEditable` with `content.type = "table-cell"`, `editState = "true"`, and block multi-line display, containing one empty `ContentLine`.

```ts
// Example: table cell with a custom wrapper LayoutUnit and restricted formatting
createTable({
  rows: 3,
  cols: 3,
  createPreLayout: ({ nestedEditable }) => {
    const ne = nestedEditable({ allowedGlyphFormatterInlineTags: ["b"] });
    return [createHTMLLayout({ localName: "div", childNodes: [ne] })];
  },
});
```

**Public API:**

| Property / Method | Type | Description |
|---|---|---|
| `$$minRowHeight` | `number` | Minimum row height (px) |
| `$$defaultRowHeight` | `number` | Default row height (px) |
| `$$minColWidth` | `number` | Minimum column width (px) |
| `$$rowGroups` _(read-only)_ | `number[]` | Per-row heights in px. One entry per row, index matches row order. |
| `$$colGroups` _(read-only)_ | `number[]` | Per-column widths as percentage × 10. Values must sum to `1000`. e.g. `[300, 400, 300]` = 30% / 40% / 30%. |
| `$$tableGrid` _(read-only)_ | `TableGrid` | Internal grid model — array of `TableGridRow`, each with `section`, `tableRow`, and `cells` |
| `$$anchorTableCell` _(read-only)_ | `TableCell \| null` | Anchor cell of the current table selection |
| `$$focusTableCell` _(read-only)_ | `TableCell \| null` | Focus cell of the current table selection |
| `$$cellsEditable` | `"true" \| "false"` | Whether table cells are editable |
| `$$tableRows` _(read-only)_ | `TableRow[]` | All rows in the table (flattened across all sections) |
| `$$tableCells` _(read-only)_ | `TableCell[]` | All cells in the table (flattened across all rows) |
| `$$isTableSelectionActive` _(read-only)_ | `boolean` | Whether a multi-cell table selection is active |
| `$$getTableCellsGridArea(params)` | `TableGetTableCellsGridAreaFn` | Returns `{ tableCellsInGridArea: Set<TableCell>, gridAreaBounds: { startColIndex, endColIndex, startRowIndex, endRowIndex } }`. `tableCellsInGridArea` includes all cells within the bounding rectangle, not just the input cells. |
| `$$resizeRows({ rowGroups })` | `TableResizeRowsFn` | Set row heights. `rowGroups` must have the same length as the current row count; each value is a px height (must be ≥ `$$minRowHeight`). |
| `$$resizeCols({ colGroups })` | `TableResizeColsFn` | Set column widths. `colGroups` must have the same length as the current column count; each value is percentage × 10, and all values must sum to `1000`. |
| `$$checkMergeCells(params)` | `TableCheckMergeCellsFn` | Returns `{ hasMultipleCells, isSameSection, canMerge }`. `canMerge` is `true` when there are multiple cells and all are in the same section. |
| `$$mergeCells(params)` | `TableMergeCellsFn` | Merges the selected/explicit cells into one. Content from all cells is preserved (appended into the first cell). Returns `{ mergedCell }`. |
| `$$checkMergeCellTo(params)` | `TableCheckMergeCellToFn` | For a single cell, returns `{ mergeLeft, mergeRight, mergeUp, mergeDown }`. Each direction reports `{ hasSingleCell, hasNeighbor, isColSpanAligned/isRowSpanAligned, isSameSection (vertical only), canMerge }`. |
| `$$mergeCellTo(params)` | `TableMergeCellToFn` | Merges the given cell with its neighbor in the specified direction (`"left"`, `"right"`, `"up"`, `"down"`). Adjusts `colSpan`/`rowSpan` accordingly. |
| `$$checkSplitCell(params)` | `TableCheckSplitCellFn` | For a single cell, returns `{ vertical: { hasSingleCell, canSplit }, horizontal: { hasSingleCell, canSplit } }`. Vertical split = add a row (or reduce `rowSpan`); horizontal split = add a column (or reduce `colSpan`). |
| `$$splitCell(params)` | `TableSplitCellFn` | Splits the cell in the given direction (`"horizontal"` or `"vertical"`). If the cell has `colSpan`/`rowSpan` > 1, reduces the span; otherwise inserts a new col/row. |
| `$$checkSplitSpannedCells(params)` | `TableCheckSplitSpannedCellsFn` | Returns `{ isSpanned, canSplit }`. `isSpanned` is `true` if any cell in the set has `colSpan` or `rowSpan` > 1. |
| `$$splitSpannedCells(params)` | `TableSplitSpannedCellsFn` | Resets all spanned cells in the set back to 1×1, inserting new empty cells/rows as needed to fill the vacated grid area. |
| `$$checkInsertRow(params)` | `TableCheckInsertRowFn` | Returns `{ canInsert }`. `type: "selection"` only. |
| `$$insertRow(params)` | `TableInsertRowFn` | Inserts a new empty row above (`"up"`) or below (`"down"`) the row containing the target cell. Adjusts `rowSpan` on spanned cells that cross the insertion point. |
| `$$checkInsertCol(params)` | `TableCheckInsertColFn` | Returns `{ canInsert }`. `type: "selection"` only. |
| `$$insertCol(params)` | `TableInsertColFn` | Inserts a new empty column to the left (`"left"`) or right (`"right"`) of the column containing the target cell. Adjusts `colSpan` on spanned cells that cross the insertion point. |
| `$$checkDeleteRows(params)` | `TableCheckDeleteRowsFn` | Returns `{ canDelete }`. `false` when deleting would remove all rows. |
| `$$deleteRows(params)` | `TableDeleteRowsFn` | Deletes all rows that contain any of the target cells. Cells whose `rowSpan` crosses the deleted rows have their span reduced. |
| `$$checkDeleteCols(params)` | `TableCheckDeleteColsFn` | Returns `{ canDelete }`. `false` when deleting would remove all columns. |
| `$$deleteCols(params)` | `TableDeleteColsFn` | Deletes all columns that contain any of the target cells. Cells whose `colSpan` crosses the deleted columns have their span reduced. |
| `$$checkChangeTableCellsLocalName(params)` | `TableCheckChangeTableCellsLocalNameFn` | Returns `{ canChangeToHeader, canChangeToData }`. `canChangeToHeader` is `false` if all cells are already `th`; `canChangeToData` is `false` if all are already `td`. |
| `$$changeTableCellsLocalName(params)` | `TableChangeTableCellsLocalNameFn` | Changes the HTML tag of the target cells to `td` or `th` while preserving content. Requires `toLocalName`. |
| `$$checkMoveRowsToSection(params)` | `TableCheckMoveRowsToSectionFn` | Returns `{ canMoveToHead, canMoveToBody, canMoveToFoot }`. A direction is `false` if the rows are already in that section. |
| `$$moveRowsToSection(params)` | `TableMoveRowsToSectionFn` | Moves all rows containing the target cells into the specified section (`"thead"`, `"tbody"`, `"tfoot"`). `tableCellTagMode` controls how cell tags are updated: `"td"` \| `"th"` \| `"section"` (adopt that section's default tag) \| `"preserve"` (keep existing tags). |
| `$$replaceWith(...nodes)` | `(...LayoutUnitReplacementList) => void` | Replace this node |
| `$$before(...nodes)` | `(...TableSibling[]) => void` | Insert before |
| `$$after(...nodes)` | `(...TableSibling[]) => void` | Insert after |
| `$$remove()` | `() => void` | Remove this node |

---

### TableSection

- **DOM type:** `HTMLElement` (`tbody`, `thead`, or `tfoot`)
- **`data-editor-role`:** `table-section`
- **Category:** `LayoutUnit`

```ts
type TableSectionParent  = Table
type TableSectionSibling = TableSection
type TableSectionChild   = TableRow
```

One of the three table section types. A `Table` must have at least one `TableSection`; multiple are allowed (e.g. `thead` + `tbody` + `tfoot`).

**Public API:**

| Property | Type | Description |
|---|---|---|
| `$$localName` _(read-only)_ | `"tbody" \| "thead" \| "tfoot"` | Section type |

---

### TableRow

- **DOM type:** `HTMLElement` (`tr`)
- **`data-editor-role`:** `table-row`
- **Category:** `LayoutUnit`

```ts
type TableRowParent  = TableSection
type TableRowSibling = TableRow
type TableRowChild   = TableCell
```

A single row inside a `TableSection`. Managed entirely by `Table` operations — consumers do not insert or remove rows directly.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

### TableCell

- **DOM type:** `HTMLElement` (`td` or `th`)
- **`data-editor-role`:** `table-cell`
- **Category:** `LayoutUnit`

```ts
type TableCellParent  = TableRow
type TableCellSibling = TableCell
type TableCellChild   = LayoutUnitChild  // NestedEditable | LayoutUnit | DetachedContext
```

A single cell. The direct child of a `TableCell` is always a `NestedEditable` holding the cell's editable content. `colSpan` and `rowSpan` are managed internally by the table grid.

**Public API:**

| Property | Type | Description |
|---|---|---|
| `$$localName` _(read-only)_ | `"td" \| "th"` | Cell type |
| `$$table` _(read-only)_ | `Table \| null` | The parent `Table` node |
| `$$isInMultiSelection` _(read-only)_ | `boolean` | Whether this cell is part of a multi-cell table selection |

---

### TableColGroup

- **DOM type:** `HTMLElement` (`colgroup`)
- **`data-editor-role`:** `table-col-group`
- **Category:** `LayoutUnit`

```ts
type TableColGroupParent  = Table
type TableColGroupSibling = TableSection
type TableColGroupChild   = TableCol
```

The column group element of a `Table`. Every `Table` has exactly one `TableColGroup`, which contains one `TableCol` per column. Managed internally by the table — consumers do not manipulate it directly.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.

---

### TableCol

- **DOM type:** `HTMLElement` (`col`)
- **`data-editor-role`:** `table-col`
- **Category:** `LayoutUnit`

```ts
type TableColParent  = TableColGroup
type TableColSibling = TableCol
type TableColChild   = never
```

Defines a single column inside a `TableColGroup`. Leaf node. Has a `width` style attribute for column sizing. Managed internally — consumers use `$$resizeCols` on `Table` instead.

**Public API:** inherits `DOMPublicPropsBase` only. No node-specific methods.
