import type { LinkDefinition } from "./LinkDefinition-types";

/*
 * The state of every link's NestedEditable: createLink builds it with this, and a snapshot's link must match it. No
 * component is allowed in it.
 */
export const linkDefinition = {
	nestedEditableProps: {
		display: "inline",
		editState: "inherit",
		allowedComponents: [],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies LinkDefinition;
