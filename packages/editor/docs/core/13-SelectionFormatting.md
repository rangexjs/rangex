# 13. Selection Formatting

Formatting in RangeX operates at two levels: **line-level** (applied to `ContentLine` elements — tag name and block CSS) and **text-level** (applied to `GlyphFormatter` elements — inline CSS and inline tags). Both are controlled through a single API call.

---

## `updateSelectionStyles`

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

## `StructuredStyleValue`

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

`createStructuredStyleValue` is exported from `"@rangex/core"`:

```ts
import { createStructuredStyleValue } from "@rangex/core";

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

## `selectionStylesChange` payload — `SelectionFormatStyles`

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

## `updateGlyphFormatterInlineTagsOrder`

```ts
editorAPI.updateGlyphFormatterInlineTagsOrder({
  glyphFormatterInlineTagsOrder: ["strong", "em", "u", ...],
});
```

Updates the serialization nesting order of inline tags at runtime. This affects HTML output and `SnapshotView` — it determines which tag wraps which when multiple inline tags are active on a `GlyphFormatter` (e.g. `<strong><em>…</em></strong>` vs `<em><strong>…</strong></em>`). It does not affect the DOM representation inside the editor (always flat `inline-tags` attribute). See [section 3](#3-setup--initialization) for how `glyphFormatterInlineTagsOrder` is set at construction time.
