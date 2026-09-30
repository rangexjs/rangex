# 3. Setup & Initialization

## Creating an instance

Call `createEditorAPI()` to build an editor. It returns an `editorAPI` object.

```ts
import { createEditorAPI } from "@rangex/core";

const { editorAPI } = createEditorAPI({
	rootEditableFrom: { type: "node", node: rootEditable },
	shadowRootOptions: { mode: "open", serializable: true },
	isTextAreaEditable: true,  // default — omit if not needed
	isTextAnimation: false,    // default — omit if not needed
});

document.body.append(editorAPI.host);
```

`editorAPI.host` is an `HTMLElement` that owns the editor's shadow root.

## `rootEditableFrom`

Controls how the editor's content is initialized. Two shapes:

- **`{ type: "node", node: RootEditable }`** — fresh start. You construct a `RootEditable` (see [Creating nodes](#5-creating-nodes)) and pass it in.
- **`{ type: "snapshot", storedSnapshot: StoredSnapshot }`** — restore previously persisted content. Pass a `StoredSnapshot` retrieved from storage, after running it through `migrateStoredSnapshot`. Throws if the snapshot's `version` doesn't equal the package's snapshot version (see [Snapshots](09-Snapshots.md#migrating-a-storedsnapshot)).

## `shadowRootOptions`

`ShadowRootInit` (the same options object native `Element.attachShadow()` accepts: `mode`, `delegatesFocus`, `slotAssignment`, `serializable`, `clonable`). Required — there is no default, so callers must always state their own `mode` explicitly. 

## `isTextAreaEditable`

`boolean`, default `true`. When `false`, the entire editor is forced into read-only mode — `contenteditable="false"` is applied to all elements regardless of their individual `EditState`. See `setIsTextAreaEditable` in [section 14](#14-editorapi).

## `isTextAnimation`

`boolean`, default `false`. Enables text animation on input.

## Accessing the API

All editor operations go through the `editorAPI` object returned by `createEditorAPI`:

```ts
editorAPI.focus();
editorAPI.getEditorSelection();
editorAPI.insertNode({ ... });
```

## Destroying an instance

Call `editorAPI.destroy()` when the editor is being permanently removed to release internal bindings. See [`destroy()`](#destroying-the-editor) in section 14.
