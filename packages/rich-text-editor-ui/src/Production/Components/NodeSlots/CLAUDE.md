# CLAUDE.md

Guidance for Claude Code when working with `NodeSlots/` components.

## Why events here need special handling

Components under `NodeSlots/` aren't rendered inside `RichTextEditorUI`'s own component tree. They're mounted via native slot assignment directly into whatever editor surface `rich-text-editor-ui` is wired to (`rich-text-editor-ui` is a standalone UI library — it isn't part of that engine, just composed into it at runtime). That composition means a `NodeSlots` component becomes, structurally, part of the editor.

Because of that, native DOM events fired inside a `NodeSlots` component (`keydown`, `beforeinput`, `paste`, `copy`, `cut`, drag events, etc.) don't just bubble through the component's own ancestors — they also reach the editor's own event listeners, which may act on them regardless of whether they actually originated from the editor's own content or from a foreign native element (an `<input>`, a button, ...) living inside the `NodeSlots` component.

## The fix: stop propagation at the source

Call `event.stopPropagation()` from within the `NodeSlots` component itself, before the event has a chance to bubble out to the editor. The editor's own listeners sit further up the tree, so stopping propagation early enough means they never see the event at all.

The exact shape depends on the event — see `EmptyMediaSlot.tsx` for a reference implementation:

- **Focus-driven events** (`keydown`, `beforeinput`, `paste`, `copy`, `cut`) — generally safe to stop unconditionally. These can only originate from something actually focused inside the component's own subtree.
- **Pointer-driven events** (drag events) — usually need to stay conditional instead. They fire based on pointer position during a gesture, not focus, so an unrelated interaction (e.g. the editor's own internal drag-to-reorder) can legitimately pass over or land on a `NodeSlots` component's screen area and still needs to reach the editor. `EmptyMediaSlot` gates on `dataTransfer.types.includes("Files")` — only genuine external file drags get stopped; anything else is left untouched.

Apply the same reasoning to any new `NodeSlots` component: identify which native elements it renders, and stop propagation on whichever events those elements need to handle themselves.
