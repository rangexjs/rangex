# DOMAttrs

The attributes a component's elements may have: their shape, their validators, and how they're read, written and
resolved. The rules here are the editor's own; XSS is the [Sanitizer](Sanitizer.md)'s job.

Paths are relative to `src/DOMAttrs/` (alias `#dom-attrs`) unless noted otherwise. Link is the reference
implementation: `Link/LinkDOMAttrs.ts`. Image (`Image/ImageDOMAttrs.ts`) adds an element that is the component itself
(`block`, the `BlockComponent`).

## Rules

- **DOM-free at import time.** Nothing in `DOMAttrs/` may touch the DOM when it's imported: the snapshot validation
  imports it on a server. Importing from `@rangex/core` is fine; importing `#engine-links` isn't.
- **The shape is ours.** Which attributes exist, and which of them are required, is decided by the editor. Consumers
  can only replace validators, never add or remove attributes.
- **The Sanitizer comes first and always rejects.** Every validator is wrapped so the Sanitizer must allow the value
  before the validator runs (see [Validators](#validators)). A value the Sanitizer refuses is never repaired.

## Shape

A component's shape lists its elements that have attributes, by element name, and each element's attributes, by
attribute name, as `"required"` or `"optional"`:

```ts
const anchorAttrsShape = {
	href: "required",
	target: "optional",
	rel: "optional",
	title: "optional",
} as const satisfies ElementAttrsShape;

export const linkAttrsShape = {
	anchor: anchorAttrsShape,
} as const satisfies ComponentAttrsShape;
```

The shape is closed: any attribute not in it is invalid (live path) or dropped (snapshot path). The element names
(`anchor`) are the editor's own names for the component's parts, not tag names.

Every attribute type is derived from the shape (`_Utilities/DOMAttrs-types.ts`):

| Type | What it is |
|---|---|
| `ElementAttrs<Shape>` | One element's attributes. A required attribute is a `string`; an optional one is `string \| null` and can be left out. `null` (or left out) means it isn't set. |
| `ComponentAttrs<Shape>` | Every element's `ElementAttrs`, by element name. Every element is required. |
| `ElementAttrsPatch<Shape>` / `ComponentAttrsPatch<Shape>` | A change: a string sets the attribute, `null` removes it, an attribute or element left out stays as it is. |
| `ComponentElements<Shape>` | The component's `EditorElement`s, by element name. |
| `ElementDescriptor` | Which element it is: `localName`, `namespaceURI` and, for an `EditorElement`, `editorRole`. |

A component exports its shape and the types it needs under its own names (`LinkAttrsShape`, `LinkAttrs`,
`AnchorAttrs`, `LinkAttrsPatch`, `LinkAttrValidators`, `LinkAttrsMismatch`).

## Validators

A validator checks one set attribute's value and returns `null` when it's valid, otherwise an `AttrValidationFailed`:

- **`{ kind: "fallback", reason, value }`** — the value can be replaced by `value`. `null` removes the attribute; a
  required attribute's validator can only fall back to a string.
- **`{ kind: "reject", reason }`** — the value can't be fixed.

```ts
const validateTarget: ValidateAttrFn<string | null> = ({ value }) => {
	if (!allowedTargets.has(value)) {
		return { kind: "fallback", reason: 'must be "_blank" or "_self"', value: null };
	}

	return null;
};
```

Our own rules fall back when there's something to fall back to (e.g. an `href` breaking a Link rule falls back to
`"#"`), and reject otherwise (e.g. an Image's `src`: there's no image to show instead). The Sanitizer always rejects.
A validator only receives set values, except for a missing required attribute in the snapshot path, which is validated
as `""` (see [The two paths](#the-two-paths)).

`createComponentAttrValidators` (`_Utilities/CreateComponentAttrValidators/`) builds a component's validators. For every
attribute of the shape it takes the consumer's override or else the default, and wraps it so `canSetAttribute` (the
engine's Sanitizer, with the element's `ElementDescriptor`) runs first and rejects with "must be allowed by the
SanitizerPolicy". A replaced validator can't let through what the Sanitizer refuses.

A component wraps it in its own `createXAttrValidators(validatorOverrides)`:

```ts
export const createLinkAttrValidators = (validatorOverrides: CreateLinkAttrValidatorsParams) => {
	const linkAttrValidators = createComponentAttrValidators({
		componentAttrsShape: linkAttrsShape,
		elementDescriptors: { anchor: anchorElement },
		defaultValidators: { anchor: { href: validateHref, target: validateTarget, rel: validateRel, title: validateTitle } },
		validatorOverrides,
	});

	return linkAttrValidators;
};
```

### Consumer contract: share `attrValidators`

The consumer passes the same overrides in two places: the Adapter's settings (`LinkSettings.attrValidators`, used in
the editor) and the component's snapshot validator (`createLinkValidator({ attrValidators })`, used wherever snapshots
are validated, e.g. on a server). Define them once and pass the same object to both; otherwise the editor saves what
the validation repairs or rejects.

```ts
const linkAttrValidators: CreateLinkAttrValidatorsParams = { anchor: { target: validateTarget } };

Link({ attrValidators: linkAttrValidators });
createLinkValidator({ attrValidators: linkAttrValidators });
```

## The two paths

The same validators run on two paths, which treat a fallback differently.

