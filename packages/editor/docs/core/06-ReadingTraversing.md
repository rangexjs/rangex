# 6. Reading & traversing the tree

## Type guards

All type guards are exported from `"@rangex/core"`. They accept an `EditorNode` (or `EventTarget` for `isEditorNode`) and return `boolean`, narrowing the TypeScript type.

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

## Element-only traversal props

In addition to the `DOMPublicPropsBase` props shared by all nodes (see [section 4](#4-editor-node-types)), element nodes expose:

| Prop | Description |
|---|---|
| `$$children` | Typed array of element children — excludes text nodes |
| `$$closest(selector)` | Closest ancestor `EditorElement` matching a CSS selector, or `null` |
| `$$querySelector(selector)` | First descendant `EditorElement` matching selector, or `null` |
| `$$querySelectorAll(selector)` | All descendant `EditorElement`s matching selector, as an array |
| `$$anchorName` | CSS anchor name for this element — use with CSS `anchor()` to position UI relative to it |

Role selector constants exported from `"@rangex/core"` (e.g. `contentLineRoleSelector`, `glyphFormatterRoleSelector`, `inlineComponentRoleSelector`) are CSS selector strings for use with `$$closest` / `$$querySelector` / `$$querySelectorAll`.

## Walking patterns

`$$childNodes` returns a typed array, not a live NodeList, so all array methods work directly.

**Walk the top-level lines of a RootEditable:**

```ts
for (const child of rootEditable.$$childNodes) {
  // typed as ContentLine | BlockComponentLine
  if (child.$$editorRole === contentLineRole) {
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
import { glyphFormatterRoleSelector } from "@rangex/core";

const glyphFormatters = contentLine.$$querySelectorAll(glyphFormatterRoleSelector);
```

**Check whether a node is reachable by boundary points:**

```ts
import { isContentFlowNode } from "@rangex/core";

if (isContentFlowNode(node)) {
  // safe to use as fromNode / toNode in editorAPI methods
}
```
