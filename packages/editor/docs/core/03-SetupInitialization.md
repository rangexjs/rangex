# 3. Setup & Initialization

## Creating an instance

Call `createEditorAPI()` to build an editor. It returns an `editorAPI` object.

```ts
import { createEditorAPI } from "@rangex/core";

const { editorAPI } = createEditorAPI({
	licenseKey: "eyJ2IjoxLC...",
	rootEditableFrom: { type: "node", node: rootEditable },
	shadowRootOptions: { mode: "open", serializable: true },
	isTextAreaEditable: true,  // default — omit if not needed
	isTextAnimation: false,    // default — omit if not needed
});

document.body.append(editorAPI.host);
```

`editorAPI.host` is an `HTMLElement` that owns the editor's shadow root.

## `licenseKey`

`string`, required. Your RangeX license key, from [rangex.dev](https://rangex.dev). Pass an empty string (`""`) when you don't have a key yet, e.g. during local development or evaluation — it counts as a missing key.

```ts
const { editorAPI } = createEditorAPI({
	licenseKey: "eyJ2IjoxLC...",
	rootEditableFrom: { type: "node", node: rootEditable },
	shadowRootOptions: { mode: "open" },
});
```

The key is verified offline, in the background after the editor is created: the editor never contacts a server and never waits for the check. Each key is valid for 6 months, through the whole expiry day (UTC). Regenerate it while your subscription is active and redeploy before it expires.

The license never disables the editor. Depending on the key's state:

| Key state | Console warning | "Unlicensed RangeX" watermark |
|---|---|---|
| Valid, more than 30 days left | — | — |
| Valid, 30 days or fewer left | ✓ | — |
| Expired | ✓ | ✓ |
| Missing | ✓ | ✓ |
| Malformed, or not signed by RangeX | ✓ | ✓ |
| Can't be verified (the browser's Web Crypto API doesn't support Ed25519, or the page isn't a secure context) | ✓ | — |

The watermark is a link to rangex.dev rendered inside the editor's shadow root, below the content, with the id `"license-watermark"`. The link carries the page's hostname and the key's state (`"expired"`, `"missing"` or `"invalid"`) as query parameters; nothing about the page or its users. 

On a local development host the watermark is never shown. Local development hosts are:

- `localhost`, `*.localhost` and `*.local`
- loopback and private network addresses: `127.x.x.x`, `10.x.x.x`, `172.16.x.x`–`172.31.x.x`, `192.168.x.x`, `[::1]`, and IPv6 unique local (`fc00::/7`) and link-local (`fe80::/10`) addresses, so testing on a phone over your local network works too
- pages without a hostname, such as `file:`

A missing key is not reported there, but a provided key is still verified and its warnings are logged, so you can test your key locally.

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
