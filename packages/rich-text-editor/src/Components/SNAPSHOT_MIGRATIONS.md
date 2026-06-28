# Component Structure Documentation

## The problem

Each component has a specific HTML structure that is serialized and stored in `StoredSnapshot`s in the consumer's database. If the component's code changes in a way that expects a different structure, snapshots saved before the change will no longer be valid. The consumer has no way to detect or migrate those stale records unless they know exactly what changed.

## What counts as a breaking change

A snapshot is frozen at the moment it is saved. When a user reopens a document, the editor reconstructs the DOM from that snapshot — producing whatever structure existed at save time. If the code has since changed to expect a different structure, it will fail against the old DOM.

For example: imagine a component that stores a selected language in a `data-language` attribute on its `<pre>` element. If the structure is later changed so that `data-language` moves to an inner `<code>` element, the code will now look for it there — but any snapshot saved before the change will still have it on `<pre>`. The code reads `null` and the language is lost.

This is why any modification the editor code depends on is a breaking change.

## What to do when a breaking change happens

There are two valid approaches:

**Option 1 — Migrate all records.** Query the database for snapshots that contain the old structure and transform them to the new one. Once the migration runs, all records are up to date and no extra runtime code is needed. This is the simpler option, but can be difficult to manage at scale — with a large number of records, migrations are slow, risky to run, and hard to roll back if something goes wrong.

**Option 2 — Convert on read.** Track a version on the component and bump it with each breaking change. When a snapshot is loaded, check the version and run an upgrade function before the editor processes it. Old records are left untouched in the database and upgraded lazily on first load. This avoids a migration run entirely but adds runtime complexity. The version is stored as a property in `customStorage`, e.g. `{ id: "mention", version: "1" }` — this is the most reliable approach since `customStorage` is always serialized as part of the snapshot.

## Upgrading old snapshots

_This section will be expanded with concrete guidance per component. The general pattern is described below._

A `StoredSnapshot` is a plain JSON object — upgrading it means walking the snapshot tree, finding the nodes that belong to the component, and returning a new transformed copy before passing the snapshot to the editor.

Upgrades should be applied version by version (v1 → v2, then v2 → v3, and so on), so that a snapshot at any old version can be brought up to the current one by chaining the steps in order. Each step should only be responsible for the single version gap it covers.
