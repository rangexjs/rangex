# AGENTS.md

Guidance for AI coding agents working in `@rangex/solid`. Repo-wide rules and commands are in the root `AGENTS.md`.

## What this package is

SolidJS bindings for `@rangex/editor`. It extends the editor package, it does not replace it: consumers use both. Actions (insert, toggle, change…) are still called on the editor's public ports; this package only turns their **state** into Solid accessors.

It contains no UI components — those live in `@rangex/rich-text-editor`.

## Reactive ports (`src/ReactivePorts/`)

One folder per editor extension, named after it (`Link/`, `Audio/`, …). Each wraps that extension's `<Name>PublicPort` from `@rangex/editor` into a `Reactive<Name>Port` of Solid accessors. The factory has the same name as the extension (`Link`, `Audio`, …), which is also the name of the editor package's adapter factory — import from the package that matches what you need.

Every port follows the same shape:

```ts
export const Link = <T extends LinkPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveLinkPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveLinkPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));

	const port: ReactiveLinkPort = { canInsert };

	return port as PreserveUndefined<T, ReactiveLinkPort>;
};
```

- **Undefined passes through.** An extension that isn't enabled has an `undefined` public port; the factory returns `undefined` and `PreserveUndefined` keeps that in the type.
- **Each state field** is a signal seeded from the public port's getter and kept in sync by its `on<Field>Update` listener. The listener's return value is the unsubscribe function, passed to `onCleanup`.
- **Call factories inside a Solid owner** (a component), since they register `onCleanup`.
- **State only.** Expose only fields the public port can report updates for. Ports with no state to mirror are not wrapped.
- The `Reactive<Name>Port` interface lives in `<Name>-types.ts` next to the factory.

Exceptions to the one-folder-per-extension rule:
- `Formatting/` has one factory per format (`Bold`, `FontSize`, …) instead of a single port. Each reads its field from `FormattingPublicPort`; shared types are in `Formatting/_Utilities`, with `FromFormattingToReactivePort` in place of `PreserveUndefined`.
- `ReactivePorts/_Utilities/SharedPorts/CaretMenu` wraps the caret-menu port that several extensions share; the CommandMenu, Emoji, Mention and TemplateVariable ports call it internally. It takes a defined port, so there is no `undefined` handling.

## Shared utilities (`src/_Utilities/`)

- `FloatingPortal` — renders children into an editor-provided mount element and applies `class` to that element.
- `PreserveUndefined<T, R>` — type helper for the pass-through above.

## Consuming ports

Consumers store a port in a `$`-prefixed variable (`const $link = Link(link)`) and call accessors inline (`$link.canInsert()`), or pass `$link.canInsert` where a prop expects an accessor. Don't destructure a reactive port into local aliases — keeping `$link.` at the call site shows where each accessor comes from.

## Checks

No tests exist in this package. Verify with `npm run lint` from the repo root, and `npm run build` in this package when changing exports or types.
