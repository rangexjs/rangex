# @rangex/editor

The framework-agnostic layer of RangeX, written in plain TypeScript. It wires the RangeX engine (`@rangex/core`) into an editor you can build any UI on:

- **Adapters** for each feature (formatting, links, lists, tables, code blocks, media, mentions…). Enable only the ones you need.
- **`createEditor`** mounts the editor and exposes each enabled adapter's public port: actions to call, and state you can read and subscribe to.
- **Snapshot and HTML views** render a stored document without an editor.

Looking for a ready-made editor with a toolbar and menus? Use [`@rangex/rich-text-editor`](https://www.npmjs.com/package/@rangex/rich-text-editor). For SolidJS bindings to the ports, see [`@rangex/solid`](https://www.npmjs.com/package/@rangex/solid).

## Install

```bash
npm install @rangex/editor
```

## Create an editor

Pass the adapters you want to enable. Each one adds its public port to `editor`.

Each feature has its own entry point, named after it in kebab-case (`@rangex/editor/link`, `@rangex/editor/code-block`…), which exports its adapter and types. The package root exports what isn't specific to one feature, such as `createEditor` and the views.

```ts
import { createEditor } from "@rangex/editor";
import { Formatting } from "@rangex/editor/formatting";
import { Link } from "@rangex/editor/link";
import { UndoRedo } from "@rangex/editor/undo-redo";

const { editor, host, floatingContainer, hostStyles } = createEditor({
	licenseKey: "eyJ2IjoxLC...", // your RangeX license key; "" while developing locally
	snapshotSchema: {
		limits: { maxDepth: 100, maxNodeCount: 50_000, maxTextLength: 100_000 }, // how large a stored snapshot may be
		root: { types: ["rich-text"] },
		components: { link: {} }, // every component the editor is built with
	},
	adapters: [Formatting({}), Link({}), UndoRedo({})],
	styles: editorStyles, // CSS for the content inside the editor
});

// The editable area, and the element floating UI (menus, popovers) mounts into
document.body.append(host, floatingContainer);

// Styles for the page the editor lives in
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(hostStyles);
document.adoptedStyleSheets.push(styleSheet);
```

Ports of adapters you didn't enable are `undefined`.

```ts
undoButton.onclick = () => editor.undoRedo?.stepBack();

const unsubscribe = editor.undoRedo?.onCanStepBackUpdate((canStepBack) => {
	undoButton.disabled = !canStepBack;
});
```

## Save and restore

```ts
const storedSnapshot = editor.snapshot.createStored(); // plain JSON, ready to store

createEditor({ licenseKey, storedSnapshot, snapshotSchema, adapters, styles });
```

A snapshot that doesn't match `snapshotSchema` isn't loaded: the editor starts empty and logs a warning. Saving then replaces the stored snapshot with the empty content.

Call `editor.destroy()` when you remove the editor.

## Render without an editor

`createHTMLView` turns a stored snapshot into an HTML string plus its styles, e.g. to display saved content read-only.

```ts
import { createHTMLView } from "@rangex/editor";

const { html, styles } = createHTMLView({ storedSnapshot, limits, styles: editorStyles });
```

To highlight code blocks, pass `highlightCode`, e.g. from [`@rangex/syntax-highlighter-shiki`](https://www.npmjs.com/package/@rangex/syntax-highlighter-shiki).

## License

MIT. RangeX depends on `@rangex/core`, which is licensed separately. See [LICENSE.md](https://github.com/rangexjs/rangex/blob/main/LICENSE.md).
