import { componentsName } from "../../ComponentsName";
import type { ListDefinition } from "./ListDefinition-types";

/*
 * The state of every list and its items' NestedEditables: createList builds them with this, and a snapshot's list must
 * match it. An item only allows inline components, each listed by name, so a new component stays out until it's added.
 */
export const listDefinition = {
	lineType: "multi-line",
	editState: "inherit",
	itemNestedEditableProps: {
		display: "block multi-line",
		editState: "inherit",
		allowedComponents: [
			componentsName.link,
			componentsName.mention,
			componentsName.templateVariable,
			componentsName.comment,
		],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies ListDefinition;
