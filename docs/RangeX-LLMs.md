# RangeX — LLM Reference Documentation

## 1. What is RangeX

RangeX is a schema-driven rich text editor built directly on the real DOM. It has no virtual DOM, no React or framework dependency — the editor is purely DOM-based.

Rather than abstracting the DOM away, RangeX extends each editor node in-place: plain HTML (or Text) nodes get `$$`-prefixed properties and methods attached directly onto them (e.g. `node.$$append(...)`, `node.$$childNodes`), giving consumers a safe, structured API for editor operations without any wrapper objects. The schema strictly controls which node types can exist and how they nest, so the DOM structure is always predictable.

Editor logic is fully separated from content: the output of RangeX is pure HTML or JSON with no behavior attached. Native HTML elements (`input`, `details`, `button`, etc.) remain interactive inside the editor — the DOM is controlled, not replaced.

## 2. Key Definitions

> In DOM examples, `#TypeName` refers to an instance of that EditorNode type (e.g. `#BasicText` = a `BasicText` text node, `#ContentLine` = a `ContentLine` element).

### EditingRoot

The topmost `ScopedEditable` that is editable. Walking up the tree from any node, the highest `ScopedEditable` where the editable condition still holds is the `EditingRoot`.

A `NestedEditable` with `contenteditable="true"` nested inside a `Component` with `contenteditable="false"` becomes its own `EditingRoot` — the non-editable ancestor stops the upward walk.

```html
<div contenteditable="false">
	<!-- EditingRoot -->
	<div contenteditable="true">
		<p contenteditable="true">
			<span>text</span>
		</p>
	</div>
</div>
```

### Non-EditingRoot

The topmost `contenteditable="false"` ancestor of a non-editable node. It is the mirror of `EditingRoot` — where `EditingRoot` is the highest point where editability begins, `Non-EditingRoot` is the highest point where non-editability begins.

```html
<div contenteditable="true">
	<!-- Non-EditingRoot -->
	<div contenteditable="false">
		<p contenteditable="false">
			<span>text</span>
		</p>
	</div>
</div>
```

Relevant in selection validation (section 8): when the selection anchor is inside a `Non-EditingRoot`, the focus is constrained to stay within the same non-editable boundary. Also relevant to `$$isCrossable` on `Component` nodes — crossing into a component's content is only possible when the component is fully editable (not inside a `Non-EditingRoot`).

### Outermost X

The shallowest `X` descendant within a given scope — the first `X` encountered when traversing the tree top-down. A deeper `X` nested inside another `X` is not considered the outermost.

```html
<div class="scope">
	<article>
		<!-- outermost div — shallowest div descendant of scope -->
		<div>
			<!-- NOT the outermost div — nested inside another div -->
			<div></div>
		</div>

		<!-- outermost div — shallowest div descendant of scope -->
		<div></div>
	</article>
</div>
```

This term is used throughout the schema rules — for example, "each outermost `NestedEditable` inside a `BlockComponent` must have `$content.type = "default"`" means the rule applies to the direct-child `NestedEditable`s of the `BlockComponent`, not to any `NestedEditable`s nested deeper inside them.

### EditorArea

The set of all `ContentFlowNode`s within a `ScopedEditable`. A `Component` itself belongs to the `EditorArea`, but its descendants do not — unless they are inside a `NestedEditable` within it.

```html
<!-- EditorArea: root-editable -->
<root-editable>
	<content-line>                  <!-- ✓ ContentFlowNode -->
		#BasicText                  <!-- ✓ ContentFlowNode -->
		<inline-component>     <!-- ✓ ContentFlowNode (the Component itself is included) -->

			<!-- ✗ not part of this EditorArea (LayoutUnit descendants are excluded) -->
			<html-layout>
				<!-- EditorArea: nested-editable -->
				<nested-editable>
					<content-line>#BasicText</content-line>
				</nested-editable>
			</html-layout>

		</inline-component>
	</content-line>
</root-editable>
```

### EditorZone

A group of `EditorArea`s that share the same `EditingRoot`.

```html
<!-- EditorZone A (EditingRoot = root-editable) -->
<root-editable contenteditable="true">
	<content-line>
		<inline-component contenteditable="inherit">
			<!-- EditorZone A: "inherit" → same EditingRoot as root-editable -->
			<nested-editable contenteditable="true">
				<content-line>#ContentLineChild</content-line>
			</nested-editable>
		</inline-component>

		<inline-component contenteditable="false">
			<!-- EditorZone B: "false" → different EditingRoot -->
			<nested-editable contenteditable="true">
				<content-line>#ContentLineChild</content-line>
			</nested-editable>
		</inline-component>
	</content-line>
</root-editable>
```

## 3. Setup & Initialization

### Registering the element

Call `defineRangeX()` once before using the editor. It registers `<rich-text-area>` as a custom element and returns the `RangeX` class.

```ts
import { defineRangeX } from "rich-text-area";

const { RangeX } = defineRangeX({});
```

### Creating an instance

```ts
const rangeX = new RangeX({
	rootEditableFrom: { type: "node", node: rootEditable },
	shadowRootOptions: { mode: "open", serializable: true },
	isTextAreaEditable: true,  // default — omit if not needed
	isTextAnimation: false,    // default — omit if not needed
});

document.body.appendChild(rangeX);
```

### `rootEditableFrom`

Controls how the editor's content is initialized. Two shapes:

