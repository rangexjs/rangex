# 5. Creating Nodes

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

## Common parameters

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

## `createRootEditable(params)`

Creates a `RootEditable`. This is the top-level container passed to `createEditorAPI(...)`.

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

## `createNestedEditable(params)`

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

## `createContentLine(params)`

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

## `createGlyphFormatter(params)`

Creates a `GlyphFormatter`. Each `GlyphFormatter` holds text with a single consistent format.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `inlineTags` | `Set<GlyphFormatterInlineTag>` | No | Active inline tags. Valid values: `"b"`, `"code"`, `"del"`, `"em"`, `"i"`, `"ins"`, `"kbd"`, `"mark"`, `"s"`, `"strong"`, `"sub"`, `"sup"`, `"u"`, `"var"` |
| `structuredStyle` | `Partial<GlyphFormatterStructuredStyle>` | No | Initial CSS. Valid properties: `backgroundColor`, `color`, `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`, `letterSpacing`, `textDecoration` |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `(BasicText \| OneVisualUnitText)[]` | No | Use `createFormattableTexts` to produce these from a string |

---

## `createFormattableTexts({ data })`

Splits a string into the correct mix of `BasicText` and `OneVisualUnitText` nodes. Multi-code-point characters (emoji, surrogate pairs, grapheme clusters) become individual `OneVisualUnitText` nodes; everything else becomes `BasicText`.

```ts
const nodes = createFormattableTexts({ data: "Hi 👋" });
// → [BasicText("Hi "), OneVisualUnitText("👋")]
```

Returns `FormattableText[]` (`BasicText | OneVisualUnitText`).

---

## `createBeamText(params)`

Creates a `BeamText` — the `\n` sentinel used in empty `ContentLine`s. Pass `{}` (no parameters needed).

```ts
createContentLine({ childNodes: [createBeamText({})] })
```

---

## `createInlineComponent(params)`

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

## `createBlockComponent(params)`

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

## `createBlockComponentTextHolder(params)` / `createBlockComponentLine(params)`

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

## `createHTMLLayout(params)` / `createSVGLayout(params)` / `createMathMLLayout(params)`

| Parameter | Type | Required | Description |
|---|---|---|---|
| `localName` | `keyof HTMLElementTagNameMap` (or SVG/MathML equivalent) | Yes | The HTML/SVG/MathML tag to create |
| `domAttrs` | `DOMAttrs` | No | |
| `childNodes` | `LayoutUnitChild[]` | No | `NestedEditable \| LayoutUnit \| DetachedContext` |

---

## `createList(params)`

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

## `createTable(params)`

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

## `createDetachedContext(params)`

Creates a `DetachedContext` — the schema-free escape hatch with its own shadow DOM (see [`DetachedContext` in section 4](#detachedcontext)).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `localName` | `"div" \| "span" \| "slot"` | No | Defaults to `"div"` |
| `shadowTree` | `(Element \| Comment \| Text)[]` | No | Initial content appended into the shadow root. Ignored if `localName` is `"slot"` — a slot has no shadow root to append into. |
| `domAttrs` | `DOMAttrs` | No | |
