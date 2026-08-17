# 3. Setup & Initialization

## Registering the element

Call `defineRangeX()` once before using the editor. It registers `<rich-text-area>` as a custom element and returns the `RangeX` class.

```ts
import { defineRangeX } from "rich-text-area";

const { RangeX } = defineRangeX({});
```

## Creating an instance

```ts
const rangeX = new RangeX({
	rootEditableFrom: { type: "node", node: rootEditable },
	shadowRootOptions: { mode: "open", serializable: true },
	isTextAreaEditable: true,  // default — omit if not needed
	isTextAnimation: false,    // default — omit if not needed
});

document.body.appendChild(rangeX);
```

## `rootEditableFrom`

Controls how the editor's content is initialized. Two shapes:

- **`{ type: "node", node: RootEditable }`** — fresh start. You construct a `RootEditable` (see [Creating nodes](#5-creating-nodes)) and pass it in.
- **`{ type: "snapshot", storedSnapshot: StoredSnapshot }`** — restore previously persisted content. Pass a `StoredSnapshot` retrieved from storage (see [Undo/redo & snapshots](#12-undoredo--snapshots)).

## `shadowRootOptions`

`ShadowRootInit` (the same options object native `Element.attachShadow()` accepts: `mode`, `delegatesFocus`, `slotAssignment`, `serializable`, `clonable`). Required — there is no default, so callers must always state their own `mode` explicitly. 

## `isTextAreaEditable`

`boolean`, default `true`. When `false`, the entire editor is forced into read-only mode — `contenteditable="false"` is applied to all elements regardless of their individual `EditState`. See `setIsTextAreaEditable` in [section 14](#14-editorapi).

## `isTextAnimation`

`boolean`, default `false`. Enables text animation on input.

## Accessing the API

All editor operations go through `rangeX.editorAPI`:

```ts
const api = rangeX.editorAPI;

api.focus();
api.getEditorSelection();
api.insertNode({ ... });
```

