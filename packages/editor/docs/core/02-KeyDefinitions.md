# 2. Key Definitions

> In DOM examples, `#TypeName` refers to an instance of that EditorNode type (e.g. `#BasicText` = a `BasicText` text node, `#ContentLine` = a `ContentLine` element).

## EditingRoot

The topmost `ScopedEditable` that is editable. Walking up the tree from any node, the highest `ScopedEditable` where the editable condition still holds is the `EditingRoot`.

A `NestedEditable` with `contenteditable="true"` nested inside a `Component` with `contenteditable="false"` becomes its own `EditingRoot` — the non-editable ancestor stops the upward walk.

```html
<div contenteditable="false">
	<!-- EditingRoot -->
	<div contenteditable="true">
		<p contenteditable="true">
			<span>text</span>
		</p>
	</div>
</div>
```

## Non-EditingRoot

The topmost `contenteditable="false"` ancestor of a non-editable node. It is the mirror of `EditingRoot` — where `EditingRoot` is the highest point where editability begins, `Non-EditingRoot` is the highest point where non-editability begins.

```html
<div contenteditable="true">
	<!-- Non-EditingRoot -->
	<div contenteditable="false">
		<p contenteditable="false">
			<span>text</span>
		</p>
	</div>
</div>
```

Relevant in selection validation (section 8): when the selection anchor is inside a `Non-EditingRoot`, the focus is constrained to stay within the same non-editable boundary. Also relevant to `$$isCrossable` on `Component` nodes — crossing into a component's content is only possible when the component is fully editable (not inside a `Non-EditingRoot`).

## Outermost X

The shallowest `X` descendant within a given scope — the first `X` encountered when traversing the tree top-down. A deeper `X` nested inside another `X` is not considered the outermost.

```html
<div class="scope">
	<article>
		<!-- outermost div — shallowest div descendant of scope -->
		<div>
			<!-- NOT the outermost div — nested inside another div -->
			<div></div>
		</div>

		<!-- outermost div — shallowest div descendant of scope -->
		<div></div>
	</article>
</div>
```

This term is used throughout the schema rules — for example, "each outermost `NestedEditable` inside a `BlockComponent` must have `$content.type = "default"`" means the rule applies to the direct-child `NestedEditable`s of the `BlockComponent`, not to any `NestedEditable`s nested deeper inside them.

## EditorArea

The set of all `ContentFlowNode`s within a `ScopedEditable`. A `Component` itself belongs to the `EditorArea`, but its descendants do not — unless they are inside a `NestedEditable` within it.

```html
<!-- EditorArea: root-editable -->
<root-editable>
	<content-line>                  <!-- ✓ ContentFlowNode -->
		#BasicText                  <!-- ✓ ContentFlowNode -->
		<inline-component>     <!-- ✓ ContentFlowNode (the Component itself is included) -->

			<!-- ✗ not part of this EditorArea (LayoutUnit descendants are excluded) -->
			<html-layout>
				<!-- EditorArea: nested-editable -->
				<nested-editable>
					<content-line>#BasicText</content-line>
				</nested-editable>
			</html-layout>

		</inline-component>
	</content-line>
</root-editable>
```

## EditorZone

A group of `EditorArea`s that share the same `EditingRoot`.

```html
<!-- EditorZone A (EditingRoot = root-editable) -->
<root-editable contenteditable="true">
	<content-line>
		<inline-component contenteditable="inherit">
			<!-- EditorZone A: "inherit" → same EditingRoot as root-editable -->
			<nested-editable contenteditable="true">
				<content-line>#ContentLineChild</content-line>
			</nested-editable>
		</inline-component>

		<inline-component contenteditable="false">
			<!-- EditorZone B: "false" → different EditingRoot -->
			<nested-editable contenteditable="true">
				<content-line>#ContentLineChild</content-line>
			</nested-editable>
		</inline-component>
	</content-line>
</root-editable>
```
