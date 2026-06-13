# CLAUDE.md

For complete RangeX domain documentation, see [docs/RangeX-LLMs.md](docs/RangeX-LLMs.md).

---

## Review rules

Whenever asked to review any change, always do all six:

1. **Names** — review all function, variable, type, and interface names. If a better name comes to mind, recommend it explicitly.
2. **Overall correctness** — review the logic end-to-end: does it do what it's supposed to, are there edge cases, off-by-ones, or missed branches?
3. **Error handling** — are thrown errors appropriate? Should any be removed (trusting internal invariants) or added (at real boundaries)?

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
