# 12. FindReplace

`FindReplace` manages find-and-replace highlighting over a scoped `EditorElement` subtree. It must be explicitly enabled before use. Matches are painted with the CSS Custom Highlight API under two named highlights — one for all matches and one for the currently active match. Index and match-set change notifications are delivered asynchronously via microtask-batched listeners.

Obtain the instance from the editor API:

```ts
const findReplace = editorAPI.getFindReplace();
```

Always returns the same object — `FindReplace` is a singleton per editor instance.

---

## Lifecycle

`FindReplace` starts inactive. Call `enable()` before it tracks mutations or paints highlights. Call `disable()` to tear everything down.

| Method / Getter | Description |
|---|---|
| `enable()` | Activates `FindReplace`: starts observing the scope subtree for mutations and immediately syncs highlights for any active pattern. Idempotent — calling it twice is a no-op. |
| `disable()` | Deactivates `FindReplace`: disconnects the mutation observer and clears all highlights. Idempotent. |
| `get isEnabled` | `true` if `FindReplace` is currently active, `false` otherwise. |

---

## Criteria

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

## Scope element

The scope element controls which `EditorElement` subtree is searched. Defaults to the editor's `rootEditable`.

| Method | Description |
|---|---|
| `getScopeElement()` | Returns the current scope `EditorElement`. |
| `setScopeElement(value)` | Replaces the scope element. Clears all existing highlights, re-observes the new subtree, and re-scans immediately (if enabled). |

---

## Navigating matches

Matches are indexed in DOM order starting at `0`. Navigation wraps around at both ends.

| Method / Getter | Description |
|---|---|
| `get currentIndex` | The index of the currently highlighted match (the "active" match). Always `0` when there are no matches. |
| `stepBack()` | Moves `currentIndex` to the previous match, wrapping from `0` to `matchedRanges.length - 1`. Updates highlights synchronously. |
| `stepForward()` | Moves `currentIndex` to the next match, wrapping from `matchedRanges.length - 1` to `0`. Updates highlights synchronously. |
| `stepTo({ index })` | Moves `currentIndex` to the given index, clamped to `[0, matchedRanges.length - 1]`. Updates highlights synchronously. |

---

## Reading match data

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

## Force rescan

```ts
forceRescan(): void
```

Flushes any queued `MutationObserver` records and immediately re-scans the affected `ContentLine`s. Use this before reading `matchedRanges` when you need the match list to reflect DOM mutations that occurred in the same synchronous tick. No-op if `FindReplace` is disabled.

---

## Replace

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

## Listeners

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

## Full usage example

```ts
const findReplace = editorAPI.getFindReplace();

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
