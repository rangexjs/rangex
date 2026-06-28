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

**Option 2 — Convert on read.** Track a version on the component and bump it with each breaking change. Before passing a snapshot to the editor, the consumer checks the version and runs an upgrade function if needed. Old records are left untouched in the database and upgraded lazily on first load. This avoids a migration run entirely but adds runtime complexity — the consumer is responsible for running the upgrade before every load. The version is stored as a property in `customStorage`, e.g. `{ id: "mention", version: 1 }` — this is the most reliable approach since `customStorage` is always serialized as part of the snapshot.

## The *Storage module

Each component has a `*Storage/` folder inside its `Configure*` folder that centralizes all `customStorage` concerns in one place.

Every `customStorage` object has two required base fields:

- `id` — identifies which component the node belongs to (e.g. `"mention"`, `"code-block"`). Constants for each are defined in `src/Constants/CustomStorageIds/`. Used to distinguish nodes when walking a snapshot tree.
- `version` — a positive integer that increments with each breaking change. Always represents the current version the editor expects.

The current version is defined as a named constant (e.g. `const mentionStorageVersion = 1 as const`) and referenced in three places: the storage interface (`version: typeof mentionStorageVersion`), `create*Storage`, and `is*Storage`. Bumping the version is a one-line change and everything cascades.

Each `*Storage` module exports functions for creating, validating, and reading storage. The exact set varies by component, but the common building blocks are:

- `is*Storage(storage: unknown)` — pure type guard. Checks that `id` and `version` both match the current schema. No side effects. Use when iterating nodes to check identity without implying the node should be valid.
- `validate*Storage(storage: unknown)` — calls `is*`, warns via `console.warn` if invalid. Use when the storage is expected to be valid and a failure indicates a bug.
- `create*Storage(params)` — constructs a new storage object at the current version.
- `ensureNode*Storage({ node, fallbacks })` — reads `$$customStorage` from a live DOM node. Returns it as-is if valid. If invalid, self-heals by writing a new storage using the provided fallbacks and returning it.

Components with more complex storage needs (e.g. data shared across all nodes of a component, stored on `RootEditable`) will export additional functions alongside these.

This module is the implementation of Option 2 for each component — the version constant, type guard, and creation function are exactly what make version tracking and upgrade detection possible.

## Upgrading old snapshots

A `StoredSnapshot` is a plain JSON object — upgrading it means walking the snapshot tree, finding the nodes that belong to the component, and returning a new transformed copy before passing the snapshot to the editor.

To identify a node as belonging to a specific component, check `customStorage.id` against the component's id constant. To identify its version, check `customStorage.version`.

Upgrades should be applied version by version (v1 → v2, then v2 → v3, and so on), so that a snapshot at any old version can be brought up to the current one by chaining the steps in order. Each step should only be responsible for the single version gap it covers.

_Per-component upgrade guidance will be added here as breaking changes occur._
