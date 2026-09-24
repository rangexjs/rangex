# Styles

`@rangex/editor` is headless — it ships no rendered UI of its own — but the engine it wraps still needs CSS to
function inside its shadow DOM (colors, layout for block components, widget chrome, etc.). Every style that belongs
to the engine, as opposed to a consumer's own UI, is written under `src/Styles`. This file is the rulebook for adding
to it.

> Note: the folders it describes are currently empty because nothing has been organized into them yet, not because
> the structure is optional.

## EngineStyles buckets

`src/Styles/EngineStyles` holds one subfolder per concern:

- **Base** — engine-wide fundamentals that don't belong to any one component or element: custom color variables,
  `interpolate-size`, and similar global setup.
- **Components** — styling for a specific component: `Link.css`, `Mention.css`, `CodeBlock.css`, etc. One file (set)
  per component.
- **EditorElements** — styling for the engine's structural elements (as opposed to components): `RootEditable`,
  `ContentLine`, `BlockComponentLine` alignment, and the like.
- **Widgets** — styling for engine-rendered UI chrome that is neither a component nor a structural element, e.g. a
  table's row resizer.

Add a new engine style to whichever bucket matches what it styles, not to `Base` by default.

## File naming

Within any bucket, a style file is named for which mode(s) it applies to:

- `X.css` — common, used in both editor mode and view mode.
- `X.editor.css` — editor mode only.
- `X.view.css` — view mode only.

"Editor mode" is a live, interactive `RangeXEditor` instance. "View mode" is rendered, non-interactive HTML output
(see [Snapshot.md](Snapshot.md)).

## Build functions

Three functions turn the bucket files into the style text each mode needs. Each simply concatenates its inputs, e.g.
`const common = style1 + style2; return common;` — no per-bucket aggregation step, no build-time logic beyond string
concatenation.

- **`buildCommonStyleText()`** — no params. Concatenates every `*.css` (common) file across all four buckets.
- **`buildEditorStyleText(styles: string)`** — `buildCommonStyleText()` + every `*.editor.css` file across all four
  buckets + the caller's own `styles` string (the CSS a consumer passes into `createEditor`).
- **`buildViewStyleText(styles: string)`** — same as `buildEditorStyleText`, but with every `*.view.css` file
  instead, and the caller's `styles` string coming from whoever is producing the view output.

The `styles` parameter in both cases is the consumer's own CSS, layered on top of the engine's required styles — it
is not where the engine's own styles are supplied.

## Host styles

Out of scope here — see the separate host styles handling (`getHostStyleText`), which is unrelated to the engine's
shadow DOM styling described above.
