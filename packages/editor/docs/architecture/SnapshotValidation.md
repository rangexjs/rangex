# Snapshot Validation

`validateSnapshot`: validating a `StoredSnapshot` by the engine's rules and the editor's, and resolving the components'
attributes. What the engine's own validation checks (and what it leaves to the editor) is in the engine's handbook
(`09-Snapshots.md`, "SnapshotValidation" and "Your own checks").

Paths are relative to `src/Snapshot/ValidateSnapshot/` unless noted otherwise.

## What it does

```ts
const snapshotSchema: SnapshotSchema = {
	limits,
	root: { types: ["rich-text"] },
	components: { link: { attrValidators }, mention: {} },
};

const result = validateSnapshot({ storedSnapshot, ...snapshotSchema });

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
5. **Root** — `validateRoot` checks the RootEditable itself (see [The root](#the-root)).
6. **Components** — `createComponentValidators` creates a validator for each key of `components`, and
   `validateComponents` runs the one of each component's `name`, nested components included. It fails on the first one
   that doesn't pass. A component that isn't in `components` is invalid, so its keys are the allowlist. Each validator
   matches its component's `customStorage` against the Storage module's strict pattern (see
   [SnapshotMigrations](SnapshotMigrations.md#the-storage-module)).
7. **TemplateVariables** — `resolveTemplateVariableTexts` matches every TemplateVariable's display text to its field's
   value in the Root's storage (see [TemplateVariables](#templatevariables)).
8. **Result** — the Draft, with every resolved storage, text and component's resolved attributes, turned back into a
   snapshot.

The result has the same shape as the engine's `migrateStoredSnapshot`:

- `{ isValid: true, storedSnapshot }` (`ValidateSnapshotSucceeded`) — the copy to save or restore.
- `{ isValid: false, sourceSnapshot, failedSnapshot, reason }` (`ValidateSnapshotFailed`) — the nodes belong to the
  Draft, not to the given snapshot.

## The root

A RootEditable has a type: the kind of document it is (`rootTypes` in `#constants`, only `"rich-text"` so far). The
type is kept in `RootStorage.type`, as the engine's `display` can't tell every kind apart. `rootDefinitions` holds each
type's state (`display`, `editState` and the `allowed*` settings), and it's the one source for both ways a root comes
into being: `createRoot` builds a new one from it, and `validateRoot` matches a stored one against it.

`validateSnapshot`'s `root` says what a snapshot's root must be. It's required, as a snapshot's own `type` proves
nothing: `root.types` lists the accepted ones, so a consumer can load a snapshot without tracking which type it is.
`validateRoot` picks the listed type the storage claims, then matches the state against that type's definition, and
the storage against `rootStoragePattern` with that type. A type that isn't listed, or any other mismatch, makes the
snapshot invalid. The list can't be empty, and its first type is the one `createEditor` uses for a new root.

