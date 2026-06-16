# CLAUDE.md

For complete RangeX domain documentation, see [docs/RangeX-LLMs.md](docs/RangeX-LLMs.md).

---

## Commenting Style

This repository is open-source. Comments are written for end users — developers reading and potentially modifying the source code. Good comments:
- Explain **why** a constraint exists or what a behavior means, not just what the code does
- Engine-specific terms (`$$display`, `"block multi-line"`, etc.) are fine to use — they will be covered by engine documentation and users are expected to know them
- Describe the contract: what is guaranteed, and what will throw

---

## NodeQuery

`NodeQuery/` contains stateless DOM traversal utilities. Every function is a pure query: `(node: Node) → EditorNode | null`. They are not stateful cursors (unlike the browser's `TreeWalker`).

Since the boundary-point (selection) in RangeX is always a `Text` node (the deepest possible node), most queries are anchored to a `Text` and walk upward — acting as a narrowing layer from raw DOM into schema types.

Naming conventions:
- `getClosest*` — walks upward, finds first matching ancestor
- `getDeepest*` — walks downward
- `getSurrounding*` — lateral / context-aware
