import type { MentionDefinition } from "./MentionDefinition-types";

/*
 * The state of every mention's NestedEditable: createMention builds it with this, and a snapshot's mention must match
 * it. No component is allowed in it.
 */
export const mentionDefinition = {
	nestedEditableProps: {
		display: "inline",
		editState: "inherit",
		allowedComponents: [],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies MentionDefinition;
