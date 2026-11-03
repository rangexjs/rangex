# StructuredStyle

The editor's structured styles: the values a ContentLine's or GlyphFormatter's `structuredStyle` holds, and how each
one becomes CSS. `src/StructuredStyle/` (alias `#structured-style`).

## What it holds

- **Value types** (`StructuredStyle-types.ts`) — the stored format of every style, named by its CSS property:
  `FontSizeValue`, `PaddingBlockValue`, `TextIndentValue`, the colors (`StructuredColor`, `ThemeColors`), and so on.
  The Formatting adapter uses them for its state and setters (its `lineSpacing` is a `PaddingBlockValue`, its
  `indentation` a `TextIndentValue`), and `@rangex/editor/formatting` exports them.
- **Creators** (`StructuredStyle.ts`) — one per style, e.g. `createFontSizeStructuredStyle({ fontSize })`. Each one
  builds the engine's `StructuredStyleValue` from its value: `declarationValue`, the CSS that's rendered, is always
  derived from `values`, never given.
- **Guards** — `isValid*StructuredStyle`, which only check a style's `type` so far.

Everything that builds a structured style goes through a creator: `getSelectionStylesData` (the Formatting adapter's
actions) and the media captions' `text-align`.

## Rules

- **DOM-free at import time.** The snapshot validation will check structured styles on a server, so nothing here may
  touch the DOM when it's imported. Only import `@rangex/core`, `#utilities` and `#constants`.
