# @rangex/rich-text-editor

A ready-to-use RangeX rich text editor: toolbar, menus, popovers and all features included. Pick the extensions you want and mount it; no further setup needed.

It's built on [`@rangex/editor`](https://www.npmjs.com/package/@rangex/editor) and [`@rangex/solid`](https://www.npmjs.com/package/@rangex/solid). The UI is written in SolidJS, but you don't need to use Solid yourself: the editor mounts into any page.

## Install

```bash
npm install @rangex/rich-text-editor
```

## Create an editor

Each extension enables one feature, with its toolbar buttons and menus. Features you don't list are left out of your bundle.

```ts
import {
	createRichTextEditor,
	Formatting,
	Image,
	Link,
	List,
	Table,
	UndoRedo,
} from "@rangex/rich-text-editor";

const richTextEditor = createRichTextEditor({
	extensions: [Formatting({}), Image({}), Link({}), List({}), Table({}), UndoRedo({})],
});

document.querySelector("#editor")?.append(richTextEditor.editorHost);
```

Some extensions need settings from your app, e.g. where to upload files or where to look up users:

```ts
EmptyMedia({ uploadFile: ({ file, onProgress }) => uploadToYourStorage(file, onProgress) });
Mention({ getItems: ({ query, signal }) => searchYourUsers(query, signal) });
```

Syntax highlighting for code blocks comes from a separate package, [`@rangex/syntax-highlighter-shiki`](https://www.npmjs.com/package/@rangex/syntax-highlighter-shiki); pass its result to `CodeBlock`.

## Save and restore

```ts
const storedSnapshot = richTextEditor.createStoredSnapshot(); // plain JSON, ready to store

createRichTextEditor({ storedSnapshot, extensions });
```

Call `richTextEditor.destroy()` when you remove the editor.

## Display saved content

`createRichTextHTMLView` turns a stored snapshot into an HTML string plus its styles, using the same styling as the editor.

```ts
import { createRichTextHTMLView } from "@rangex/rich-text-editor";

const { html, styles } = createRichTextHTMLView({ storedSnapshot });
```

## License

MIT. RangeX depends on `@rangex/core`, which is licensed separately. See [LICENSE.md](https://github.com/rangexjs/rangex/blob/main/LICENSE.md).
