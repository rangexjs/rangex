# Snapshot Migrations

## The problem

Each component has a specific HTML structure that is serialized and stored in `StoredSnapshot`s in the consumer's database. If the component's code changes in a way that expects a different structure, snapshots saved before the change will no longer be valid. The consumer has no way to detect or migrate those stale records unless they know exactly what changed.

## What counts as a breaking change

A snapshot is frozen at the moment it is saved. When a user reopens a document, the editor reconstructs the DOM from that snapshot — producing whatever structure existed at save time. If the code has since changed to expect a different structure, it will fail against the old DOM.

For example: imagine a component that stores a selected language in a `data-language` attribute on its `<pre>` element. If the structure is later changed so that `data-language` moves to an inner `<code>` element, the code will now look for it there — but any snapshot saved before the change will still have it on `<pre>`. The code reads `null` and the language is lost.

This is why any modification the editor code depends on is a breaking change.

## What to do when a breaking change happens

There are two valid approaches:

**Option 1 — Migrate all records.** Query the database for snapshots that contain the old structure and transform them to the new one. Once the migration runs, all records are up to date and no extra runtime code is needed. This is the simpler option, but can be difficult to manage at scale — with a large number of records, migrations are slow, risky to run, and hard to roll back if something goes wrong.

**Option 2 — Convert on read.** Track a version on the snapshot and bump it with each breaking change. Before passing a snapshot to the editor, the consumer checks the version and runs an upgrade function if needed. Old records are left untouched in the database and upgraded lazily on first load. This avoids a migration run entirely but adds runtime complexity — the consumer is responsible for running the upgrade before every load. The version is stored in the RootEditable's `customStorage`, e.g. `{ id: "root", version: 1, templateVariable: {} }` — this is the most reliable approach since `customStorage` is always serialized as part of the snapshot.

## The *Storage module

Each component has a `*Storage` module in `src/Storage/` that centralizes all `customStorage` concerns in one place.

Every `customStorage` object has one required base field:

- `id` — identifies which component the node belongs to (e.g. `"mention"`, `"code-block"`). Constants for each are defined in `src/Storage/_Constants/`. Used to distinguish nodes when walking a snapshot tree.

### The snapshot's version

Only the `RootStorage` has a `version`: a positive integer that versions the whole snapshot, not one component. It's the `snapshotVersion` constant in `src/Storage/Root/`, referenced by the `RootStorage` type (`version: typeof snapshotVersion`), `createRootStorage` and `rootStoragePattern`. Bumping it is a one-line change.

Bump it on any change the editor makes to what a snapshot contains: a component's structure or `customStorage`, a `ScopedEditable`'s settings (e.g. extending its `allowedComponents`), and so on. The engine's own changes don't count: they're tracked by the `StoredSnapshot`'s top-level `version`, and upgraded by `migrateStoredSnapshot`.

The storage shapes (and every type nested in them, e.g. `CodeBlockTheme`) are `type` aliases, not `interface`s: the engine types `customStorage` as `JSONValue`, and only a type alias is assignable to its `{ [key: string]: JSONValue }` object. For the same reason a field can't be optional (`?:` adds `undefined`, which isn't JSON) — use `null` for "no value".

Each `*Storage` module exports functions for creating, validating, and reading storage. The exact set varies by component, but the common building blocks are:

- `*StoragePattern` / `match*Storage(storage: unknown)` — the storage's strict `JSONPattern` (every field, its type and its broad length limits; any other field doesn't match), and `matchJSON` against it, returning the first mismatch or `null`. What's valid beyond that is the consumer's (see [SnapshotValidation](SnapshotValidation.md#the-consumers-storage-check)). The snapshot validators use the pattern as the component's `customStorage`. Every storage defines its own, even the ones with only an `id`.
- `is*Storage(storage: unknown)` — pure type guard: the value must match the pattern (`match*Storage`). No side effects. Use when iterating nodes to check identity without implying the node should be valid.
- `validate*Storage(storage: unknown)` — calls `is*`, warns via `console.warn` if invalid. Use when the storage is expected to be valid and a failure indicates a bug.
- `create*Storage(params)` — constructs a new storage object.
- `ensure*Storage({ storage, fallbacks? })` — takes a raw `unknown` value (e.g. from a snapshot node's `customStorage` field or an `EditorElementView`). Returns it as-is if valid via `validate*`. If invalid, creates and returns a fresh storage using the provided fallbacks. Use when only the raw value is available, not a live DOM node. Components with no extra fields (e.g. `LinkStorage`) omit `fallbacks`.
- `ensureNode*Storage({ node, fallbacks? })` — reads `$$customStorage` from a live DOM node. Delegates to `ensure*Storage` and writes the result back to the node. Use in live editor contexts (event handlers, highlighters, etc.).

Components with more complex storage needs (e.g. data shared across all nodes of a component, stored on `RootEditable`) will export additional functions alongside these.

The `RootStorage` module is the implementation of Option 2 — `snapshotVersion`, its type guard, and `createRootStorage` are exactly what make version tracking and upgrade detection possible.

## Upgrading old snapshots

A `StoredSnapshot` is a plain JSON object — upgrading it means walking the snapshot tree, finding the nodes that belong to the component, and returning a new transformed copy before passing the snapshot to the editor.

To identify a node as belonging to a specific component, check `customStorage.id` against the component's id constant. To identify the snapshot's version, check the RootEditable's `customStorage.version`.

A snapshot at an old version doesn't match `rootStoragePattern`, so it has to be upgraded before it's loaded: `ensureRootStorage` replaces a storage that doesn't match with a fresh one, which loses what the old one held (e.g. `templateVariable`'s values).

Upgrades should be applied version by version (v1 → v2, then v2 → v3, and so on), so that a snapshot at any old version can be brought up to the current one by chaining the steps in order. Each step should only be responsible for the single version gap it covers.

_Per-component upgrade guidance will be added here as breaking changes occur._