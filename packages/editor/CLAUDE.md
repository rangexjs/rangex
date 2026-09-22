# CLAUDE.md

## Comments

- Every function exported from a module (file) must have a comment above it describing what it does.
- Other functions in that module may have comments too if it seems necessary, but prefer clean code over comments.
- Describe general behavior, not specific cases.
- Avoid comments that need updating every time the function is extended (e.g. don't list callers — "used by A, B, C").
- Above a function, use block style:
  ```
  /*
  * Comment
  */
  ```
  Max 120 chars per line. 1-6 lines depending on complexity — prefer 1-2 for simple functions, 3 for complex ones, 4-6 only if really necessary, avoid otherwise.
- Inside a function body, if a comment is necessary, use `// comment`.
