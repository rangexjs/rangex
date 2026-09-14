# CLAUDE.md — Adapters/

## What an Adapter is

Owns one feature's real state, exposed through two ports:

- **`configPort`** — internal, used only by this package's `Features/ConfigureXxx/`
  wiring. Registers callbacks for UI→Engine intent, receives Engine→state pushes via
  `updateState(params)`.
- **`publicPort`** — the only surface anything outside this package sees. Read-only
  state, `onXxxUpdate` subscriptions, and command methods.

Neither port exposes the other's members; nothing outside the Adapter sees `internals`
directly.

## Adapter construction

Every Adapter is a plain factory returning `{ configPort, publicPort }`, built once at
construction and returned as-is (not getters recomputed on access). `internals` is
grouped by comment: `// States` for anything that flows through `updateState` and has
an `onXxxUpdate` listener; anything else (providers, values fixed at construction) gets
its own comment and is exempt from `*Update`.

```ts
export const createXxxAdapter = (
	...params: CreateXxxAdapterParams
): CreateXxxAdapterResult => {
	const [settingsOrDestructured, optionsOrDestructured] = params;
	// or, when unused: const [_settings, _options] = params;

	const internals: XxxInternals = {
		// States
		canInsert: false,
		// Providers
		xxxProvider: null,
	};

	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> = new Set();

	const updateState = (params: UpdateStateParams) => {
		/* mutate internals, notify listeners */
	};

	const configPort: XxxConfigPort = extendObjectProperties(
		{}, // or a composed SharedPort's .configPort — see Composition below
		{ /* own ConfigPort members */ } satisfies XxxConfigPortProps,
	);

	const publicPort: XxxPublicPort = extendObjectProperties(
		{}, // or a composed SharedPort's .publicPort
		{ /* own PublicPort members */ } satisfies XxxPublicPortProps,
	);

	return { configPort, publicPort };
};
```

## Member shapes

- **State** — Engine pushes via `configPort.updateState(params)`; Adapter stores it in
  `internals` under `// States` and notifies listeners. `publicPort` always gets
  `readonly xxx` + `onXxxUpdate`. `configPort` gets the same listener too, only if
  something inside this package actually needs to react — same underlying `Set`,
  exposed on whichever port(s) need it.
- **Command** — a `publicPort` method (`insert()`, `changeLanguage()`) that notifies a
  `configPort` listener and returns nothing; the Engine acts async and, if state
  changed, pushes it back through the State path. The `configPort` listener name
  mirrors the command: bare when the verb already reads as one (`insert` → `onInsert`,
  `wrap` → `onWrap`), `onChangeXxx` when the command is `changeXxx`-shaped. A
  toggle-shaped command forwards the current state, not a flipped value — the Adapter
  doesn't decide what "toggled" resolves to. An Adapter with many commands
  (`FormattingAdapter`) may funnel them through one listener (`onFormattingChange`)
  instead of one per field, when a per-field listener count would be unwieldy.
