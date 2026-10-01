# RangeX

RangeX is a rich text editor built from scratch. It's split into packages that build on top of each other, from the engine at the bottom to a ready-made editor at the top.

Its architecture is extension-based: features such as links, tables or code blocks are extensions, each with its own options. You add only the ones you need, configure them to fit your product, and the rest stay out of your bundle.

- **`@rangex/core`**: the engine and the foundation of everything else. It owns the document, selection, formatting and editing, and keeps the document valid through a schema that defines which content can go where. Exposes it all through a low-level API. Written in TypeScript.

- **[`@rangex/editor`](packages/editor)**: uses the engine's low-level API to build the editor's components and their behavior, such as link editing, mention suggestions and table actions. Headless: no UI, only high-level APIs to build a rich text editor from. Written in TypeScript.

- **[`@rangex/syntax-highlighter-shiki`](packages/syntax-highlighter-shiki)**: syntax highlighting for code blocks, built for `@rangex/editor` and powered by [Shiki](https://shiki.style).

- **[`@rangex/solid`](packages/solid)**: SolidJS bindings for `@rangex/editor`, for building your own editor interface in Solid. It turns the editor's state into Solid accessors. It extends `@rangex/editor` rather than replacing it, and adds no UI of its own.

- **[`@rangex/rich-text-editor`](packages/rich-text-editor)**: a complete, ready-to-use rich text editor with a predefined UI: toolbar, menus and popovers. Built on `@rangex/editor` and `@rangex/solid` and written in SolidJS, but works in any app, whatever framework it uses.

> RangeX is in **beta** and is not ready for production use. Stored snapshots (the saved documents) are **not** backward compatible until the final `1.0.0` release: a snapshot saved with one beta will not load in a later one.

### This repository is:

- **A demo** of what the engine can do, so you can evaluate RangeX before building on it.
- **A reference implementation**: the ready-made editor shows how to wire the engine into a complete editor, so you can follow it when building your own.

Everything here is open source except the engine (`@rangex/core`), which is currently closed-source. It's planned to become open source with the final `1.0.0` release.