**Live path — strict.** `validateComponentAttrs` / `validateElementAttrs` return the first mismatch, or `null`:

- `unknown-attr` — an attribute that isn't in the shape, even if it's `null`.
- `missing-attr` — a required attribute that isn't set.
- `invalid-attr` — a set attribute whose validator failed, with its `validationFailed`. A fallback counts as a failure
  too: the editor only writes what is valid as it is.

Used by everything that writes into a live editor: `changeDOMAttrs` / `validateDOMAttrs` (see
[DOMAttrsPort](#domattrsport-and-handledomattrs)), the insert handler, and Markdown. The UI shows the user why an input
is refused instead of silently changing it.

**Snapshot path — resolving.** `resolveElementAttrs` (`_Utilities/ResolveElementAttrs/`) returns the attributes the
element should have:

- An attribute that isn't in the shape is dropped.
- A missing optional attribute is skipped; a missing required one is validated as `""`.
- A valid value is kept.
- A fallback replaces the value (`null` drops the attribute), and the fallback value is validated again: if that fails,
  the element is invalid.
- A reject makes the element invalid.

It returns `{ kind: "valid", elementAttrs }` (the engine's `DOMAttrs`, ready to put on a draft) or
`{ kind: "invalid", mismatch }`. Used by the snapshot validators (see [SnapshotValidation](SnapshotValidation.md)), so a
stored snapshot that breaks a rule is repaired instead of rejected, unless a validator (or the Sanitizer) rejects it.

## Normalizing

A component can normalize its attributes before they're validated and written, e.g. `normalizeLinkAttrs` trims the
`href` and turns `example.com` into `https://example.com`. It only runs on the write paths (`changeDOMAttrs`,
`validateDOMAttrs`, insert, Markdown), so the validators receive the normalized values. The snapshot path never
normalizes: a stored value is validated as it is.

## Reading and writing

- `readElementAttrs` / `readComponentAttrs` read an element's attributes as they are in the DOM, one value for each
  attribute of the shape. An optional attribute that isn't set is `null`; a required one is `""`.
- `writeElementAttrs` / `writeComponentAttrs` set every string and remove every `null` (an attribute left out is left
  as it is), through `$$setAttribute` / `$$removeAttribute`, so the Sanitizer still runs on every write.
- `mergeComponentAttrs` applies a `ComponentAttrsPatch` to a copy of the attributes.
- `toDOMAttrs` turns an `ElementAttrs` into the engine's `DOMAttrs` for a `create*` factory, leaving out the attributes
  that aren't set.

## DOMAttrsPort and handleDOMAttrs

The Adapter side and the Features side are split as everywhere else (see [Adapters](Adapters.md)):

- **`DOMAttrsPort`** (`src/Adapters/_Utilities/SharedPorts/DOMAttrsPort/`) holds the current component's attributes and
  nothing else. `configPort`: `domAttrs`, `updateDOMAttrs`, `registerValidateDOMAttrs`, `registerChangeDOMAttrs`.
  `publicPort`: `domAttrs`, `onDOMAttrsUpdate`, `validateDOMAttrs`, `changeDOMAttrs`. Both commands throw until their
  provider is registered.
- **`handleDOMAttrs`** (`src/Features/_Utilities/HandleDOMAttrs/`) holds the logic. It keeps `domAttrs` in sync with the
  current component, through a `MutationObserver` on its subtree (`childList`, plus the shape's attributes as
  `attributeFilter`), so undo/redo updates it too. It registers both providers:
  - `validateDOMAttrs(attrs)` — normalizes, then validates (live path).
  - `changeDOMAttrs(patch)` — merges the patch into the current `domAttrs`, normalizes, validates, writes the valid
    attributes, reads them back right away (the observer only updates later), and registers a snapshot boundary.
    Returns the mismatch, or `null`.

`resolveElements` tells `handleDOMAttrs` which `EditorElement` each element name is; a component provides it through
its `getXParts` (`src/Features/_Utilities/GetComponentParts/`), e.g. `getLinkParts({ link })` → `{ anchor }`.

The Adapter registers its validators on the `AdapterBus` (`registerAttrValidators("link", …)`), so another Adapter's
feature can validate the component's attributes too (Markdown reads them with `getAttrValidators("link")`).

## Adding a component

1. **Shape** — `XAttrsShape` in `DOMAttrs/X/XDOMAttrs.ts`, plus the exported types under the component's names.
2. **Validators** — one default validator per attribute, `ElementDescriptor`s, and `createXAttrValidators`. Add a
   normalizer only if the UI accepts values the validators shouldn't have to (e.g. a URL without a scheme).
3. **Adapter** — compose `createDOMAttrsPort<XAttrsShape>()`, take `attrValidators` in `XSettings`, create the
   validators and register them on the `AdapterBus` (`AttrValidatorsByAdapter`).
4. **Parts** — `getXParts` in `src/Features/_Utilities/GetComponentParts/`, throwing on an unexpected structure.
5. **Features** — `handleDOMAttrs` in `configureX`, and the component's `create*` factory built from `toDOMAttrs`.
6. **Snapshot validator** — `createXValidator({ attrValidators })`, resolving each element with `resolveElementAttrs`
   (see [SnapshotValidation](SnapshotValidation.md)).
7. **Exports** — the shape types and `CreateXAttrValidatorsParams` from `@rangex/editor/x`.
