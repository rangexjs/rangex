# @rangex/syntax-highlighter-shiki

[Shiki](https://shiki.style)-based syntax highlighting for RangeX code blocks.

It covers both places code blocks are rendered:

- **In the editor**: highlighting runs in a Web Worker, so typing in a code block never blocks the page.
- **In the HTML view** (rendered snapshots): highlighting runs synchronously while the view is built.

## Install

```bash
npm install @rangex/syntax-highlighter-shiki @shikijs/langs @shikijs/themes
```

Keep `@shikijs/langs` and `@shikijs/themes` on the same version as `shiki`.

## Define your languages and themes

List the languages and themes you support once, and derive everything else from that list. Each `load` must be a literal dynamic import, so your bundler only emits the languages and themes you list, not Shiki's whole catalog.

```ts
// code-block-highlighting.ts
import type {
	CodeBlockLanguageDefinition,
	CodeBlockThemeDefinition,
} from "@rangex/syntax-highlighter-shiki";

export const languageDefinitions: CodeBlockLanguageDefinition[] = [
	{ value: "typescript", label: "TypeScript", load: () => import("@shikijs/langs/typescript") },
	{ value: "css", label: "CSS", load: () => import("@shikijs/langs/css") },
];

export const themeDefinitions: CodeBlockThemeDefinition[] = [
	{ value: "github-light", label: "GitHub Light", load: () => import("@shikijs/themes/github-light") },
	{ value: "github-dark", label: "GitHub Dark", load: () => import("@shikijs/themes/github-dark") },
];
```

## Highlighting in the editor

**1. Create the worker.** It loads Shiki with your languages and themes and answers highlight requests.

```ts
// highlighter-worker.ts
import { initEditorHighlighterWorker } from "@rangex/syntax-highlighter-shiki";
import { languageDefinitions, themeDefinitions } from "./code-block-highlighting";

initEditorHighlighterWorker({
	langs: languageDefinitions.map(({ load }) => load),
	themes: themeDefinitions.map(({ load }) => load),
});
```

**2. Connect it on the main thread** and pass the result to the code block extension.

```ts
import { CodeBlock } from "@rangex/rich-text-editor/code-block";
import { createEditorHighlighter } from "@rangex/syntax-highlighter-shiki";
import { languageDefinitions, themeDefinitions } from "./code-block-highlighting";
import HighlighterWorker from "./highlighter-worker?worker";

const getHighlightInfo = createEditorHighlighter(new HighlighterWorker());

const codeBlock = CodeBlock({
	getHighlightInfo,
	languages: languageDefinitions.map(({ label, value }) => ({ label, value })),
	themes: themeDefinitions.map(({ label, value }) => ({ label, value })),
	defaultTheme: { light: "github-light", dark: "github-dark" },
});
```

When building on `@rangex/editor` directly, pass the same `getHighlightInfo` to its `CodeBlock` adapter (`@rangex/editor/code-block`).

### Bundler setup

Languages and themes load lazily inside the worker. Your bundler must output the worker as an ES module, or every listed language and theme ends up in one large worker file.

- **Vite:** set the worker format to `es`. The default (`iife`) can't split code.

  ```ts
  // vite.config.ts
  export default defineConfig({
  	worker: { format: "es" },
  });
  ```

- **webpack 5 / Rspack:** create the worker as a module. Lazy imports are split automatically.

  ```ts
  new Worker(new URL("./highlighter-worker.ts", import.meta.url), { type: "module" });
  ```

## Highlighting in the HTML view

The HTML view renders synchronously, so its highlighter needs languages and themes that are **already imported**, not lazy loaders. Each `@shikijs/langs/*` module exports an array (the language plus the languages it embeds), so pass one entry per module.

```ts
import typescript from "@shikijs/langs/typescript";
import css from "@shikijs/langs/css";
import githubLight from "@shikijs/themes/github-light";
import githubDark from "@shikijs/themes/github-dark";
import { createRichTextHTMLView } from "@rangex/rich-text-editor";
import { createHTMLViewHighlighter } from "@rangex/syntax-highlighter-shiki";

const highlightCode = createHTMLViewHighlighter({
	langs: [typescript, css],
	themes: [githubLight, githubDark],
});

const htmlView = createRichTextHTMLView({ storedSnapshot, limits, highlightCode });
```

`createHTMLView` from `@rangex/editor` takes the same `highlightCode` option.

## Unknown languages or themes

If a code block asks for a language or theme that wasn't loaded, both highlighters log a warning and return `null`. The code block is then shown without highlighting.

## License

MIT. RangeX depends on `@rangex/core`, which is licensed separately. See [LICENSE.md](https://github.com/rangexjs/rangex/blob/main/LICENSE.md).
