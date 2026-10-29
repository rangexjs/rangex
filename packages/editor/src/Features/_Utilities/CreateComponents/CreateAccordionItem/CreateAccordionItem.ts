import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createHTMLLayout,
	createNestedEditable,
} from "@rangex/core";
import { componentsName } from "#constants";
import { toDOMAttrs } from "#dom-attrs";
import { createAccordionItemStorage } from "#storage";
import type {
	CreateAccordionItemParams,
	CreateAccordionItemResult,
} from "./CreateAccordionItem-types";

/*
 * Builds an accordion item block component: a collapsible `details`/`summary` element with
 * a single-line editable summary, and a multi-line editable body, with the given
 * attributes of its line and `details`. They aren't validated here.
 */
export const createAccordionItem = ({
	attrs,
	childNodes,
}: CreateAccordionItemParams): CreateAccordionItemResult => {
	const summaryNestedEditable = createNestedEditable({
		display: "block single-line",
		editState: "inherit",
		allowedComponents: null,
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
		childNodes: [
			createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
		],
	});

	const bodyNestedEditable = createNestedEditable({
		display: "block multi-line",
		editState: "inherit",
		allowedComponents: null,
		allowedContentLineLocalNames: null,
		allowedContentLineStyleAttrNames: null,
		allowedGlyphFormatterStyleAttrNames: null,
		allowedGlyphFormatterInlineTags: null,
		childNodes: childNodes ?? [
			createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
		],
	});

	const blockComponentLine = createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.accordionItem,
			content: { type: "custom" },
			customStorage: createAccordionItemStorage(),
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: false,
			editState: "inherit",
			childNodes: [
				createHTMLLayout({
					localName: "details",
					domAttrs: toDOMAttrs(attrs.details),
					childNodes: [
						createHTMLLayout({
							localName: "summary",
							childNodes: [summaryNestedEditable],
						}),
						bodyNestedEditable,
					],
				}),
			],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});

	return blockComponentLine;
};
