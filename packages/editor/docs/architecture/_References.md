# @rangex/editor — Architecture

Reference documentation for this package's architecture. Read the relevant file below before working on a task that
touches it.

| File | Covers |
|---|---|
| [RangeXEditor.md](RangeXEditor.md) | `createEditor`, the `RangeXEditor` instance, adapter registration |
| [Adapters.md](Adapters.md) | Adapter architecture — internals, configPort, publicPort, shared ports, AdapterBus, wiring a new Adapter |
| [Constants.md](Constants.md) | `#constants` — component, attribute and part names shared across the package, DOM-free |
| [EngineLinks.md](EngineLinks.md) | The layer bridging adapters to the raw engine (`@rangex/core`) |
| [Features.md](Features.md) | Feature wiring inside adapters — `configure*`/`handle*` conventions |
| [DOMAttrs.md](DOMAttrs.md) | Component attributes — shapes, validators, the live vs. snapshot path, `DOMAttrsPort`/`handleDOMAttrs`, adding a component |
| [Sanitizer.md](Sanitizer.md) | XSS protection — `basePolicy`, `configureSanitizer`, where it's applied |
| [Snapshot.md](Snapshot.md) | `StoredSnapshot` -> `SnapshotView` -> HTML output pipeline |
| [SnapshotValidation.md](SnapshotValidation.md) | `validateSnapshot` — engine + component validation, resolved attributes, running without a DOM |
| [SnapshotMigrations.md](SnapshotMigrations.md) | Breaking changes to stored snapshots, `customStorage` versioning, `*Storage` modules |
| [StructuredStyle.md](StructuredStyle.md) | `#structured-style` — the structured styles' value types, creators and guards, DOM-free |
| [Styles.md](Styles.md) | Engine and host style text, `EditorStyles`/`ViewStyles` |
