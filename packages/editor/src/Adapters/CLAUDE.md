# CLAUDE.md — Adapters/

## Where this fits

`@rangex/editor` is a fresh package being built as part of a larger split of the old
`packages/rich-text-editor` monolith into a one-way chain:

```
@rangex/editor -> @rangex/solid -> @rangex/rich-text-editor
```

`@rangex/editor` is the only package that talks to the closed-source engine
(`rich-text-area`) directly. It is **framework-agnostic** — no Solid, no UI, no
`components` field anywhere. `@rangex/solid` (not started yet) is where framework
rendering lives; it consumes what this package exposes and portals its own components
into the raw DOM handles (`floatingEl`) an Adapter hands back.

`packages/rich-text-editor` is untouched and stays the reference implementation until
this package's chain fully replaces it — do not port its `Ports/`-tier patterns
wholesale, several of them (`uiPort`/`editorPort` naming, class-based Adapters,
Solid-coupled overlay mounting) were deliberately dropped or renamed here. Where this
file and that package disagree, this file wins for anything under `Adapters/`.

## What an Adapter is

Same job as the old package's Adapter: holds one feature's real state, exposes it
through two narrowed, non-overlapping views —

- **`configPort`** — consumed only by `EngineLinks/Features/ConfigureXxx/` wiring
  (internal to this package). Registers callbacks for UI→Engine intent (`onInsert`,
  `onLanguage`, ...) and pushes Engine→state via `updateState(params)`.
- **`publicPort`** — the only public surface. Read-only getters, `onXxxUpdate`
  registrations for Engine→UI state push, and plain command methods (`insert()`,
  `changeLanguage(language)`, ...) for UI→Engine intent.

Neither port ever exposes the other's members, and nothing outside this package ever
sees the raw internals.

## Adapters are factory functions, not classes

**This is the one thing that changed mid-migration and matters most going forward.**
Every Adapter used to be an ES class (`class XxxAdapter { get configPort() {...} }`),
mirroring the old package. That's gone — **every Adapter is now a plain factory
function**:

```ts
export const createXxxAdapter = (
	...params: CreateXxxAdapterParams
): CreateXxxAdapterResult => {
	const [settingsOrDestructured, optionsOrDestructured] = params;
	// or, when unused: const [_settings, _options] = params;

	const internals: XxxInternals = { /* real state, was #private fields */ };

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	// ...

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> = new Set();
	// ...

	const updateState = (params: UpdateStateParams) => { /* mutate internals, notify PublicPort listeners */ };

	const configPort: XxxConfigPort = extendObjectProperties(
		{}, // or a composed SharedPort's .configPort — see below
		{ /* own ConfigPort members */ } satisfies XxxConfigPortProps,
	);

	const publicPort: XxxPublicPort = extendObjectProperties(
		{}, // or a composed SharedPort's .publicPort
		{ /* own PublicPort members */ } satisfies XxxPublicPortProps,
	);

	return { configPort, publicPort };
};
```

**Why**: the old class model used TypeScript `extends` to *type* an Adapter's port as
a composition of shared fragments (`AccordionItemConfigPort extends RemovePort,
UnwrapPort`), but every class still had to hand-write the actual `onRemove`/`remove()`
*implementation* itself — JS classes can't share real behavior across siblings without
single-inheritance gymnastics. Two different Adapters needing the same Remove/Unwrap/
Caption/BlockAlign behavior meant copy-pasting the same `Set` + listener-management
code into each one. Plain objects don't have that limitation: `extendObjectProperties`
(`#utilities`) merges several source objects' own property descriptors onto one target
and returns it typed as their intersection — real composition, not just shared typing.

**Always call `extendObjectProperties`, even with nothing to compose.** An Adapter with
no `SharedPorts` needs (`EmptyMedia`, `TemplateVariable`, `Formatting`) still builds its
ports as `extendObjectProperties({}, { ... } satisfies XxxConfigPortProps)` rather than
a bare object literal — keeps every Adapter's construction path identical, so nothing
reads as a special case. `{}` is safe here: it's a fresh literal on every call, never
shared/mutated across instances.

`extendObjectProperties` throws if two merged sources (or a source and the base object)
declare the same property name — a real safety net, not just documentation. If you hit
that error while composing a `SharedPort`, you picked a name that's already taken by
the fragment you're composing with; rename your own member, don't fight the guard.

## The `...Props` split