- **Attributes** — resolved by `rootAttrsShape` and `root.attrValidators`, so anything else on the root is dropped.
- **Storage** — `root.validateStorage` runs on it, as on a component's (see
  [The consumer's storage check](#the-consumers-storage-check)). A fallback can't change its `id`, `version` or `type`.

Its children aren't checked here: the engine validates them by the root's settings, and `validateComponents` handles
the components among them.

## Component validators

A `ComponentValidator` is `{ name, validate }`. `validate({ componentDraft })` returns a failure or `null`, and writes
the attributes it resolved into the Draft. Each component has a factory, e.g. `createLinkValidator`, which takes the
component's key in `SnapshotComponents`: the `attrValidators` the editor uses too (see
[DOMAttrs](DOMAttrs.md#consumer-contract-share-the-snapshotschema)). The factories are internal.

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

### The consumer's storage check

A `*StoragePattern` only checks the structure and broad length limits, and the consumer can't change it. What's valid
beyond that is the consumer's: a component's key in `components` can take a `validateStorage`, which gets the whole
storage, as its fields can be nested or related.

```ts
validateSnapshot({
	storedSnapshot,
	limits,
	root: { types: ["rich-text"] },
	components: {
		mention: {
			validateStorage: ({ storage }) => {
				if (knownUserIds.has(storage.userId)) {
					return null;
				}

				return {
					kind: "fallback",
					reason: "unknown user",
					value: { ...storage, userId: "deleted-user" },
				};
			},
		},
	},
});
```

`resolveDraftStorage` (in `_Utilities/`) runs it right after the component's state check, so it only gets a storage that
matches the pattern. It gets a copy: the storage only changes through a fallback.

- `null` — the storage is valid.
- `{ kind: "reject", reason }` — the snapshot is invalid.
- `{ kind: "fallback", reason, value }` — `value` replaces the storage. It's matched against the pattern again, so a
  fallback can't break the structure (a mismatch makes the snapshot invalid), but it isn't passed to `validateStorage`
  again.

It's synchronous: a check against a database has to load what it needs first (`knownUserIds` above). It only runs in
`validateSnapshot`, which the editor also runs on the snapshot it loads, not on later changes. A check only a server
can do is left out of the schema the editor gets. Only the Mention, the TemplateVariable, the CodeBlock and the root have
one so far.

A failure's `reason` names the node by its path from the component, e.g.
`inline-component<link> > html-layout(a)[0]: invalid value localName: "span".`
(`formatNodePath`, `describeJSONMismatch` and `describeElementAttrsMismatch` in `_Utilities/`).

## CodeBlock

`ValidateCodeBlock` walks the `pre`, `code`, List and ListItems down to each line's number and NestedEditable. A line's
number comes from its position, so it's replaced instead of checked, as a snapshot read without the editor shows it.

The theme's colors are the BlockComponent's `data-bg-*` and `data-fg-*` attributes, which the styles read through `attr()`.
The highlighter sets them, so they aren't placement params. They must be hex colors, the one format that can be checked
without the DOM. Any other value is dropped, and the styles' defaults apply until the next highlight.

A language or theme is `null` or a non-empty name. A snapshot isn't loaded if its storage breaks that, so
`validateCodeBlockPlacement` guards every creation (insert, wrap, turn into, Markdown), and `validateCodeBlockLanguage`
and `validateCodeBlockTheme` guard `changeLanguage` and `changeTheme`. Which names exist is the consumer's call, through
`components.codeBlock.validateStorage`.

## TemplateVariables

The Root's storage is the source of truth for a TemplateVariable's value, and a node only names its field. Three steps
check them, each relying on the one before:

1. `validateRoot` checks the fields' structure and limits, and the consumer's `root.validateStorage` can check or
   replace their values.
2. `ValidateTemplateVariable` checks the node's state, and that its ContentLine holds only FormattableTexts.
   The consumer's `components.templateVariable.validateStorage` gets `{ id, fieldName }`, so it decides which fields are
   allowed: it can reject one, or fall back to another name.
3. `resolveTemplateVariableTexts` compares each node's text with its field's value. A different text is replaced, so a
   snapshot read without the editor (e.g. the HTML view) shows the right value. This never makes a snapshot invalid: a
   node can come from another document through paste, and rejecting it would discard the whole document.

A field with no value leaves its node as it is. A field that isn't declared in `fieldsConfig` stays valid, as removing a
field from the settings must not invalidate saved documents. Both are the consumer's call, through `validateStorage`.

A failed snapshot isn't loaded, so the editor must never save what `rootStoragePattern` rejects. `validateTemplateVariableField`
guards every write to the Root's storage, and `validateTemplateVariablePlacement` every insertion.

## In the editor

`createEditor` takes the same `SnapshotSchema` (`snapshotSchema`), so a snapshot can't be loaded without passing it:
`createCore` runs `migrateStoredSnapshot`, then `validateSnapshot`, and loads the resolved copy. Validating on the
server doesn't replace this: it's what guarantees every RootEditable a valid `RootStorage` (`getRootStorage`).

If either step fails, the snapshot isn't loaded: the editor starts from `createRoot` with the first of the schema's `root.types`,
and warns. The given snapshot isn't changed, but saving the editor's content would replace it.

Table has no validator yet: its key in `SnapshotComponents` allows it, without checking it
(`createUncheckedValidator`).

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
- Give `components` a key for every component the editor is built with; any other component makes the snapshot invalid,
  and an Adapter of a component with attributes throws without one.
- Share the `SnapshotSchema` between `createEditor` and `validateSnapshot`.
