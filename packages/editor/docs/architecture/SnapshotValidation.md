# Snapshot Validation

`validateSnapshot`: validating a `StoredSnapshot` by the engine's rules and the editor's, and resolving the components'
attributes. What the engine's own validation checks (and what it leaves to the editor) is in the engine's handbook
(`09-Snapshots.md`, "SnapshotValidation" and "Your own checks").

Paths are relative to `src/Snapshot/ValidateSnapshot/` unless noted otherwise.

## What it does

```ts
const result = validateSnapshot({
	storedSnapshot,
	limits,
	components: { link: { attrValidators }, mention: {} },
});

if (result.isValid) {
	save(result.storedSnapshot); // the resolved copy, not the given snapshot
} else {
	console.warn(result.reason, result.failedSnapshot);
}
```

1. **Sanitizer** — `ensureSanitizerConfigured()` (see [Sanitizer](Sanitizer.md)).
2. **Engine** — `validateStoredSnapshot` checks the structure, the snapshot limits and the Sanitizer rules. If it fails,
   that failure is returned as it is.
3. **Draft** — the snapshot is turned into a Draft (`snapshotManager.createDraftFromSnapshot`, a deep copy: the given
   snapshot is never changed).
4. **Storages** — `resolveNodeStorages` sets the `customStorage` of every node except the components and the
   RootEditable to `null`: the editor never stores anything on them, and nothing reads it, so it's dropped instead of
   making the snapshot invalid.
5. **Components** — `createComponentValidators` creates a validator for each key of `components`, and
   `validateComponents` runs the one of each component's `name`, nested components included. It fails on the first one
   that doesn't pass. A component that isn't in `components` is invalid, so its keys are the allowlist. Each validator
   matches its component's `customStorage` against the Storage module's strict pattern (see
   [SnapshotMigrations](SnapshotMigrations.md#the-storage-module)).
6. **Result** — the Draft, with every resolved storage and every component's resolved attributes, turned back into a
   snapshot.

The result has the same shape as the engine's `migrateStoredSnapshot`:

- `{ isValid: true, storedSnapshot }` (`ValidateSnapshotSucceeded`) — the copy to save or restore.
- `{ isValid: false, sourceSnapshot, failedSnapshot, reason }` (`ValidateSnapshotFailed`) — the nodes belong to the
  Draft, not to the given snapshot.

## Component validators

A `ComponentValidator` is `{ name, validate }`. `validate({ componentDraft })` returns a failure or `null`, and writes
the attributes it resolved into the Draft. Each component has a factory, e.g. `createLinkValidator`, which takes the
component's key in `SnapshotComponents`: the same `attrValidators` as the component's settings (see
[DOMAttrs](DOMAttrs.md#consumer-contract-share-attrvalidators)). The factories are internal.

A validator walks down from the component, node by node, as the engine's validation does: each node's own state
first, then its children.

- **State** — every prop of the node that must have one value is matched with `matchJSON` against the value the
  component creates (`validateInlineComponentState` for an InlineComponent; `matchJSON` directly for the other nodes).
  A mismatch is a failure: the editor's structure isn't repaired.
- **Structure** — the children must be exactly the ones the component renders (e.g. a Link's only child is an `a`
  `HTMLLayout`, whose only child is a `NestedEditable`).
- **Attributes** — every element with a shape is resolved with `resolveElementAttrs`, by the component's shape and
  validators (see [DOMAttrs](DOMAttrs.md#the-two-paths)). An invalid result is a failure; a valid one replaces the
  node's `domAttrs` in the Draft. A layout unit without a shape (e.g. an Image's `figure`) is resolved by an empty
  shape, so every attribute it has is dropped. A `NestedEditable` matches its `domAttrs` as part of its state (`{}`).
- **Content** — a `NestedEditable`'s content is left to the engine's validation, which already checked it by the
  `NestedEditable`'s settings (the validator checks those settings themselves).

So a snapshot that breaks one of the editor's attribute rules comes back repaired (e.g. `href: "//evil.com"` →
`href: "#"`, an unknown attribute dropped), while one that breaks the structure, that the Sanitizer refuses, or whose
rule has nothing to fall back to (e.g. an empty `img` `src`), is invalid.

The shared steps are helpers, so a component's validator only describes its own structure:

- `validateInlineComponentState` / `validateBlockComponentState` (in `ValidateInlineComponents/_Utilities/` and
  `ValidateBlockComponents/_Utilities/`) — the component's own state.
- `validateBlockComponentLine` (in `ValidateBlockComponents/_Utilities/`) — a BlockComponent's line and its two text
  holders. The line's `domAttrs` are resolved by the component's own `line` shape (an empty one if it has none); the
  text holders must have no `customStorage`, and their attributes are dropped. A failure names the
  node from the line, e.g. `block-component-line > block-component-text-holder[2]`.
- `validateHTMLLayoutState`, `validateNestedEditableState` and `resolveDraftDOMAttrs` (in `_Utilities/`) — the nodes
  below it.

`ValidateLink` and `ValidateImage` are the two references: an
InlineComponent with one `NestedEditable`, and a BlockComponent with a fixed layout (an Image's `figure` holds exactly
one `img` and at most one `figcaption`, above or below it). The media components (Image, Video, Audio, Embed) are all
built that way, so they share `validateMediaComponent` (in `ValidateBlockComponents/_Utilities/`) and only pass their
name, storage pattern, media element (`img`, `video`, `audio`, `iframe`) and shapes. `ValidateMention` has no attributes; its `customStorage` is matched by `mentionStoragePattern` (see
[SnapshotMigrations](SnapshotMigrations.md)), so an invalid `userId` makes it invalid.

A failure's `reason` names the node by its path from the component, e.g.
`inline-component<link> > html-layout(a)[0]: invalid value localName: "span".`
(`formatNodePath`, `describeJSONMismatch` and `describeElementAttrsMismatch` in `_Utilities/`).

## Running without a DOM

The validation runs wherever snapshots are saved, e.g. on a server. Everything it imports must be DOM-free at import
time: `#dom-attrs` (see [DOMAttrs](DOMAttrs.md#rules)), `#constants` (see [Constants](Constants.md#rules)),
`#storage`, `#sanitizer`, `#utilities` and `@rangex/core`. Never `#engine-links`, whose modules need a DOM.

`@rangex/editor/snapshot` is the entry to import it from on a server, with `migrateStoredSnapshot` and
`configureSanitizer`. The other public entries export modules that need a DOM.

## Consumer contract

- On the server, run `migrateStoredSnapshot` first (it upgrades old versions and runs the engine's validation), then
  `validateSnapshot` on its result. `migrateStoredSnapshot` alone only checks the engine's rules: a snapshot can pass it
  and still break every rule of the editor.
- Save `result.storedSnapshot`, not the snapshot you passed in: it's the one with the resolved attributes.
- Give `components` a key for every component the editor is built with; any other component makes the snapshot invalid.
- Pass each component the same `attrValidators` as the component's settings.
