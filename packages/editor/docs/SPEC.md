# @rangex/editor — Spec

Reference documentation for this package's architecture. Read the relevant file below before working on a task that
touches it.

| File | Covers |
|---|---|
| [spec/RangeXEditor.md](spec/RangeXEditor.md) | `createEditor`, the `RangeXEditor` instance, adapter registration |
| [spec/Adapters.md](spec/Adapters.md) | Adapter architecture — internals, configPort, publicPort, shared ports |
| [spec/EngineLinks.md](spec/EngineLinks.md) | The layer bridging adapters to the raw engine (`rich-text-area`) |
| [spec/Features.md](spec/Features.md) | Feature wiring inside adapters — `configure*`/`handle*` conventions |
| [spec/Snapshot.md](spec/Snapshot.md) | `StoredSnapshot` -> `SnapshotView` -> HTML output pipeline |
| [spec/Styles.md](spec/Styles.md) | Engine and host style text, `EditorStyles`/`ViewStyles` |
