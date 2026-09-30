# @rangex/editor — Architecture

Reference documentation for this package's architecture. Read the relevant file below before working on a task that
touches it.

| File | Covers |
|---|---|
| [RangeXEditor.md](RangeXEditor.md) | `createEditor`, the `RangeXEditor` instance, adapter registration |
| [Adapters.md](Adapters.md) | Adapter architecture — internals, configPort, publicPort, shared ports, AdapterBus, wiring a new Adapter |
| [EngineLinks.md](EngineLinks.md) | The layer bridging adapters to the raw engine (`rich-text-area`) |
| [Features.md](Features.md) | Feature wiring inside adapters — `configure*`/`handle*` conventions |
| [Snapshot.md](Snapshot.md) | `StoredSnapshot` -> `SnapshotView` -> HTML output pipeline |
| [SnapshotMigrations.md](SnapshotMigrations.md) | Breaking changes to stored snapshots, `customStorage` versioning, `*Storage` modules |
| [Styles.md](Styles.md) | Engine and host style text, `EditorStyles`/`ViewStyles` |
