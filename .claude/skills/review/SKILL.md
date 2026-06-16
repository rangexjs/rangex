---
name: review
description: Review code changes (staged diff, a PR, specific files, or a description of recent edits) for names, correctness, and error handling. Use when the user asks to "review my changes", "review the staged changes", "review this PR", "review what I just did", or similar.
---

# Review

## Scope

Default to reviewing everything changed since the last commit (`git diff HEAD` — staged and unstaged changes together), not just staged changes. Only use a different scope (a specific PR, commit, file, or just the staged diff) if the user asks for that explicitly.

## What to check

Always check all three:

1. **Names** — review all function, variable, type, and interface names. If a better name comes to mind, recommend it explicitly.
2. **Overall correctness** — review the logic end-to-end: does it do what it's supposed to, are there edge cases, off-by-ones, or missed branches?
3. **Error handling** — are thrown errors appropriate? Should any be removed (trusting internal invariants) or added (at real boundaries)?

Don't pad the review with unrelated style nitpicks — stick to these three lenses.

## Reporting findings

When something looks like a bug or is incorrect, don't dump full detail on every finding up front. First give a short list — one line per issue, just enough to identify it. Then go through them one by one with full detail only as the user asks for each ("let's look at #2", "go through them", etc.).