- **`{ type: "node", node: RootEditable }`** — fresh start. You construct a `RootEditable` (see [Creating nodes](#5-creating-nodes)) and pass it in.
- **`{ type: "snapshot", storedSnapshot: StoredSnapshot }`** — restore previously persisted content. Pass a `StoredSnapshot` retrieved from storage (see [Undo/redo & snapshots](#12-undoredo--snapshots)).

### `shadowRootOptions`

`ShadowRootInit` (the same options object native `Element.attachShadow()` accepts: `mode`, `delegatesFocus`, `slotAssignment`, `serializable`, `clonable`). Required — there is no default, so callers must always state their own `mode` explicitly. 

### `isTextAreaEditable`

`boolean`, default `true`. When `false`, the entire editor is forced into read-only mode — `contenteditable="false"` is applied to all elements regardless of their individual `EditState`. See `setIsTextAreaEditable` in [section 14](#14-editorapi).

### `isTextAnimation`

`boolean`, default `false`. Enables text animation on input.

### Accessing the API

All editor operations go through `rangeX.editorAPI`:

```ts
const api = rangeX.editorAPI;

api.focus();
api.getEditorSelection();
api.insertNode({ ... });
```

## 4. Editor Node Types

### Node collections

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

### DOMPublicPropsBase

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

### RootEditable

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

### NestedEditable

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

### ContentLine

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

### GlyphFormatter

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

### InlineComponent

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

### BlockComponent

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

### BlockComponentLine

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

### BlockComponentTextHolder

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

### DetachedContext

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

## Text Nodes

All text nodes are DOM `Text` nodes extended in-place. They share the same base public API (`TextPublicPropsBase` → `DOMPublicPropsBase`) and have no node-specific public methods — text content is managed through the editor API, not direct manipulation.

### BasicText

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

### OneVisualUnitText

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

### BeamText

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

### InlineComponentText

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

### BlockComponentText

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

### LayoutUnit

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

#### HTMLLayout

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

#### SVGLayout

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

#### MathMLLayout

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

#### List

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

#### ListItem

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

#### Table

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

#### TableSection

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

#### TableRow

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

#### TableCell

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

#### TableColGroup

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

#### TableCol

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

---

## 5. Creating Nodes

All factory functions are imported from the package root:

```ts
import {
  createRootEditable, createNestedEditable, createContentLine,
  createGlyphFormatter, createHTMLLayout, createSVGLayout, createMathMLLayout,
  createInlineComponent, createBlockComponent,
  createBlockComponentLine, createBlockComponentTextHolder,
  createDetachedContext, createList, createTable, createFormattableTexts, createBeamText,

} from "rich-text-area";
```

### Common parameters

These parameters appear on most factories:

- **`domAttrs?: Partial<Record<string, string>>`** — HTML attributes set on the element at creation (e.g. `{ "data-id": "123", class: "highlight" }`).
- **`childNodes?: readonly T[]`** — initial child nodes, typed to the node's valid child types.

`ScopedEditable` factories (`createRootEditable`, `createNestedEditable`) additionally share:

- **`display`** — structural role (required):
  - `"block multi-line"` — block-level, multiple lines allowed, `BlockComponentLine` allowed as child
  - `"block single-line"` — block-level, must have exactly one block `ContentLine`
  - `"inline"` — inline-level, must have exactly one inline `ContentLine`
- **`editState`** — see per-factory
- **`allowedComponents?: string[] | null`** — restricts which `componentName`s can be inserted. `null` (default) = no restriction. `[]` = nothing allowed.
- **`allowedContentLineLocalNames?: BlockContentLineLocalName[] | null`** — restricts which block `ContentLine` tag names (`"p"`, `"h1"`…`"h6"`) are allowed. Does not apply to inline `"span"` ContentLines.
- **`allowedContentLineStyleAttrNames?: ContentLineStyleAttrName[] | null`** — restricts which line CSS properties can be set.
- **`allowedGlyphFormatterStyleAttrNames?: GlyphFormatterStyleAttrName[] | null`** — restricts which text CSS properties can be set.
- **`allowedGlyphFormatterInlineTags?: GlyphFormatterInlineTag[] | null`** — restricts which inline tags (`"b"`, `"i"`, etc.) can be applied.

When a schema constraint is violated (e.g. a component is not in `allowedComponents`), the engine unwraps the disallowed node rather than throwing.

---

### `createRootEditable(params)`

Creates a `RootEditable`. This is the top-level container passed to `new RangeX(...)`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `display` | `"block multi-line" \| "block single-line"` | Yes | Structural display mode |
| `editState` | `"true" \| "false"` | No | Defaults to `"true"` |
| `contentLineLocalNamesStyle` | `ContentLineLocalNamesStyle` | Yes | Default `structuredStyle` per `ContentLine` tag (`p`, `h1`…`h6`). Pass empty objects for no default styles. |
| `customStorage` | `any` | No | JSON-serializable consumer data stored on the node, readable via `$$customStorage` |
| `allowedComponents` | `string[] \| null` | No | See Common parameters |
| `allowedContentLineLocalNames` | `BlockContentLineLocalName[] \| null` | No | See Common parameters |
| `allowedContentLineStyleAttrNames` | `ContentLineStyleAttrName[] \| null` | No | See Common parameters |
| `allowedGlyphFormatterStyleAttrNames` | `GlyphFormatterStyleAttrName[] \| null` | No | See Common parameters |
| `allowedGlyphFormatterInlineTags` | `GlyphFormatterInlineTag[] \| null` | No | See Common parameters |
| `domAttrs` | `DOMAttrs` | No | Initial HTML attributes |
| `childNodes` | `(ContentLine \| BlockComponentLine)[]` | No | Initial child nodes |

```ts
const rootEditable = createRootEditable({
  display: "block multi-line",
  editState: "true",
  contentLineLocalNamesStyle: {
    p:  { ... },
    h1: { ... },
    h2: { ... },
    h3: { ... },
    h4: { ... },
    h5: { ... },
    h6: { ... },
  },
  allowedGlyphFormatterInlineTags: ["b", "i", "u"],
  childNodes: [createContentLine({ childNodes: [createBeamText({})] })],
});
```

---

### `createNestedEditable(params)`

Creates a `NestedEditable` — the editable content area inside a `Component` or `LayoutUnit`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `content` | `NestedEditableContent` | Yes | Semantic role: `{ type: "default" }` \| `{ type: "linked-characters"; unwrap: "if-modified" \| "if-empty" }` \| `{ type: "list-item" }` \| `{ type: "table-cell" }` |
| `display` | `ScopedEditableDisplay` | Yes | `"block multi-line"`, `"block single-line"`, or `"inline"` |
| `editState` | `"true" \| "false" \| "inherit"` | No | Defaults to `"inherit"`. `"inherit"` = adopts parent editability |
| `customStorage` | `any` | No | JSON-serializable consumer data |
| `allowedComponents` … | (same as createRootEditable) | No | |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `(ContentLine \| BlockComponentLine)[]` | No | |

---

### `createContentLine(params)`

Creates a `ContentLine`. An empty `ContentLine` must always have a `BeamText` child — the schema enforces "at least one child" on every `ContentFlowNode`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `localName` | `ContentLineLocalName` | Yes | `"p"` \| `"h1"`…`"h6"` for block contexts; `"span"` for inline contexts |
| `structuredStyle` | `Partial<ContentLineStructuredStyle>` | No | Initial CSS values. Valid properties: `lineHeight`, `paddingBlock`, `paddingInline`, `textAlign`, `textIndent` |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `ContentLineChild[]` | No | `BeamText \| GlyphFormatter \| BasicText \| OneVisualUnitText \| InlineComponent \| InlineComponentText` |

```ts
// empty block line (inside ScopedEditable with display: "block multi-line" or "block single-line")
createContentLine({ localName: "p", childNodes: [createBeamText({})] })

// empty inline line (inside NestedEditable with display: "inline")
createContentLine({ localName: "span", childNodes: [createBeamText({})] })

// line with text
createContentLine({
  localName: "h1",
  childNodes: [createGlyphFormatter({ childNodes: createFormattableTexts({ data: "Hello" }) })],
})
```

---

### `createGlyphFormatter(params)`

Creates a `GlyphFormatter`. Each `GlyphFormatter` holds text with a single consistent format.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `inlineTags` | `Set<GlyphFormatterInlineTag>` | No | Active inline tags. Valid values: `"b"`, `"code"`, `"del"`, `"em"`, `"i"`, `"ins"`, `"kbd"`, `"mark"`, `"s"`, `"strong"`, `"sub"`, `"sup"`, `"u"`, `"var"` |
| `structuredStyle` | `Partial<GlyphFormatterStructuredStyle>` | No | Initial CSS. Valid properties: `backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `letterSpacing`, `textDecoration` |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `(BasicText \| OneVisualUnitText)[]` | No | Use `createFormattableTexts` to produce these from a string |

---

### `createFormattableTexts({ data })`

Splits a string into the correct mix of `BasicText` and `OneVisualUnitText` nodes. Multi-code-point characters (emoji, surrogate pairs, grapheme clusters) become individual `OneVisualUnitText` nodes; everything else becomes `BasicText`.

```ts
const nodes = createFormattableTexts({ data: "Hi 👋" });
// → [BasicText("Hi "), OneVisualUnitText("👋")]
```

Returns `FormattableText[]` (`BasicText | OneVisualUnitText`).

---

### `createBeamText(params)`

Creates a `BeamText` — the `\n` sentinel used in empty `ContentLine`s. Pass `{}` (no parameters needed).

```ts
createContentLine({ childNodes: [createBeamText({})] })
```

---

### `createInlineComponent(params)`

Creates an `InlineComponent` — an inline component inside a `ContentLine` (e.g. mention, link, template variable).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `componentName` | `string` | Yes | Identifies the component type. Must be in the parent `ScopedEditable`'s `allowedComponents` to avoid being unwrapped. |
| `content` | `InlineComponentContent` | Yes | `{ type: "custom" }` or `{ type: "linked-characters" }` (affects `$$isCrossable`) |
| `editState` | `"false" \| "inherit"` | No | Defaults to `"inherit"` |
| `customStorage` | `any` | No | JSON-serializable consumer data |
| `shouldSelectBeforeRemove` | `boolean` | No | If `true`, the component is selected before deletion (gives consumer a chance to intercept) |
| `shouldSelectOnNavigation` | `boolean` | No | If `true`, navigating onto the component selects it as a unit |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `(NestedEditable \| LayoutUnit \| DetachedContext)[]` | No | |

---

### `createBlockComponent(params)`

Creates a `BlockComponent` — a block-level component container (e.g. codeblock, blockquote). Must be placed inside a `BlockComponentLine`.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `componentName` | `string` | Yes | Component type identifier |
| `content` | `BlockComponentContent` | Yes | `{ type: "custom" }` \| `{ type: "list" }` \| `{ type: "styled-block" }` (last two affect `$$isCrossable`) |
| `editState` | `"false" \| "inherit"` | No | Defaults to `"inherit"` |
| `customStorage` | `any` | No | JSON-serializable consumer data |
| `shouldSelectBeforeRemove` | `boolean` | No | |
| `shouldSelectOnNavigation` | `boolean` | No | |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `(NestedEditable \| LayoutUnit \| DetachedContext)[]` | No | |

---

### `createBlockComponentTextHolder(params)` / `createBlockComponentLine(params)`

These two are always used together. A `BlockComponentLine` has a fixed 3-child structure — left holder, `BlockComponent`, right holder — and all three must be pre-created and passed explicitly:

```ts
const left  = createBlockComponentTextHolder({});
const right = createBlockComponentTextHolder({});
const bnc   = createBlockComponent({ componentName: "codeblock", content: { type: "custom" }, editState: "inherit" });

const line = createBlockComponentLine({
  leftBlockComponentTextHolder:  left,
  blockComponent:                bnc,
  rightBlockComponentTextHolder: right,
});
```

`createBlockComponentTextHolder` takes only `domAttrs?`. `createBlockComponentLine` takes `domAttrs?` plus the three required children above.

---

### `createHTMLLayout(params)` / `createSVGLayout(params)` / `createMathMLLayout(params)`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `localName` | `keyof HTMLElementTagNameMap` (or SVG/MathML equivalent) | Yes | The HTML/SVG/MathML tag to create |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `LayoutUnitChild[]` | No | `NestedEditable \| LayoutUnit \| DetachedContext` |

---

### `createList(params)`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `localName` | `"ol" \| "ul"` | Yes | |
| `lineType` | `"multi-line" \| "single-line"` | Yes | Determines how `ListItem`s are structured |
| `editState` | `"true" \| "inherit"` | No | Defaults to `"inherit"` |
| `createPreLayout` | `CreatePreLayoutFn` | No | See [List — Item structure](#list) |
| `itemDOMAttrs` | `DOMAttrs` | No | Attributes applied to each new `ListItem`'s element |
| `itemsChildNodes` | `NestedEditableChild[][]` | No | Initial items; each inner array is the `lines` passed to `$$insertItem` |
| `domAttrs` | `DOMAttrs` | No | |

---

### `createTable(params)`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `rows` | `number` | Yes | Number of rows |
| `cols` | `number` | Yes | Number of columns |
| `minRowHeight` | `number` | No | Minimum row height in px (default `40`) |
| `minColWidth` | `number` | No | Minimum column width in px (default `40`) |
| `defaultRowHeight` | `number` | No | Initial row height for all rows in px (default `40`) |
| `tableCellsEditable` | `"true" \| "false"` | No | Whether cells are editable |
| `createPreLayout` | `CreatePreLayoutFn` | No | See [Table — Cell structure](#table) |
| `cellDOMAttrs` | `DOMAttrs` | No | Attributes applied to each new cell's element |
| `domAttrs` | `DOMAttrs` | No | |

Column widths are distributed evenly across all columns at creation (each column gets `1000 / cols`, rounded to sum to `1000`).

---

### `createDetachedContext(params)`

Creates a `DetachedContext` — the schema-free escape hatch with its own shadow DOM (see [`DetachedContext` in section 4](#detachedcontext)).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `localName` | `"div" \| "span" \| "slot"` | No | Defaults to `"div"` |
| `shadowTree` | `(Element \| Comment \| Text)[]` | No | Initial content appended into the shadow root. Ignored if `localName` is `"slot"` — a slot has no shadow root to append into. |
| `domAttrs` | `DOMAttrs` | No | |

---

## 6. Reading & traversing the tree

### Type guards

All type guards are exported from `"rich-text-area"`. They accept an `EditorNode` (or `EventTarget` for `isEditorNode`) and return `boolean`, narrowing the TypeScript type.

| Guard | True when `$$editorRole` is |
|---|---|
| `isEditorNode(target)` | Any value with `$EDITOR_ROLE` symbol — use as the entry-point check before others |
| `isScopedEditable(node)` | `"root-editable"` or `"nested-editable"` |
| `isLine(node)` | `"content-line"` or `"block-component-line"` |
| `isComponent(node)` | `"inline-component"` or `"block-component"` |
| `isLayoutUnit(node)` | `"html-layout"`, `"svg-layout"`, `"math-ml-layout"`, `"list"`, `"list-item"`, `"table"`, `"table-cell"`, `"table-col"`, `"table-col-group"`, `"table-row"`, `"table-section"` |
| `isEditorElement(node)` | `ScopedEditable`, `Line`, `"glyph-formatter"`, `Component`, `"block-component-text-holder"`, `LayoutUnit`, `"detached-context"` |
| `isEditorText(node)` | `"basic-text"`, `"one-visual-unit-text"`, `"beam-text"`, `"inline-component-text"`, `"block-component-text"` |
| `isComponentText(node)` | `"inline-component-text"` or `"block-component-text"` |
| `isContentFlowNode(node)` | Any `EditorNode` except `LayoutUnit` and `DetachedContext` |
| `isEditStateElement(node)` | `ScopedEditable`, `Component`, or `"list"` |
| `isSelectableNode(node)` | `EditorText` or `Component` |
| `isFormattableText(node)` | `"basic-text"` or `"one-visual-unit-text"` |
| `isRangeSensitiveNode(node)` | `FormattableText` or `Component` |
| `isRangeSensitiveText(node)` | `"basic-text"` or `"one-visual-unit-text"` (same as `isFormattableText`) |
| `isRangeNeutralNode(node)` | `"beam-text"`, `"inline-component-text"`, `"block-component-text"` |
| `isStructuredStyleElement(node)` | `"content-line"` or `"glyph-formatter"` |
| `isFilledContentLineChild(node)` | Valid `ContentLine` child, excluding `BeamText` |
| `isContentLineText(node)` | `EditorText` that is a valid `ContentLine` child |
| `isTablePart(node)` | `"table"`, `"table-cell"`, `"table-col"`, `"table-col-group"`, `"table-row"`, `"table-section"` |
| `isListPart(node)` | `"list"` or `"list-item"` |

`isEditorNode` accepts any `EventTarget` — useful in DOM event handlers to check whether `event.target` is an EditorNode before calling other guards.

### Element-only traversal props

In addition to the `DOMPublicPropsBase` props shared by all nodes (see [section 4](#4-editor-node-types)), element nodes expose:

| Prop | Description |
|---|---|
| `$$children` | Typed array of element children — excludes text nodes |
| `$$closest(selector)` | Closest ancestor `EditorElement` matching a CSS selector, or `null` |
| `$$querySelector(selector)` | First descendant `EditorElement` matching selector, or `null` |
| `$$querySelectorAll(selector)` | All descendant `EditorElement`s matching selector, as an array |
| `$$anchorName` | CSS anchor name for this element — use with CSS `anchor()` to position UI relative to it |

Role selector constants exported from `"rich-text-area"` (e.g. `contentLineRoleSelector`, `glyphFormatterRoleSelector`, `inlineComponentRoleSelector`) are CSS selector strings for use with `$$closest` / `$$querySelector` / `$$querySelectorAll`.

### Walking patterns

`$$childNodes` returns a typed array, not a live NodeList, so all array methods work directly.

**Walk the top-level lines of a RootEditable:**

```ts
for (const child of rootEditable.$$childNodes) {
  // typed as ContentLine | BlockComponentLine
  if (child.$$editorRole === contentLineName) {
    // work with ContentLine
  }
}
```

**Walk up from any node to find its containing ContentLine:**

```ts
function getParentLine(node: EditorNode) {
  let current: EditorNode | null = node;
  while (current) {
    if (isLine(current)) return current;
    current = current.$$parentElement;
  }
  return null;
}
```

**Walk all GlyphFormatters inside a ContentLine:**

```ts
import { glyphFormatterRoleSelector } from "rich-text-area";

const glyphFormatters = contentLine.$$querySelectorAll(glyphFormatterRoleSelector);
```

**Check whether a node is reachable by boundary points:**

```ts
import { isContentFlowNode } from "rich-text-area";

if (isContentFlowNode(node)) {
  // safe to use as fromNode / toNode in editorAPI methods
}
```

---

## 7. EditorSchema

The EditorSchema is a set of structural rules that governs how `EditorNode`s may be nested within a `RootEditable` — defining valid parent, child, and sibling relationships between node types, and the property constraints each node must satisfy. All descendants of a `RootEditable` are subject to the schema. The only exception is `DetachedContext`'s shadow DOM, which is a schema-free zone.

### Structural relationships

Each node type has typed `Parent`, `Sibling`, and `Child` constraints, shown as type aliases in [section 4](#4-editor-node-types) for every node type:

```ts
type ContentLineParent  = RootEditable | NestedEditable
type ContentLineSibling = ContentLine | BlockComponentLine
type ContentLineChild   = BeamText | GlyphFormatter | BasicText
                        | OneVisualUnitText | InlineComponent
                        | InlineComponentText
```

The `$$`-prefixed mutation methods on each node use these types as their parameter types — TypeScript prevents inserting a structurally invalid node at compile time.

### Enforcement

**At mutation time** — all structural changes inside a `RootEditable` must go through the `$$`-prefixed mutation methods, which route through `UpdateStructure` internally. Direct DOM manipulation (`appendChild`, `removeChild`, etc.) bypasses the schema and must not be used.
**At insertion time** — additional invariants are enforced each time a node is inserted into a `RootEditable`:

- Every `ContentFlowNode` must have at least one child so `LiveBoundaryPoints` always has a valid text node to point into. This is validated at insertion time and the engine never auto-injects children — the caller is always responsible. The one exception is `InlineComponentText` sentinels: the engine auto-manages these around `InlineComponent` nodes on insertion (see [`InlineComponent` in section 4](#inlinecomponent)).

**Post-mutation normalization** — after each mutation pipeline completes, the engine runs a normalization pass that silently corrects `$$allowed*` violations. No error is thrown; disallowed content is adjusted automatically:

- `$$allowedComponents` — a `Component` whose `$$componentName` is not in the list is automatically unwrapped (its content moved to the parent, the element removed)
- `$$allowedContentLineLocalNames` — a block `ContentLine` with a `localName` not in the list has its tag changed to `"p"`. Inline `"span"` ContentLines are not subject to this normalization.
- `$$allowedContentLineStyleAttrNames` — style attributes on a `ContentLine` not in the list are removed
- `$$allowedGlyphFormatterStyleAttrNames` — style attributes on a `GlyphFormatter` not in the list are removed
- `$$allowedGlyphFormatterInlineTags` — inline tags on a `GlyphFormatter` not in the list are removed

**Intentionally unenforced during mutation** — some rules are enforced only at the public API boundary, not at every intermediate mutation step (which would make complex multi-step operations unnecessarily difficult):

- A `linked-characters` `NestedEditable`'s `ContentLine` must contain a `FilledContentLineChild`.
- A `List` must contain at least one `ListItem`.

### Display modes

`RootEditable` and `NestedEditable` each have a `$display` property that constrains their children:

| `$display` | Allowed children | Required `ContentLine.localName` |
|---|---|---|
| `"block multi-line"` | One or more `Line` nodes (`ContentLine` or `BlockComponentLine`) | `BlockContentLineLocalName` (`"p"` \| `"h1"`–`"h6"`) |
| `"block single-line"` | Exactly one `ContentLine` (block layout) | `BlockContentLineLocalName` (`"p"` \| `"h1"`–`"h6"`) |
| `"inline"` | Exactly one `ContentLine` (inline layout) | `"span"` |

### Content types

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

### Other node-specific rules

**`ContentLine`:** Empty → must contain a `BeamText`. Non-empty → must contain a `FilledContentLineChild` (any `ContentLineChild` except `BeamText`).

**`BlockComponentLine`:** Fixed structure: `[BlockComponentTextHolder, BlockComponent, BlockComponentTextHolder]`.

**`BlockComponentTextHolder`:** Must contain a `BlockComponentText`.

**`List`:** `$lineType` determines the `$display` of the outermost `NestedEditable` in each `ListItem` — `"multi-line"` → `"block multi-line"`, `"single-line"` → `"block single-line"`. The outermost `NestedEditable`'s `$editState` must be `"inherit"`.

**`ListItem`:** Must contain exactly one outermost `NestedEditable` with `$content.type = "list-item"`.

**`TableCell`:** Must contain exactly one outermost `NestedEditable` with `$content.type = "table-cell"` and `$display = "block multi-line"`.

---

## 8. Selection

### LiveBoundaryPoints

`LiveBoundaryPoints` is the editor's internal state that represents the current selection. It lives on `RootEditable` and is the single source of truth for where the caret or selection is — not the browser's native `Selection` API.

Its initial value points to the `RootEditable` itself at offset 0. Both endpoints always refer to `ContentFlowNode`s inside the `RootEditable`. The `live` prefix reflects that it stays valid even as the DOM mutates around it — it tracks node references directly, not DOM positions.

### How the native selection syncs to LiveBoundaryPoints

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

### The reverse direction: keeping the native selection in sync after user-driven mutations

When a DOM mutation is caused by user input (e.g., pressing backspace removes content), the editor engine explicitly updates the native Selection API to match the new `LiveBoundaryPoints` after the mutation completes. This is necessary because the browser engine may adjust the native selection on its own in response to the DOM change and fire a `selectionchange` event. Without the explicit update from the editor engine, that `selectionchange` would trigger the sync flow above — and the browser engine's adjusted selection would overwrite the `LiveBoundaryPoints` the editor engine just set. By explicitly syncing the native selection right after each user-driven mutation, the editor engine ensures the incoming `selectionchange` finds no difference and produces no change.

### Why programmatic changes do NOT sync the native selection

When `LiveBoundaryPoints` changes due to a programmatic operation (e.g., calling `editorAPI.updateSelectionStyles(...)`), the editor engine does **not** update the native Selection API. This is intentional: the user may have focus on an external input (e.g., a URL field in a popover) while applying a formatting change. Automatically syncing the native selection would steal focus from that external input, which is the wrong behavior.

### Common mistake: programmatic changes without re-focusing

If you call `editorAPI.updateSelectionStyles(...)` without re-focusing the editor afterward, the following happens:

1. The editor engine mutates the DOM (splitting or merging nodes to apply formatting)
2. The browser engine adjusts its native selection in response to the DOM change
3. A `selectionchange` event fires; the editor engine resolves it back into `LiveBoundaryPoints` — potentially landing on a different position than intended

**Fix:** after a programmatic change, call `editorAPI.focus()`. This focuses the editor and syncs the native Selection API to the current `LiveBoundaryPoints`, so the subsequent `selectionchange` finds no difference and does nothing.

If you need to sync the native selection without moving focus (e.g., the editor is already focused), use `editorAPI.getEditorSelection().syncToNativeSelection()` instead.

### EditorSelection

`EditorSelection` is a view over `LiveBoundaryPoints`. It is always in sync with it — whenever `LiveBoundaryPoints` changes, `EditorSelection` reflects the new state. Obtain it via `editorAPI.getEditorSelection()`.

**Important:** reading and writing boundary points through `EditorSelection` only affects `LiveBoundaryPoints` — the native Selection API is not touched. The one exception is `syncToNativeSelection()`, which explicitly pushes the current boundary points into the native browser Selection.

#### from / to vs anchor / focus

Unlike the native Selection API, `EditorSelection` uses `from` / `to` boundary points rather than anchor / focus. `from` and `to` reflect whatever is stored in `LiveBoundaryPoints` — they are not guaranteed to be in DOM order. To determine which end corresponds to the user's anchor or focus, use `direction`:

- `direction === "forward"` → anchor = `from`, focus = `to`
- `direction === "backward"` → anchor = `to`, focus = `from`
- `direction === "none"` → directionless; the selection has no determinable direction. This can occur in multiple cases — for example, double-clicking a word selects it with a directionless selection on some OS/browser combinations. Whether the selection is collapsed or not is independent of this value. See the [W3C Selection API — directionless](https://w3c.github.io/selection-api/#dfn-directionless).

`domDirection` gives the relative DOM ordering of `from` vs `to` as computed from their positions in the tree. Use it when you need to know whether `from` comes before `to` in the DOM — the two do not have a guaranteed ordering.

#### Methods

| Method | Description |
|---|---|
| `getBoundaryPoints()` | Returns `{ fromText, fromOffset, toText, toOffset }`. Both text references are always `EditorText` nodes — never element-level boundary points. |
| `setBoundaryPoints({ fromNode, fromOffset, toNode, toOffset })` | Sets new boundary points on `LiveBoundaryPoints`. Accepts `ContentFlowNode` (more permissive than `getBoundaryPoints`). Silently ignored if either point is outside this `RootEditable` or invalid. Does not update the native Selection API. |
| `isValidBoundaryPoints()` | Returns `true` if the current boundary points are within the same editable context. |
| `collapse({ whereTo: "from" \| "to" })` | Collapses the selection to the `from` or `to` end. |
| `syncToNativeSelection()` | Pushes the current `LiveBoundaryPoints` into the native browser Selection API. Anchor maps to the DOM-start boundary point; focus maps to the DOM-end boundary point. Not automatic — call it explicitly when you need the native caret/selection to reflect the current editor state (e.g. after `insertNode`, or `removeNodesInRange`). **Why not automatic:** the user might have focus on an external element (e.g. a URL input in a link popover) and auto-syncing would steal focus from there. |

### EditorRange

`EditorRange` is a utility class for inspecting a span of editor content. Think of it as the editor's equivalent of a `StaticRange` — it captures a snapshot of two boundary points at construction time and does not stay in sync with the DOM or with `LiveBoundaryPoints`. Unlike `EditorSelection`, which reflects `LiveBoundaryPoints` as-is, `EditorRange` **always normalizes its boundary points into DOM order** (start ≤ end) in the constructor. This means it is safe to query `startText` / `endText` without worrying about which end came first — regardless of how the `fromNode`/`toNode` were passed in, `start` is always the earlier point in the DOM.

Construct it directly:

```ts
import { EditorRange } from "rich-text-area";

const range = new EditorRange({ fromNode, fromOffset, toNode, toOffset });
// fromNode / toNode accept ContentFlowNode — resolved to EditorText internally
// start and end are guaranteed: startText ≤ endText in DOM order
```

#### Boundary point properties

All four properties resolve to `EditorText` — never element-level nodes.

| Property | Type | Description |
|---|---|---|
| `startText` | `EditorText` | The earlier text node in DOM order |
| `startOffset` | `number` | Offset within `startText` |
| `endText` | `EditorText` | The later text node in DOM order |
| `endOffset` | `number` | Offset within `endText` |

#### State properties

| Property | Type | Description |
|---|---|---|
| `collapsed` | `boolean` | `true` when `startText === endText && startOffset === endOffset` — both endpoints are the same point |
| `isSameDOMTree` | `boolean` | `true` when `startText` and `endText` are in the same connected DOM tree (not detached or disconnected from each other) |

#### Validity

```ts
range.isValidBoundaryPoints() // → boolean
```

Returns `true` when all three conditions hold:
- `isSameDOMTree` — both endpoints are in the same connected tree
- `isCorrectOrder` — start is before or equal to end in the DOM (always `true` for a freshly constructed `EditorRange` since the constructor normalizes order)
- Same `EditingRoot` — both endpoints resolve to the same `EditingRoot` via their editable context

#### Line containment properties

These are useful for checking whether a range spans across line boundaries.

| Property | Type | Description |
|---|---|---|
| `isSameContentLine` | `boolean` | `true` when both endpoints' closest `ContentLine` ancestor is the same node — regardless of whether that `ContentLine` is block or inline |
| `isSameBlockContentLine` | `boolean` | `true` when both endpoints resolve to the same block-level `ContentLine`. Walks up past inline `ContentLine`s (inside inline `NestedEditable`s) to find the nearest block `ContentLine`. For example, two endpoints in different inline `NestedEditable`s both contained by the same block `ContentLine` return `true`. |
| `isSameBlockComponentLine` | `boolean` | `true` when both endpoints are within the same `BlockComponentLine` |
| `isSameBlockLine` | `boolean` | `true` when both endpoints are within the same block-level `Line` — either a block `ContentLine` or a `BlockComponentLine` |

#### `containsRangeSensitiveNode`

```ts
range.containsRangeSensitiveNode // → boolean
```

`true` when at least one `RangeSensitiveNode` (`BasicText`, `OneVisualUnitText`, or `Component`) falls — even partially — between the start and end boundary points. "Partially" means even a single Unicode code point of a `BasicText` being within the range is enough to return `true`. Conversely, if the range spans only `RangeNeutralNode`s (e.g. only `InlineComponentText` sentinels between two `InlineComponent`s), this returns `false`.

#### `isSinglePoint`

```ts
range.isSinglePoint // → boolean
```

`true` when both of the following hold:
- `containsRangeSensitiveNode` is `false`
- The start and end are in the same line (`isSameContentLine || isSameBlockComponentLine`)

**This is not the same as `collapsed`.** A range can span across `RangeNeutralNode`s (`BeamText`, `InlineComponentText`, `BlockComponentText`) on the same line and still be `isSinglePoint` — because those nodes carry no meaningful range content. In contrast, `collapsed` requires both endpoints to be the exact same text node at the exact same offset.

#### Methods

| Method | Returns | Description |
|---|---|---|
| `isDescendant({ container, start, end })` | `boolean` | Checks whether the specified endpoint(s) are descendants of `container`. Pass `start: true` to check `startText`, `end: true` to check `endText`, or both. At least one must be `true`. |
| `isPointInRange({ node, offset })` | `boolean` | Delegates to the native `Range.isPointInRange`. Returns `true` if the given `{ node, offset }` falls within the range. |
| `comparePoint({ node, offset })` | `{ position: "before" \| "inRange" \| "after" }` | Delegates to the native `Range.comparePoint`. Returns where the given point sits relative to the range. |
| `isIntersectsNode({ node })` | `boolean` | Delegates to the native `Range.intersectsNode`. Returns `true` if the range overlaps with the given node at all. |
| `compareBoundaryPoints({ how, sourceRange })` | `"before" \| "equal" \| "after"` | Compares a boundary point of this range against a boundary point of `sourceRange`. `how` controls which pair is compared: `"startToStart"` \| `"startToEnd"` \| `"endToEnd"` \| `"endToStart"`. Delegates to the native `Range.compareBoundaryPoints`. |
| `getBoundingClientRect()` | `DOMRect` | Returns the bounding client rect of the range. Delegates to the native `Range.getBoundingClientRect`. |
| `scrollIntoView(params)` | `void` | Scrolls the viewport so the range is visible. `params` accepts standard `ScrollIntoViewOptions`. For `isSinglePoint` ranges (same line, no `RangeSensitiveNode`), scrolls the start boundary point into view using an internal caret-aware scroll; for all other ranges, scrolls the common ancestor container element. |

#### Typical pattern: EditorSelection → EditorRange

`EditorSelection` reflects `LiveBoundaryPoints` as-is (unordered). `EditorRange` gives you a DOM-ordered, static snapshot to query against. The common pattern is to read from `EditorSelection` and immediately construct an `EditorRange`:

```ts
const { fromText, fromOffset, toText, toOffset } = editorSelection.getBoundaryPoints();
const range = new EditorRange({ fromNode: fromText, fromOffset, toNode: toText, toOffset });
// range.startText / range.endText are now always in DOM order, regardless of selection direction
```

---

## 9. Snapshots

RangeX uses two distinct snapshot types, each serving a different purpose:

| Type | Purpose | Includes caret | Persisted? |
|---|---|---|---|
| `StoredSnapshot` | Persistence — save to DB, restore on reload | No | Yes |
| `EditorSnapshot` | In-memory undo/redo — lives in the `SnapshotTimeline` | Yes | No |

They are structurally different objects. `StoredSnapshot` is designed to be JSON-serialized and stored. `EditorSnapshot` contains `UniqueId`-based caret references and is only valid during the same session.

---

### StoredSnapshot

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

### EditorSnapshot

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

### SnapshotView

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

## 10. Events

RangeX has two distinct event systems: **editor events** (high-level editor state changes) and **DOM events** (native browser events on editor elements). Both are accessed through `editorAPI`.

---

### Editor events

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

#### Microtask batching

All editor events are batched. Multiple `scheduleEvent` calls within the same synchronous tick queue only one microtask. On that microtask, all pending events are atomically collected and dispatched in a fixed order. This means callbacks always fire asynchronously, after the current synchronous work completes, and multiple changes in the same tick produce exactly one round of events.

Fixed dispatch order: `selection-in` → `editor-selection-change` → `table-selection-change` → `selection-styles-change` → `list-child-nodes-change` → `table-structure-change` → `snapshot-before-add` → `snapshot-index-change` → `selection-out`.

#### All 9 editor event types

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

### DOM events — `registerDOMEvent`

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

#### Why use `registerDOMEvent` instead of `.addEventListener`

Using native `.addEventListener` directly on editor elements is unreliable because editor nodes are regularly created, destroyed, and re-created:

- When the user copies and pastes content (Ctrl+C / Ctrl+V), the pasted nodes are new DOM nodes — they will not have any manually-attached listeners.
- When content is loaded from a `StoredSnapshot`, all nodes are reconstructed from scratch — again, no manually-attached listeners.
- When a node is moved or re-inserted through any editor operation, the same applies.

`registerDOMEvent` solves this by registering the spec (the `when` predicate + listener) centrally. The framework re-applies it to all matching elements whenever they connect or reconnect to the editor, ensuring listeners are always present regardless of how the node was created or inserted.

#### DOM events and read-only mode

When the editor is in read-only mode (`setIsTextAreaEditable(false)`), all interactivity is removed from editor elements — registered DOM event listeners **will not fire**. This is intentional: read-only mode completely strips all interactive behavior from the editor.

---

### Event interception — `registerEventInterceptor`

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

#### Interceptor return value

- Return `true` — cancel engine handling. The engine calls `event.preventDefault()` and returns without executing its normal logic.
- Return `false` — let the engine proceed normally.

#### Multiple interceptors

All registered interceptors for a given event type always run. If **any** interceptor returns `true`, the engine is cancelled — there is no short-circuit. This ensures every interceptor has the opportunity to observe the event regardless of what others decide.

#### Difference from `registerDOMEvent`

`registerDOMEvent` is observation-only — the engine always processes the event. `registerEventInterceptor` is the only way to prevent the engine's built-in handling of the event.

---

## 11. SnapshotTimeline

`SnapshotTimeline` is the undo/redo system. Each `RangeX` instance has exactly one timeline. Consumers access it via `editorAPI.getSnapshotTimeline()`, which returns a `SnapshotTimeline`.

```ts
const timeline = editorAPI.getSnapshotTimeline();
```

---

### Reading timeline state

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

### Navigating the timeline

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

### Snapshot commit flow — `registerSnapshotBoundary`

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

### Session merging — how the framework batches keyboard events

The framework internally calls the equivalent of `registerSnapshotBoundary` for every user input (keystrokes, cut, paste, drag-and-drop, formatting changes, table structure changes). Not all of these create a snapshot immediately — keyboard character insertions and deletions use **session merging**:

- The first keystroke in a new typing session sets a 600ms timer.
- Any further keystrokes before the timer fires are grouped into the same session.
- When the timer fires (600ms after the first keystroke in the session), the snapshot is committed.
- A keystroke after the timer has already fired starts a new session.

The effect is that continuous typing is captured as one undo step, while typing with long pauses produces separate steps.

All other input types (Enter/newline, cut, paste, drag-and-drop, format changes, table structure changes) commit a snapshot **immediately**, not as part of a session.

---

### Redo branching

Any change to the editor — including every keystroke — discards all snapshots ahead of `currentIndex` before the new snapshot is committed. This is the standard linear undo/redo model: if you undo three steps and then type something, the three undone states are permanently gone.

---

### Memory limits — `maxSnapshotCount` and `snapshotPruneInterval`

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

---

## 12. FindReplace

`FindReplace` manages find-and-replace highlighting over a scoped `EditorElement` subtree. It must be explicitly enabled before use. Matches are painted with the CSS Custom Highlight API under two named highlights — one for all matches and one for the currently active match. Index and match-set change notifications are delivered asynchronously via microtask-batched listeners.

Obtain the instance from the editor API:

```ts
const findReplace = rangeX.editorAPI.getFindReplace();
```

Always returns the same object — `FindReplace` is a singleton per editor instance.

---

### Lifecycle

`FindReplace` starts inactive. Call `enable()` before it tracks mutations or paints highlights. Call `disable()` to tear everything down.

| Method / Getter | Description |
|---|---|
| `enable()` | Activates `FindReplace`: starts observing the scope subtree for mutations and immediately syncs highlights for any active pattern. Idempotent — calling it twice is a no-op. |
| `disable()` | Deactivates `FindReplace`: disconnects the mutation observer and clears all highlights. Idempotent. |
| `get isEnabled` | `true` if `FindReplace` is currently active, `false` otherwise. |

---

### Criteria

The search criteria combine the regex pattern and the non-editable flag into a single object.

```ts
interface FindReplaceRegExpPattern {
  source: string;
  flags: string;
}

interface FindReplaceCriteria {
  pattern: FindReplaceRegExpPattern;
  nonEditableIncluded: boolean;
}
```

| Method | Description |
|---|---|
| `getCriteria()` | Returns a copy of the current criteria as `FindReplaceCriteria`. |
| `setCriteria(value)` | Accepts a `Partial<FindReplaceCriteria>` — pass only the fields that changed. Clears all existing highlights and re-scans exactly once (if enabled), regardless of how many fields were updated. If `FindReplace` is disabled, the new values are stored but no scan occurs. |

An empty `pattern.source` (`""`) is treated as "no pattern" — `FindReplace` will not scan and will not paint any highlights.

**Invalid regex:** `setCriteria` validates `pattern` by constructing a `RegExp` from `source` and `flags` before storing anything. A syntactically invalid pattern or flag set throws a `SyntaxError` and leaves all criteria unchanged.

**Non-editable content:** by default `FindReplace` only scans `ContentLine`s whose edit state is editable. Set `nonEditableIncluded: true` to include read-only `ContentLine`s in the search as well.

**Surrogate pairs / multi-code-point glyphs:** each surrogate pair or multi-code-point glyph lives in its own `OneVisualUnitText` node and is exposed to the regex as a single atomic string (e.g. `"😊"`). The regex must match the full glyph string to produce a hit; a pattern targeting only half a surrogate pair will not produce a match. If the regex cannot locate a match boundary (e.g. the pattern partially references a surrogate pair), that match is silently skipped with a console warning.

---

### Scope element

The scope element controls which `EditorElement` subtree is searched. Defaults to the editor's `rootEditable`.

| Method | Description |
|---|---|
| `getScopeElement()` | Returns the current scope `EditorElement`. |
| `setScopeElement(value)` | Replaces the scope element. Clears all existing highlights, re-observes the new subtree, and re-scans immediately (if enabled). |

---

### Navigating matches

Matches are indexed in DOM order starting at `0`. Navigation wraps around at both ends.

| Method / Getter | Description |
|---|---|
| `get currentIndex` | The index of the currently highlighted match (the "active" match). Always `0` when there are no matches. |
| `stepBack()` | Moves `currentIndex` to the previous match, wrapping from `0` to `matchedRanges.length - 1`. Updates highlights synchronously. |
| `stepForward()` | Moves `currentIndex` to the next match, wrapping from `matchedRanges.length - 1` to `0`. Updates highlights synchronously. |
| `stepTo({ index })` | Moves `currentIndex` to the given index, clamped to `[0, matchedRanges.length - 1]`. Updates highlights synchronously. |

---

### Reading match data

```ts
interface FindReplaceMatchedRange {
  range: Range;           // native DOM Range spanning the match
  fromText: FormattableText;
  fromOffset: number;
  toText: FormattableText;
  toOffset: number;
  segmentText: string;    // full plain-text content of the scanned segment
  matchStart: number;     // match start offset within segmentText
  matchEnd: number;       // match end offset within segmentText (exclusive)
}
```

| Getter | Description |
|---|---|
| `get matchedRanges` | Returns a `FindReplaceMatchedRange[]` in DOM order — one entry per match. Each entry includes the native `Range` (useful for identifying which CSS Highlight range was clicked), the `FormattableText` boundary points (use these with `EditorRange` for scrolling), and the match's position within the scanned segment text. The array is a snapshot — it does not update as the DOM changes. |

**`segmentText`, `matchStart`, `matchEnd`:** the scanner processes each `ContentLine` as one or more segments, split at `InlineComponent` boundaries (text cannot be matched across an inline component). `segmentText` is the full plain-text string of the segment, and `matchStart`/`matchEnd` are the match's character offsets within it.

**Forcing an immediate read:** by default, mutations are delivered to `FindReplace` asynchronously (via `MutationObserver`). If you need to read `matchedRanges` synchronously after a DOM mutation and get up-to-date results, call `forceRescan()` first.

---

### Force rescan

```ts
forceRescan(): void
```

Flushes any queued `MutationObserver` records and immediately re-scans the affected `ContentLine`s. Use this before reading `matchedRanges` when you need the match list to reflect DOM mutations that occurred in the same synchronous tick. No-op if `FindReplace` is disabled.

---

### Replace

```ts
replace(params: {
  content: FilledContentLineChild[];
  retainedComponents?: string[];
}): void

replaceAll(params: {
  content: FilledContentLineChild[];
  retainedComponents?: string[];
}): void
```

`replace` replaces the currently active match (at `currentIndex`) with `content`, then advances `currentIndex` to the next match after the insertion point. If there is no next match, `currentIndex` resets to `0`. No-op if `FindReplace` is disabled or there are no matches.

`replaceAll` resets `currentIndex` to `0` and calls `replace` once for each match that existed at the time `replaceAll` was called. No-op if `FindReplace` is disabled.

`content` is a `FilledContentLineChild[]` — the same node types that can appear as direct children of a `ContentLine`. The nodes are cloned before insertion; the originals are not consumed.

`retainedComponents` is an optional list of component names (`InlineComponent.$$componentName`). When a match fully covers the content of a component whose name is in this list, the component shell is preserved and only its inner content is replaced. Without this option, a full-content replacement removes the component wrapper entirely and inserts the replacement as plain content. Defaults to `[]` (no components retained).

---

### Listeners

Both listeners are notified asynchronously — in a microtask queued after the synchronous work that caused the change.

```ts
onIndexChange(callback: () => void): () => void
onMatchesChange(callback: () => void): () => void
```

| Listener | Fires when |
|---|---|
| `onIndexChange` | `currentIndex` changes — from navigation (`stepBack`, `stepForward`, `stepTo`) or from a mutation that caused the active match to be clamped. |
| `onMatchesChange` | The match set changes — new `ContentLine`s were scanned (after `setCriteria`, `setScopeElement`, or a DOM mutation). Does NOT fire on navigation-only changes. |

Both return an unsubscribe function:

```ts
const unsubscribeIndex = findReplace.onIndexChange(() => {
  console.log("current:", findReplace.currentIndex, "of", findReplace.matchedRanges.length);
});

const unsubscribeMatches = findReplace.onMatchesChange(() => {
  const matches = findReplace.matchedRanges;
  // matches is up-to-date at this point
});

// later:
unsubscribeIndex();
unsubscribeMatches();
```

---

### Full usage example

```ts
const findReplace = rangeX.editorAPI.getFindReplace();

findReplace.enable();
findReplace.setCriteria({ pattern: { source: "hello", flags: "gi" } });

findReplace.onMatchesChange(() => {
  const matches = findReplace.matchedRanges;
  console.log("total matches:", matches.length);
  console.log("matches:", matches);
});

findReplace.onIndexChange(() => {
  console.log("active index:", findReplace.currentIndex);
});

// navigate
findReplace.stepForward();
findReplace.stepBack();
findReplace.stepTo({ index: 2 });

// restrict scope to a specific nested editable
findReplace.setScopeElement(someNestedEditable);

// tear down
findReplace.disable();
```



---

## 13. Selection Formatting

Formatting in RangeX operates at two levels: **line-level** (applied to `ContentLine` elements — tag name and block CSS) and **text-level** (applied to `GlyphFormatter` elements — inline CSS and inline tags). Both are controlled through a single API call.

---

### `updateSelectionStyles`

```ts
editorAPI.updateSelectionStyles({
  localName?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
  styles?: {
    // ContentLine properties:
    lineHeight?: StructuredStyleValue | null;
    paddingBlock?: StructuredStyleValue | null;
    paddingInline?: StructuredStyleValue | null;
    textAlign?: StructuredStyleValue | null;
    textIndent?: StructuredStyleValue | null;
    // GlyphFormatter properties:
    backgroundColor?: StructuredStyleValue | null;
    color?: StructuredStyleValue | null;
    fontFamily?: StructuredStyleValue | null;
    fontSize?: StructuredStyleValue | null;
    fontStyle?: StructuredStyleValue | null;
    fontWeight?: StructuredStyleValue | null;
    letterSpacing?: StructuredStyleValue | null;
    textDecoration?: StructuredStyleValue | null;
  },
  inlineTags?: Partial<Record<GlyphFormatterInlineTag, boolean>>,
})
```

All three parameters are optional and can be combined freely in a single call. Setting a style property to `null` clears it (removes the style from the node). Omitting a property leaves it unchanged.

**`localName`** (`BlockContentLineLocalName`: `"p"` | `"h1"`–`"h6"`) changes the HTML tag of every block `ContentLine` in the selection. Omit to leave line tags unchanged.

**`styles`** applies `StructuredStyleValue`s to `ContentLine`s and `GlyphFormatter`s in the selection. The 5 ContentLine properties (`lineHeight`, `paddingBlock`, `paddingInline`, `textAlign`, `textIndent`) target the line elements; the 8 GlyphFormatter properties target the text elements. Both can appear in the same `styles` object.

Both `localName` and ContentLine `styles` only target **block-level `ContentLine`s** — `ContentLine`s with `$display: "inline"` (those nested inside `InlineComponent`s) are excluded from line formatting.

**`inlineTags`** toggles inline tags on `GlyphFormatter`s in the selection:
- `true` — apply the tag
- `false` — remove the tag
- key omitted — leave the tag unchanged

14 available tags: `"b"`, `"code"`, `"del"`, `"em"`, `"i"`, `"ins"`, `"kbd"`, `"mark"`, `"s"`, `"strong"`, `"sub"`, `"sup"`, `"u"`, `"var"`.

**With a collapsed selection (no text selected)**, `updateSelectionStyles` does not modify any nodes. Instead it updates the **pending format state** on the editor — the format that will be applied to the next typed character.

The framework handles `GlyphFormatter` splitting and merging automatically: applying bold to the middle of a `GlyphFormatter` splits it into formatted and unformatted parts; adjacent `GlyphFormatter`s with identical formats are merged.

---

### `StructuredStyleValue`

All style values passed to `updateSelectionStyles` must be `StructuredStyleValue` objects, not raw CSS strings. A `StructuredStyleValue` has three fields:

```ts
interface StructuredStyleValue {
  type: string;                    // consumer-defined variant identifier
  values: Record<string, unknown>; // structured data
  declarationValue: string;        // CSS string applied to the DOM
}
```

The purpose is to let consumers **store structured state alongside the style** instead of a raw CSS string. This matters when you need to read the value back later — for example, to populate a color picker or adjust a font size slider based on the current selection.

With a raw CSS string like `"light-dark(red, blue)"` or `"linear-gradient(to top, light-dark(red, blue) 50%, yellow 10%)"`, extracting the original intent back from the string requires fragile parsing. With `StructuredStyleValue`, the consumer stores whatever structured data they need, identified by `type`:

```ts
const colorValue = createStructuredStyleValue({
  type: "light-dark",
  values: { light: "red", dark: "blue" },
  resolve: ({ light, dark }) => `light-dark(${light}, ${dark})`,
});
```

The `resolve` function produces `declarationValue` — what gets set on the DOM. The `type` and `values` are stored in snapshots and survive undo/redo, so the structured data is always available when reading back from the timeline.

`createStructuredStyleValue` is exported from `"rich-text-area"`:

```ts
import { createStructuredStyleValue } from "rich-text-area";

const fontSize = createStructuredStyleValue({
  type: "px",
  values: { size: 16 },
  resolve: ({ size }) => `${size}px`,
});

editorAPI.updateSelectionStyles({
  localName: "h2",
  styles: {
    fontSize,
    lineHeight: null,  // clear line height
  },
  inlineTags: { strong: true, em: false },
});
```

---

### `selectionStylesChange` payload — `SelectionFormatStyles`

The payload passed to `"selection-styles-change"` callbacks:

```ts
interface SelectionFormatStyles extends RangeFormat {
  textFormatStylesState: TextFormatStyles;         // pending CSS styles (for next typed char)
  textFormatInlineTagsState: TextFormatInlineTags; // pending inline tags
}
```

`textFormatStylesState` and `textFormatInlineTagsState` represent the **pending format** — what will apply to the next character typed. These are set when the user triggers formatting with a collapsed selection and cleared after the first character is typed.

`RangeFormat` describes the current format state across the selection:

```ts
interface RangeFormat {
  contentLineLocalNames: {
    values: BlockContentLineLocalName[];
    permission: PermissionOption;
  };
  contentLineStructuredStyle: {
    [key: ContentLineStyleAttrName]: {
      style: StyleState<StructuredStyleValue>;
      permission: PermissionOption;
    };
  };
  glyphFormatterStructuredStyle: {
    [key: GlyphFormatterStyleAttrName]: {
      style: StyleState<StructuredStyleValue>;
      permission: PermissionOption;
    };
  };
  glyphFormatterInlineTags: {
    [tag: GlyphFormatterInlineTag]: {
      state: "applied" | "not-applied" | "mixed";
      permission: PermissionOption;
    };
  };
}
```

**`style`** for structured style properties:

```ts
{ state: "applied";     values: StructuredStyleValue[] }  // same value on all nodes
{ state: "not-applied" }                                   // not set on any node
{ state: "mixed";       values: StructuredStyleValue[] }  // different values across selection
```

**`state`** for inline tags: `"applied"` | `"not-applied"` | `"mixed"` — same semantics.

**`permission`** on every field reflects whether that format can be applied to the selection:

- `"allowed"` — all `ScopedEditable` ancestors in the selection permit this format (i.e., the format is included in the `ScopedEditable`'s `$allowedContentLineLocalNames` / `$allowedContentLineStyleAttrNames` / `$allowedGlyphFormatterStyleAttrNames` / `$allowedGlyphFormatterInlineTags`)
- `"not-allowed"` — the format is restricted by a `ScopedEditable`'s `$allowed*` props
- `"mixed"` — some `ScopedEditable` ancestors allow it and others don't

`contentLineLocalNames.values` is an array of all distinct `BlockContentLineLocalName`s found in the selection (e.g., `["p"]` if all lines are paragraphs, `["p", "h1"]` if the selection spans mixed line types). Inline `"span"` ContentLines are never formattable and never appear in this array.

---

### `updateGlyphFormatterInlineTagsOrder`

```ts
editorAPI.updateGlyphFormatterInlineTagsOrder({
  glyphFormatterInlineTagsOrder: ["strong", "em", "u", ...],
});
```

Updates the serialization nesting order of inline tags at runtime. This affects HTML output and `SnapshotView` — it determines which tag wraps which when multiple inline tags are active on a `GlyphFormatter` (e.g. `<strong><em>…</em></strong>` vs `<em><strong>…</strong></em>`). It does not affect the DOM representation inside the editor (always flat `inline-tags` attribute). See [section 3](#3-setup--initialization) for how `glyphFormatterInlineTagsOrder` is set at construction time.

---

## 14. EditorAPI

`EditorAPI` is the main interface through which consumers interact with the editor at runtime. It is exposed via the `editorAPI` getter on the `RangeX` instance:

```ts
const { editorAPI } = rangeX;
```

`editorAPI` is not a class — it is a plain object whose methods are bound to the `RangeX` instance. All state lives in the `RangeX` instance; the object itself can be passed around freely.

---

### Properties

#### `shadowRoot`

```ts
readonly shadowRoot: ShadowRoot
```

The `ShadowRoot` attached to the `RangeX` element. All editor DOM — the `RootEditable`, styles, the caret anchor, and internal structural elements — lives inside this shadow root. Useful when:

- Querying elements within the shadow tree
- Targeting CSS from an external stylesheet that needs shadow DOM scope
- Mounting anchored UI relative to the shadow host

#### `rootEditable`

```ts
readonly rootEditable: RootEditable
```

The `RootEditable` node — the top-level editor element. This is the same node passed (or constructed from a snapshot) in the `RangeX` constructor. Direct access is needed for tree traversal, node creation context, and any operation that takes a `RootEditable` parameter.

---

### State

#### `getIsSelectionActive()`

```ts
getIsSelectionActive(): boolean
```

Returns `true` when the editor currently has focus (i.e., there is an active selection inside the editor). Does not distinguish between a collapsed caret and a range selection — both count as active.

#### `getIsTextAreaEditable()` / `setIsTextAreaEditable(params)`

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

#### `getIsTextAnimation()` / `setIsTextAnimation(params)`

```ts
getIsTextAnimation(): boolean
setIsTextAnimation(isTextAnimation: boolean): void
```

Gets or sets whether text animation is active. When `true`, each `GlyphFormatter` created for newly typed characters receives a `data-interactive-text-animation="true"` attribute. The consumer targets this attribute with CSS to produce an enter animation — for example, fading a character in from opacity 0 to 1 as the user types.

The attribute is removed automatically when the CSS animation ends. While the attribute is present, the `GlyphFormatter` is not merged with adjacent ones that have matching formats — this ensures each newly typed character keeps its own element and its own animation lifecycle. Once the animation ends, normal merging resumes.

This is `false` by default.

---

### Focus and selection sync

#### `focus()`

```ts
focus(): void
```

Programmatically focuses the editor. Syncs the native `Selection` API to the current `LiveBoundaryPoints`, then moves browser focus into the editor's shadow DOM.

#### `getEditorSelection()`

```ts
getEditorSelection(): EditorSelection
```

Returns the `EditorSelection` instance associated with this editor. Always returns the same object — it is live and auto-updates. See [section 8](#8-selection) for the full `EditorSelection` API.

#### `getSnapshotTimeline()`

```ts
getSnapshotTimeline(): SnapshotTimeline
```

Returns the `SnapshotTimeline` for undo/redo. Always returns the same object. See [section 11](#11-snapshottimeline) for the full `SnapshotTimeline` API.

#### `getFindReplace()`

```ts
getFindReplace(): FindReplace
```

Returns the `FindReplace` instance associated with this editor. Always returns the same object — the instance starts in the disabled state; call `.enable()` before use. See [section 12](#12-findreplace) for the full `FindReplace` API.

---

### Custom styles

#### `replaceCustomStyles(styleSheetText)`

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

### External drag

#### `startExternalDrag(event)`

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

### Content mutations

All mutation methods operate on `ContentFlowNode` boundary points (`fromNode`/`fromOffset`, `toNode`/`toOffset`). They auto-normalize to DOM order where relevant and require that the boundary points fall within an editable zone (`EditState = "editable"`). If the boundary points are invalid, a descriptive error is thrown.

#### `insertNode(params)`

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

#### `removeNodesInRange(params)`

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

#### `cloneNodesInRange(params)`

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

### Plain text

#### `getPlainText(params)`

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

#### `createPlainTextScanner(params)`

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

### Wrapping — block components

#### `getBlockWrappableSegment(params)`

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

### Wrapping — inline components

#### `getInlineWrappableSegments(params)`

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

### Replacing a component

#### `replaceComponentTop(fromComponentTop, callback)`

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

### Persistence snapshot

#### `createStoredSnapshot()`

```ts
createStoredSnapshot(): StoredSnapshot
```

Creates a serializable snapshot of the current editor content for **persistence** (e.g. saving to a database). Returns:

```ts
interface StoredSnapshot {
  version: string;                                     // RangeX major version at snapshot time
  snapshot: RootEditableSnapshot;                      // full tree snapshot
  glyphFormatterInlineTagsOrder: GlyphFormatterInlineTag[]; // serialization order
}
```

`StoredSnapshot` differs from the undo/redo snapshot format in one key way: **it does not include caret position**. Caret position is ephemeral and meaningless for storage.

The snapshot is a deep, plain-object representation of the entire editor tree — every element, attribute, and text node, recursively. It can be safely serialized to JSON.

To restore a `StoredSnapshot`, pass it as `rootEditableFrom` in the `RangeX` constructor:

```ts
const rangeX = new RangeX({
  rootEditableFrom: {
    type: "snapshot",
    storedSnapshot,
  },
  shadowRootOptions: { mode: "open", serializable: true },
});
```

**Note:** `createStoredSnapshot()` snapshots the current live state of the editor. If you need to capture state at a specific undo/redo step, first call `stepTo({ index })` on the `SnapshotTimeline` (obtained via `editorAPI.getSnapshotTimeline()`), then call `createStoredSnapshot()`.

---

### Events (cross-references)

**`subscribeEditorEvent(params)`** — subscribe to editor lifecycle events (`"editor-selection-change"`, `"selection-styles-change"`, etc.). See [section 10 — Events](#10-events) for the full event type reference, payloads, and dispatch order.

**`registerDOMEvent(params)`** — register DOM event listeners on `EditorElement`s via a centralized `when` predicate. See [section 10 — Events](#10-events) for the full specification, the reason to prefer this over `.addEventListener`, and read-only mode behavior.

**`registerEventInterceptor(params)`** — intercept events (`"keydown"`, `"beforeinput"`, `"paste"`, `"copy"`, `"cut"`, `"dragstart"`, `"dragenter"`, `"dragover"`, `"dragleave"`, `"drop"`, `"dragend"`) before the engine processes them. Return `true` from the interceptor to cancel engine handling. See [section 10 — Events](#10-events) for the full specification and the difference from `registerDOMEvent`.