import type { CodeBlockDefinition } from "./CodeBlockDefinition-types";

/*
 * The state of every code block line's NestedEditable: createCodeBlock builds it with this, and a snapshot's code block
 * must match it. A line is plain text: no component, line tag, style or inline tag is allowed in it.
 */
export const codeBlockDefinition = {
	lineNestedEditableProps: {
		display: "block single-line",
		editState: "inherit",
		allowedComponents: [],
		allowedContentLineLocalNames: [],
		allowedContentLineStyleAttrNames: [],
		allowedGlyphFormatterStyleAttrNames: [],
		allowedGlyphFormatterInlineTags: [],
	},
} satisfies CodeBlockDefinition;
