# CLAUDE.md — Adapters/

## What an Adapter is

An Adapter owns one feature's real state and exposes it through two narrowed,
non-overlapping views:

- **`configPort`** — consumed only by `Features/ConfigureXxx/` wiring
  (internal to this package, never exposed outside it). Registers callbacks for
  UI→Engine intent (`onInsert`, `onLanguage`, ...) and receives Engine→state pushes via
  `updateState(params)`.
- **`publicPort`** — the only surface anything outside this package ever sees. Read-only
  state, `onXxxUpdate` registrations for Engine→UI state push, and command methods
  (`insert()`, `changeLanguage(language)`, ...) for UI→Engine intent.

Neither port ever exposes the other's members, and nothing outside this package ever
sees the raw internals (`internals`, the `Set`-based listener fields) directly — only
through one of the two ports.

## Adapter construction

Every Adapter is a plain factory function returning `{ configPort, publicPort }`.
`internals` is a plain object holding the real state; `configPort` and `publicPort` are
built once, during construction, and returned as-is — not getters recomputed on every
access:

```ts
export const createXxxAdapter = (
	...params: CreateXxxAdapterParams
): CreateXxxAdapterResult => {
	const [settingsOrDestructured, optionsOrDestructured] = params;
	// or, when unused: const [_settings, _options] = params;

	const internals: XxxInternals = { /* real state */ };

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	// ...

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> = new Set();
	// ...

	const updateState = (params: UpdateStateParams) => { /* mutate internals, notify PublicPort listeners */ };

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

Behavior genuinely shared across Adapters (`Remove`, `Unwrap`, `Caption`, `BlockAlign`)
isn't hand-copied into each one — it's composed in via `extendObjectProperties`
(`#utilities`), which merges several source objects' own property descriptors onto one
target and returns it typed as their intersection. See Composition below.

## Member categories

Every `configPort`/`publicPort` member falls into one of three shapes. Picking the
right one is the actual design decision when adding something new — the naming
conventions below only make sense once you know which of these three you're building.

### 1. Push-based state

The default, and most members are this. The Engine pushes a value through
`configPort.updateState(params)`; the Adapter stores it in `internals` and notifies
`publicPort`'s `onXxxUpdate` listeners; `publicPort` exposes it as a `readonly` getter
for anyone who just wants the current value without subscribing.

The value handed to `updateState` doesn't have to come from the Engine unmodified —
it's just as often **derived purely from the Adapter's own other internals**, recomputed
inside `updateState` (or a helper it calls) rather than received as a raw field. Two
examples already in the codebase: `FormattingAdapter`'s `removeLine`/`removeText`
(`disabled` computed from every other formatting field's current state via
`IsRemoveFormatDisabled/`) and `TemplateVariableAdapter`'s `filteredItems` (computed
from `query` against a static list). The external contract — `readonly xxx` +
`onXxxUpdate` — is identical either way; only the internal *source* of the value
differs. This is the sanctioned way for an Adapter to do more than pass values through:
pure computation over data it already owns, no new external inputs, no new callback
surface.

### 2. Fire-and-forget commands

A `publicPort` method (`toggleBold()`, `changeLanguage(language)`, `insert()`) that
notifies `configPort`'s matching `onXxx` listeners and returns nothing. It doesn't wait
for a result — the Engine acts on the intent asynchronously and, if state actually
changed, pushes the result back through the normal push-based-state path (category 1).
A toggle-shaped command (`toggleBold`, not `setBold(pressed)`) forwards the *current*
`internals.xxx.pressed` value to the listener rather than computing a flipped value
itself — the Adapter doesn't decide what "toggled" resolves to (that can depend on
Engine-side policy like `whenMixed`), it just tells the Engine what the current state
is and lets it resolve the actual result.

### 3. Pull-computed via injected capability

For a value the Adapter cannot compute itself (it requires DOM/`editorAPI` access,
which only `EngineLinks` has) and that would be wasteful to continuously push (expensive
or high-frequency, needed only occasionally, on demand). `CodeBlockAdapter`'s
`getPlainText()` is the only current example.

