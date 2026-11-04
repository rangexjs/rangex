import { componentsName } from "../../ComponentsName";
import type { AccordionItemDefinition } from "./AccordionItemDefinition-types";

/*
 * The state of every accordion item's NestedEditables: createAccordionItem builds them with this, and a snapshot's
 * accordion item must match it. The summary only allows inline components, the body every component but an accordion
 * item. Each one is listed by name, so a new component stays out until it's added.
 */
export const accordionItemDefinition = {
	summaryNestedEditableProps: {
		display: "block single-line",
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
	bodyNestedEditableProps: {
		display: "block multi-line",
		editState: "inherit",
		allowedComponents: [
			componentsName.link,
			componentsName.mention,
			componentsName.templateVariable,
			componentsName.comment,
			componentsName.audio,
			componentsName.blockQuote,
			componentsName.codeBlock,
			componentsName.embed,
			componentsName.emptyMedia,
			componentsName.image,
			componentsName.list,
			componentsName.separator,
			componentsName.table,
			componentsName.todoList,
			componentsName.video,
		],
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
	},
} satisfies AccordionItemDefinition;
