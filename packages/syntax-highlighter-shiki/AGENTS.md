# AGENTS.md

Guidance for AI coding agents working in `@rangex/syntax-highlighter-shiki`. Repo-wide rules and commands are in the root `AGENTS.md`.

## What this package is

Shiki-based syntax highlighting for RangeX code blocks. It implements the highlighting contracts defined in `@rangex/editor` (`GetHighlightInfoFn`, `HighlightCodeFn`, `HighlightInfo`) — it does not define its own.

## Shiki imports

Shiki is a single peer dependency: `shiki`. Import everything through its subpaths:

- `shiki/core` — `createHighlighterCore`, `createHighlighterCoreSync`, `HighlighterCore`
- `shiki/engine/javascript` — `createJavaScriptRegexEngine`
- `shiki/types` — `LanguageInput`, `ThemeInput`, `LanguageRegistration`, …
- `shiki` — `BundledLanguage`, `BundledTheme` (types only)

Never import from `@shikijs/*` in `src/`. Bun uses isolated installs, so this package can only resolve what its own `package.json` declares, and `@shikijs/*` is not declared. Shiki's docs use `@shikijs/*` — translate those imports to the `shiki/*` subpath. (Comments may still mention `@shikijs/langs/*`: that is what consumers import, not this package.)

## Two highlighting paths

**Editor (async, in a worker):**
- `initEditorHighlighterWorker` runs *inside* a worker file the consumer writes. It builds the highlighter and answers requests via `self.onmessage`.
- `createEditorHighlighter` runs on the main thread. It wraps that `Worker` into a `GetHighlightInfoFn`, matching requests and responses by an incrementing id.
- The message shapes (`WorkerRequest`, `WorkerResponse`) are shared by both sides — change them together.

**HTML view (sync, no worker):**
- `createHTMLViewHighlighter` returns a `HighlightCodeFn` for `createHTMLView`. It runs on the calling thread, so it also works on the server, and needs already-imported language/theme registrations rather than lazy loaders.

Both paths tokenize through `_Utilities/TokenizeCode`, and both answer `null` (instead of throwing) when a language or theme was not loaded.

## Comments

Every exported function gets a `/* … */` block comment describing its behavior, max 120 characters per line.

## Checks

No tests exist in this package. Verify with `bun run lint` from the repo root, and `bun run build` in this package when changing exports or types.