- **Provider** — for a capability only one side can supply (DOM/`editorAPI` access only
  `EngineLinks` has, or a render capability only the outside consumer has): the
  supplying side gets `registerXxx(provider): void` (single slot, no `Set`, no
  unsubscribe — shares the Adapter's lifetime), the consuming side pulls through it.
  Name the pull `getXxx()` only if it throws on missing registration (a real invariant,
  not a soft path); if the pull can legitimately happen before registration, don't
  throw — treat "unregistered" as transient and have `registerXxx` backfill.

## Naming rules

- **Callback type mirrors its method name exactly**, `Update` included:
  `onCanInsertUpdate` → `OnCanInsertUpdateCallbackFn`.
- **Prefix stripping** — non-port types in an Adapter's own file drop the feature name
  (`OnInsertCallbackFn`, not `OnAccordionItemInsertCallbackFn`); only `XxxState`,
  `XxxInternals`, `XxxConfigPort(Props)`, `XxxPublicPort(Props)`, `XxxAdapter`,
  `XxxSettings` keep it. Exception: keep the prefix where the bare name is ambiguous or
  stutters (`CodeBlockLanguage`, `TemplateVariableKind`).

## `-types.ts` order

1. Value/union types unique to the Adapter (`CodeBlockLanguage`, `CodeBlockTheme`).
2. `XxxState`.
3. `OnXxxUpdateCallbackFn` types (state listeners), one per `XxxState` field.
4. Command param/callback types (`OnInsertCallbackFn`, `OnChangeLanguageCallbackFn`, ...).
5. `XxxProviderFn` types.
6. `UpdateStateParams extends XxxState {}`.
7. `XxxConfigPortProps` + `XxxConfigPort`.
8. Param types only `XxxPublicPort` needs (`InsertParams`, `WrapParams`).
9. `XxxPublicPortProps` + `XxxPublicPort`.
10. `XxxInternals`.
11. `XxxAdapter`.
12. `XxxSettings`.
13. `CreateXxxAdapterParams`.
14. `CreateXxxAdapterResult`.

`CodeBlockAdapter-types.ts` is the reference layout.

## Composition

`extendObjectProperties(obj, props1, props2, ...)` (`#utilities`) merges each source
object's own property descriptors onto `obj` and returns it typed as their
intersection. **Always call it, even with nothing to compose** — an Adapter with no
`SharedPorts` needs still builds its ports as
`extendObjectProperties({}, { ... } satisfies XxxConfigPortProps)` rather than a bare
object literal, so no Adapter's construction path reads as a special case. `{}` is safe
here: a fresh literal on every call, never shared/mutated across instances. It throws on
a duplicate property name across sources.

Behavior shared across Adapters (`Remove`, `Unwrap`, `Caption`, `BlockAlign`,
`CurrentComponent`, `QuickActions`, `SelectionMenu`, ...) lives in
`_Utilities/SharedPorts/Xxx/` as its own `createXxxPort()` factory — see SharedPorts
below for how one is composed in and named.

## SharedPorts

Each `_Utilities/SharedPorts/Xxx/` is its own `createXxxPort()` factory returning
`{ configPort, publicPort }`, the same shape as an Adapter. Composed into an Adapter's
ports one of two ways:

- **Flat-merge** — `extendObjectProperties(xxxPort.configPort, ..., { own props })`;
  the port's members land directly on the Adapter's port. For a singleton capability an
  Adapter can only ever have one of (`Remove`, `Unwrap`, `CommitSnapshot`, `Duplicate`,
  `InsertRootLine`, `BlockAlign`, `Caption`, `SwapToEmptyMedia`) — no collision risk, by
  construction. `BlockAlignPort` is the reference.
- **Nest** — `{ xxx: xxxPort.configPort, ...own props }`, reached as `adapterPort.xxx`.
  For a port that's one instance of a reusable widget/concept that could need more than
  one differently-named copy on the same Adapter — the smell to watch for is member
  names needing a baked-in disambiguating prefix to avoid colliding once merged flat
  (`caretMenuOpen`/`quickActionsOpen`/`selectionMenuOpen` were the same concept three
  times over before nesting). `SelectionMenuPort` and `QuickActionsPort` are the
  reference.

Naming inside a SharedPort follows the same State/Command/Provider rules as an Adapter
(Member shapes above), plus two cases specific to SharedPorts:

- **Update method** — if the port holds real pushed state, expose its internal
  `updateState` directly as `update<PortName>(params: UpdateStateParams)` on
  `configPort` (`updateBlockAlign({ align })`), not a per-field positional setter.
  `UpdateStateParams` stays flat — the state's own fields directly, never wrapped in a
  key that repeats the port's name.
- **Notify pair (no backing state)** — a parameterless "something happened" pair with
  no matching `readonly` field (`notifyToggle()` / `onToggle`): the trigger takes a
  `notify` prefix, not `emit`; the listener stays bare, no `Update` suffix — nothing is
  being pushed, the listener re-reads the derived value itself. Goes under
  `// CommandListeners`, not `// StateListeners`, even though nothing UI-triggered it.

Once nested, interior members drop the port-name prefix — the key already gives that
context: `selectionMenu.isOpen`, not `selectionMenu.selectionMenuOpen`; `open()`/
`close()`, not `openSelectionMenu()`/`closeSelectionMenu()`. Rename any field that would
otherwise collide with the port's own composed key (`SelectionMenuPort`'s DOM-element
field became `element`, since the composed key is already `selectionMenu`).

## Wiring a new Adapter in

1. Build it per everything above.
2. Add its id to `Adapters/_Utilities/Utilities-types.ts`'s `Adapter` union and
   `AdapterPublicPorts` map (the `RangeXEditor` type is generated off this map's keys —
   skipping this means the feature is unreachable from `createEditor`, even fully
   built).
3. Nothing to touch in `package.json` — `#adapters/*` is a single wildcard
   (`"./src/Adapters/*Adapter/index.ts"`) that already resolves any new `XxxAdapter`
   folder automatically.
4. If it needs `Features` wiring (`Features/ConfigureXxx/`) and an
   `AdapterFactory` (`RangeXEditor/AdapterFactories/Xxx/`), build those too — an Adapter
   alone isn't reachable from `createEditor`'s `adapters` array without a matching
   `AdapterFactory`. See the Progress section below for what's built and what isn't.
5. If `@rangex/solid` needs to wrap it reactively, add a matching
   `packages/solid/src/ReactivePorts/Xxx/` — every `readonly xxx` + `onXxxUpdate` pair
   becomes a `createSignal`; a `readonly xxx` with no `onXxxUpdate` counterpart (static,
   configured once) passes through as a plain value; commands pass through unchanged.

---

## Progress

`@rangex/editor` is a fresh package being built as part of a larger split of the old
`packages/rich-text-editor` monolith into a one-way chain:

```
@rangex/editor -> @rangex/solid -> @rangex/rich-text-editor
```

`@rangex/editor` is the only package that talks to the closed-source engine
(`rich-text-area`) directly. It is framework-agnostic — no Solid, no UI, no
`components` field anywhere; `@rangex/solid` consumes what this package exposes and
wraps `publicPort`s into reactive signals; `@rangex/rich-text-editor-next` (the
zero-config package under construction, not yet the published `@rangex/rich-text-editor`
name) builds the actual UI on top of that.

`packages/rich-text-editor` (the old monolith) is untouched and stays the reference
implementation until this chain fully replaces it — do not port its `Ports/`-tier
patterns wholesale, several of them (`uiPort`/`editorPort` naming, class-based Adapters,
Solid-coupled overlay mounting) were deliberately dropped or renamed here. Where this
file and that package disagree, this file wins for anything under `Adapters/`.
