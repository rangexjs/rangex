import { componentsName } from "../../ComponentsName";
import type { BlockQuoteDefinition } from "./BlockQuoteDefinition-types";

/*
 * The state of every block quote's NestedEditable: createBlockQuote builds it with this, and a snapshot's block quote
 * must match it. Only the listed inline components are allowed in it, so a new component stays out until it's added.
 */
export const blockQuoteDefinition = {
	nestedEditableProps: {
		display: "block multi-line",
		editState: "inherit",
		allowedComponents: [
			componentsName.link,
			componentsName.mention,
			componentsName.templateVariable,
		],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies BlockQuoteDefinition;
