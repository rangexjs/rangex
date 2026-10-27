# Sanitizer

The editor's setup of the engine's Sanitizer: the `basePolicy`, `configureSanitizer`, and where it's applied. How the
engine's Sanitizer works (where it applies, the `SanitizerPolicy` format, which rule decides, `canSetAttribute`) is in
the engine's handbook (`15-Sanitizer.md`).

Paths are relative to `src/Sanitizer/` (alias `#sanitizer`) unless noted otherwise.

## Purpose

The Sanitizer only stops XSS. It decides whether the engine may set an attribute at all, on every write
(`$$setAttribute`, the `create*` factories, restoring a snapshot) and in the engine's snapshot validation.

Which attributes a component's elements may have, and which values, is not its job: those rules are the editor's
own, in [DOMAttrs](DOMAttrs.md). The two never overlap in meaning:

- A value the Sanitizer refuses could run code. It's always rejected: the editor refuses the input, and a stored
  snapshot that contains it is invalid. It's never repaired.
- A value that breaks a DOMAttrs rule is safe but not what the editor allows. The editor refuses the input, and a stored
  snapshot that contains it is repaired, unless the rule has nothing to fall back to (see
  [SnapshotValidation](SnapshotValidation.md)).

## `basePolicy`

`BasePolicy/BasePolicy.ts`. A blocklist: every attribute is allowed (`"*": { "*": isAllowed }`) except what could
cause XSS:

- **Every namespace** — `href`, `xlink:href` (SVG, MathML) and the HTML URL attributes (`src`, `action`, `formaction`,
  `data`, `poster`) must be safe URLs (`isSafeURL`). `img.src` and `video.poster` also allow `data:image/*`.
- **`script`** (HTML and SVG) — every attribute is blocked.
- **`iframe`** — `srcdoc` is blocked. `src` must be a safe URL like any other, for now: any site can be framed with it,
  so even a safe URL can show e.g. a fake login page. Embed will decide which sites it frames.
- **`meta`** — `http-equiv` is blocked (a refresh redirects the page).
- **SVG `attributeName`** — an animation can't target `href`, `xlink:href` or an event handler (`on*`): the rules judge
  each attribute alone and never see the value the animation sets.

Everything else is allowed on purpose, because the closed allowlists are in DOMAttrs: a component's shape only lets
its own attributes through.

## `configureSanitizer`

`ConfigureSanitizer/ConfigureSanitizer.ts`, exported from `@rangex/editor`. It wraps the engine's `configureSanitizer`
and always appends the `basePolicy` after the given policies:

```ts
configureSanitizer(...sanitizerPolicies); // → engine: configureSanitizer(...sanitizerPolicies, basePolicy)
```

The engine checks the policies in order and the first one that has a rule for an attribute decides, so the consumer's
policies override the `basePolicy`'s rules (e.g. to allow `video.poster` only from one trusted host). Calling it again replaces
every previous policy.

`ensureSanitizerConfigured()` applies the `basePolicy` alone if `configureSanitizer` hasn't been called yet, so the
Sanitizer never runs without rules. It's called before anything that sets attributes or validates them:

- `createCore` (`src/RangeXEditor/CreateCore/`) — every editor instance.
- `createSnapshotView` (`src/Snapshot/CreateSnapshotView/`) — the editor's wrapper around the engine's, also used by
  `createHTMLView`.
- `validateSnapshot` (`src/Snapshot/ValidateSnapshot/`).

### Consumer contract

- Use `configureSanitizer` from `@rangex/editor`, never the engine's: the engine's leaves out the `basePolicy`, and
  `ensureSanitizerConfigured` doesn't know it was called, so the next editor, view or validation replaces those
  policies with the `basePolicy` alone.
- Call it before creating an editor or a view, or validating a snapshot. The policies apply to every one of them.
- Overriding a component's `attrValidators` can't get around the Sanitizer: every validator runs `canSetAttribute`
  first (see [DOMAttrs](DOMAttrs.md#validators)). Only a `SanitizerPolicy` can allow what the `basePolicy` blocks.