- `configPort`: `registerXxx(provider: XxxProviderFn): void` — **not** a `Set`, not a
  multi-subscriber registry like every `onXxx`. A single required slot, assigned once,
  late — after construction, once `EngineLinks` has actually bound this Adapter
  instance to a real block/element (which can't happen at `createXxxAdapter()` time,
  since the element doesn't exist yet). No unsubscribe: the provider and the Adapter
  share the same lifetime.
- `publicPort`: `getXxx(): T` — a synchronous pull through the registered provider,
  called on demand. Throws if called before registration. That's a genuine invariant
  guard, not a soft error path: if the call site can only structurally be reached after
  the Adapter is bound (which is true for `getPlainText`), the throw should never
  actually fire in correct usage — trust the invariant rather than returning
  `null`/`undefined` and pushing a check onto every caller.

The `get*` verb prefix is reserved for exactly this shape and nothing else — a
category-1 state read is always a bare noun (`.bold`, `.language`), never `getBold()`.
Seeing `getXxx()` should specifically signal "this does work when called and may
throw," which a property-style read doesn't.

**Guardrail**: category 3 is a deliberately narrow, disciplined exception — it exists
because the Adapter *genuinely cannot* compute the value itself. It is not precedent for
turning Adapters into a general callback-stashing/proxying layer. If a new case doesn't
fit "the Adapter needs a capability injected because of a hard DOM/editorAPI dependency
it structurally cannot have," it's not category 3 — reconsider whether it's actually
category 1 (derived state) instead, or whether it belongs in `EngineLinks` instead of the
Adapter at all.

## Composition

`extendObjectProperties(obj, props1, props2, ...)` (`#utilities`) merges each source
object's own property descriptors onto `obj` and returns it typed as their
intersection. **Always call it, even with nothing to compose** — an Adapter with no
`SharedPorts` needs still builds its ports as
`extendObjectProperties({}, { ... } satisfies XxxConfigPortProps)` rather than a bare
object literal, so no Adapter's construction path reads as a special case. `{}` is safe
here: a fresh literal on every call, never shared/mutated across instances.

It throws if two merged sources (or a source and the base object) declare the same
property name — a real safety net. Hitting that while composing a `SharedPort` means
you picked a name already taken by the fragment you're composing with; rename your own
member, don't fight the guard.

### The `...Props` split

Every Adapter's `-types.ts` defines `XxxConfigPortProps`/`XxxPublicPortProps` (the
Adapter's *own* members) plus `XxxConfigPort extends XxxConfigPortProps, ...SharedPorts
{}` / `XxxPublicPort extends XxxPublicPortProps, ...SharedPorts {}` (the full merged
shape consumers actually see). The object literal passed to `extendObjectProperties`
gets typed with `satisfies XxxConfigPortProps` (not the full `XxxConfigPort`) — that's
what makes the split necessary, not optional: `satisfies` needs the *own-members-only*
shape to validate against, since `SharedPorts` members come from a different object
entirely (the composed base, not the literal). Present even when nothing is composed in
(`TemplateVariableConfigPort extends TemplateVariableConfigPortProps {}`) — for
consistency, not necessity, in that case.

### `SharedPorts/`

`Adapters/_Utilities/SharedPorts/` — behavior genuinely shared across features, each
its own `createXxxPort()` factory returning `{ configPort, publicPort }`, composed into
an Adapter via `extendObjectProperties`:

- `RemovePort` / `UnwrapPort` — bare `onRemove`/`remove()`, `onUnwrap`/`unwrap()`, no
  internal state at all (pure event, nothing to track).
- `CaptionPort` / `BlockAlignPort` — carry real state (`caption`, `align`), same
  `internals` + `Set`-per-slice shape as a full Adapter, just narrower.

Adding a new one that a future Adapter needs: give it its own folder
(`SharedPorts/XxxPort/XxxPort.ts` + `-types.ts` + `index.ts`), and **curate its own
`index.ts`** rather than blind `export *` from both files — export `createXxxPort` and
everything the composed surface actually needs, but never `UpdateStateParams`,
`XxxInternals`, or `CreateXxxPortResult`. Those are internal-only, and since every
port's own `-types.ts` names its internal update-params type `UpdateStateParams`
(unprefixed), blind re-export collides two ports' identically-named internal types the
moment both get pulled through `SharedPorts/index.ts`'s `export *`. Already happened
once (`BlockAlignPort` vs `CaptionPort`) — don't reintroduce it.

## Naming rules

**Port-identity rule** — the single most load-bearing convention here: a `configPort`
member is *always* a bare verb or field name (`onInsert`, `onLanguage`, `onRemove`,
`registerXxx`); a `publicPort` member that pushes Engine state to a consumer *always*
ends in `Update` (`onCanInsertUpdate`, `onLanguageUpdate`). Never the reverse, never a
bare `onUpdate` (collides with the rule itself). This is how you tell which port a
member belongs to by name alone, with zero need to check which interface it's declared
on.

**Callback type names mirror their method name exactly**, `Update` included when the
method has it: `onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn)`, not
`OnCanInsertCallbackFn`. This isn't optional style — a field that exists on both
directions (`onLanguage` on `configPort`, `onLanguageUpdate` on `publicPort`) would
produce two same-named exported types (`OnLanguageCallbackFn` twice) if the callback
type dropped the `Update` — the suffix is what keeps the two directions' type names
distinct in the same file.

**Prefix stripping** — every non-port type in an Adapter's own file drops the feature
name prefix (`OnInsertCallbackFn`, not `OnAccordionItemInsertCallbackFn`); only
`XxxState`, `XxxInternals`, `XxxConfigPort(Props)`, `XxxPublicPort(Props)`, `XxxAdapter`,
and `XxxSettings` keep it. Exception: a bare name that's genuinely ambiguous or reads as
a stutter in context keeps the prefix anyway — `CodeBlockLanguage`/`CodeBlockTheme` and
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

1. Value/union types the Adapter's state is made of (only if not already generic
   enough to live in `_Utilities`).
2. `XxxState` + `UpdateStateParams extends XxxState {}`.
3. Any ConfigPort-only param/value types, then `XxxConfigPortProps` +
   `XxxConfigPort extends XxxConfigPortProps, ...SharedPorts {}`.
4. `OnXxxUpdateCallbackFn` types (PublicPort direction), then `XxxPublicPortProps` +
   `XxxPublicPort extends XxxPublicPortProps, ...SharedPorts {}`.
5. `XxxInternals`.
6. `XxxAdapter { configPort; publicPort; }`.
7. `XxxSettings` (after `XxxAdapter`, not before).
8. `CreateXxxAdapterParams extends CreateAdapterParams<XxxSettings> {}`.
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

### Status

Converted to the current factory pattern (all seven, no class-based holdouts left):
`AccordionItem`, `CodeBlock`, `EmptyMedia`, `Formatting`, `Image`, `Separator`,
`TemplateVariable`.

Of those seven, five are actually reachable end-to-end from `createEditor` — they
have both `Features/ConfigureXxx/` wiring and an `RangeXEditor/AdapterFactories/Xxx/`:
`AccordionItem`, `EmptyMedia`, `Formatting`, `Image`, `Separator`. `CodeBlock` and
`TemplateVariable` are fully converted Adapters with no way to actually register them
yet — both pieces are still unbuilt for those two.

Not started at all — still only exist in `packages/rich-text-editor/src/Adapters/` as
classes, each needs the full conversion above, not a port of the old shape:
`Audio`, `BlockQuote`, `CommandMenu`, `Embed`, `Emoji`, `FindReplace`, `LineHandler`,
`Link`, `List`, `Markdown`, `Mention`, `ReadOnly`, `Shortcuts`, `Symbols`,
`Table`, `TodoList`, `UndoRedo`, `Video`.
