# 1. What is RangeX

RangeX is a schema-driven rich text editor built directly on the real DOM. Rather than abstracting the DOM away, RangeX extends each editor node in-place: plain HTML (or Text) nodes get `$$`-prefixed properties and methods attached directly onto them (e.g. `node.$$append(...)`, `node.$$childNodes`), giving consumers a safe, structured API for editor operations without any wrapper objects. The schema strictly controls which node types can exist and how they nest, so the DOM structure is always predictable.

Editor logic is fully separated from content: the output of RangeX is pure HTML or JSON with no behavior attached. Native HTML elements (`input`, `details`, `button`, etc.) remain interactive inside the editor — the DOM is controlled, not replaced.
