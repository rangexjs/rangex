# StructuredStyle

The editor's structured styles: the values a ContentLine's or GlyphFormatter's `structuredStyle` holds, and how each
one becomes CSS. `src/StructuredStyle/` (alias `#structured-style`).

## What it holds

- **Value types** (`StructuredStyleValues/`) — the stored format of every style, named by its CSS property:
  `FontSizeValue`, `PaddingBlockValue`, `TextIndentValue`, the colors (`StructuredColor`, `LightDarkColor`), and so on.
  The Formatting adapter uses them for its state and setters (its `lineSpacing` is a `PaddingBlockValue`, its
  `indentation` a `TextIndentValue`), and `@rangex/editor/formatting` exports them.
- **Creators** (`CreateStructuredStyle/`) — one per style, e.g. `createFontSizeStructuredStyle({ fontSize })`. Each one
  builds the engine's `StructuredStyleValue` from its value: `declarationValue`, the CSS that's rendered, is always
  derived from `values`, never given.
- **Checks** (`IsStructuredStyle/`) — one per style, e.g. `isFontSizeStructuredStyle(structuredStyle)`, a type guard.
  A style is valid if its `type` is the style's, its `values` match the style's pattern (no other key, every value in
  the editor's range, colors as hex), and its `declarationValue` is the one its creator resolves from those `values`.
  A stored `declarationValue` is never trusted, so the rendered CSS can only be what the editor builds.

Everything that builds a structured style goes through a creator: `getSelectionStylesData` (the Formatting adapter's
actions) and the media captions' `text-align`.

## Rules

- **DOM-free at import time.** The snapshot validation checks structured styles on a server (see
  [SnapshotValidation](SnapshotValidation.md#styles)), so nothing here may touch the DOM when it's imported. Only
  import `@rangex/core`, `#utilities` and `#constants`.