Every Adapter's `-types.ts` defines `XxxConfigPortProps`/`XxxPublicPortProps` (the
Adapter's *own* members) plus `XxxConfigPort extends XxxConfigPortProps, ...SharedPorts
{}` / `XxxPublicPort extends XxxPublicPortProps, ...SharedPorts {}` (the full merged
shape consumers actually see). The object literal passed to `extendObjectProperties`
gets typed with `satisfies XxxConfigPortProps` (not the full `XxxConfigPort`) — that's
what makes the split necessary, not optional: `satisfies` needs the *own-members-only*
shape to validate against, since the `SharedPorts` members come from a different object
entirely (the composed base, not the literal). Present even when there's nothing
composed in (see `TemplateVariableConfigPort extends TemplateVariableConfigPortProps
{}`) — for consistency, not necessity, in that case.

## `SharedPorts/`

`Adapters/_Utilities/SharedPorts/` — behavior genuinely shared across features, each
its own `createXxxPort()` factory returning `{ configPort, publicPort }`, composed into
an Adapter via `extendObjectProperties`:

- `RemovePort` / `UnwrapPort` — bare `onRemove`/`remove()`, `onUnwrap`/`unwrap()`, no
  internal state at all (pure event, nothing to track).
- `CaptionPort` / `BlockAlignPort` — carry real state (`caption`, `align`), same
  `internals` + `Set`-per-slice shape as a full Adapter, just narrower.

Adding a new one that a future Adapter needs: give it its own folder
(`SharedPorts/XxxPort/XxxPort.ts` + `-types.ts` + `index.ts`), and **curate its own
`index.ts`** rather than blind `export *` from both files — it should export
`createXxxPort` and everything the composed surface actually needs, but never
`UpdateStateParams`, `XxxInternals`, or `CreateXxxPortResult`. Those are internal-only,
and since every port's own `-types.ts` names its internal update-params type
`UpdateStateParams` (unprefixed, see below), blind re-export collides two ports'
identically-named internal types the moment both get pulled through
`SharedPorts/index.ts`'s `export *`. Already happened once (`BlockAlignPort` vs
`CaptionPort`) — don't reintroduce it.

## Naming rules

**Port-identity rule** — the single most load-bearing convention here: a `configPort`
member is *always* a bare verb or field name (`onInsert`, `onLanguage`, `onRemove`); a
`publicPort` member that pushes Engine state to a consumer *always* ends in `Update`
(`onCanInsertUpdate`, `onLanguageUpdate`). Never the reverse, never a bare `onUpdate`
(collides with the rule itself). This is how you tell which port a member belongs to
by name alone, with zero need to check which interface it's declared on.

**Callback type names mirror their method name exactly**, `Update` included when the
method has it: `onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn)`, not
`OnCanInsertCallbackFn`. This also isn't optional stylistic preference — a field that
exists on both directions (e.g. `language`: `onLanguage` on configPort *and*
`onLanguageUpdate` on publicPort) would produce two same-named exported types
(`OnLanguageCallbackFn` twice) if the callback type dropped the `Update` — the suffix
is what keeps the two directions' type names distinct in the same file.

**Prefix stripping** — every non-port type in an Adapter's own file drops the feature
name prefix (`OnInsertCallbackFn`, not `OnAccordionItemInsertCallbackFn`); only
`XxxState`, `XxxInternals`, `XxxConfigPort(Props)`, `XxxPublicPort(Props)`, `XxxAdapter`,
and `XxxSettings` keep it. Exception: a bare name that's genuinely ambiguous or reads as a
stutter in context keeps the prefix anyway — `CodeBlockLanguage`/`CodeBlockTheme` and
`TemplateVariableKind` are the two precedents (`kind: Kind` reads worse than
`kind: TemplateVariableKind`). Ask if a new case seems borderline rather than guessing
either direction.

**Ordering** — `insert`/`remove`/`wrap`/`unwrap`, wherever an Adapter has some subset of
these, always appear in that order (not e.g. `insert, wrap, remove, unwrap`) — on
private field declarations, on `configPort`'s registration methods, and on
`publicPort`'s command methods alike.

**Field grouping** — private `Set`/state declarations are grouped under `// ConfigPort`
and `// PublicPort` comments, ConfigPort group first, matching the two interfaces'
declaration order in `-types.ts`. Every listener field name mirrors its registration
method 1:1 with `Listeners` appended (`onCanInsertUpdate` → `onCanInsertUpdateListeners`
— not `canInsertListeners`, that drops the `on`/`Update` and breaks grep-ability).

## `-types.ts` file order

Settled empirically across all six adapters, follow it for new ones:

1. Value/union types the Adapter's state is made of (only if not already generic
   enough to live in `_Utilities`).
2. `XxxState` + `UpdateStateParams extends XxxState {}`.
3. Any ConfigPort-only param/value types, then `XxxConfigPortProps` +
   `XxxConfigPort extends XxxConfigPortProps, ...SharedPorts {}`.
4. `OnXxxUpdateCallbackFn` types (PublicPort direction), then `XxxPublicPortProps` +
   `XxxPublicPort extends XxxPublicPortProps, ...SharedPorts {}`.
5. `XxxInternals`.
6. `XxxAdapter { configPort; publicPort; }`.
7. `XxxSettings` (yes, *after* `XxxAdapter`, not before — this moved during the
   migration; don't put it back at the top).
8. `CreateXxxAdapterParams extends CreateAdapterParams<Settings> {}`.
9. `CreateXxxAdapterResult extends XxxAdapter {}`.

## Wiring a new Adapter in

1. Build it per everything above.
2. Add its id to `Adapters/_Utilities/Utilities-types.ts`'s `Adapter` union and
   `AdapterPublicPorts` map (the `RangeXEditor` type is generated off this map's keys —
   skipping this means the feature is unreachable from `createEditor`, even fully
   built).
3. Nothing to touch in `package.json` — `#adapters/*` is a single wildcard
   (`"./src/Adapters/*Adapter/index.ts"`) that already resolves any new `XxxAdapter`
   folder automatically.
4. If it needs `EngineLinks` wiring, that's a separate, still-mostly-unbuilt tier
   (`EngineLinks/Features/ConfigureXxx/`) — most of the six done Adapters have it
   (`configureAccordionItem`, `configureEmptyMedia`, `configureFormatting`,
   `configureImage`); `CodeBlock` and `TemplateVariable` don't yet.

## Status

Done (all six on the current pattern, no class-based holdouts left):
`AccordionItem`, `CodeBlock`, `EmptyMedia`, `Formatting`, `Image`, `TemplateVariable`.

Not started — still only exist in `packages/rich-text-editor/src/Adapters/` as classes,
each will need the full conversion above, not a port of the old shape:
`Audio`, `BlockQuote`, `CommandMenu`, `Embed`, `Emoji`, `FindReplace`, `LineHandler`,
`Link`, `List`, `Markdown`, `Mention`, `ReadOnly`, `Separator`, `Shortcuts`, `Symbols`,
`Table`, `TodoList`, `UndoRedo`, `Video`.
