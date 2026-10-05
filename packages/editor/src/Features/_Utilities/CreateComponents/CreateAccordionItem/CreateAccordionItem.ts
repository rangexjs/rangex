import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createDetachedContext,
	createHTMLLayout,
	createNestedEditable,
	nestedEditableRole,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { blockAlignAttr, CaretCircleLeft, componentsName } from "#engine-links";
import { createAccordionItemStorage } from "#storage";
import { createUploadSVG } from "../../CreateUploadSVG";
import type {
	CreateAccordionItemParams,
	CreateAccordionItemResult,
	GetAccordionItemPartsParams,
	GetAccordionItemPartsResult,
} from "./CreateAccordionItem-types";

/*
 * Returns the accordion item's editable parts: the single-line summary editable (the
 * NestedEditable directly inside `summary`) and the multi-line body editable (the
 * NestedEditable directly inside `details`).
 */
export const getAccordionItemParts = ({
	accordionItem,
}: GetAccordionItemPartsParams): GetAccordionItemPartsResult => {
	const summaryNestedEditable = accordionItem.$$querySelector(
		`summary > ${nestedEditableRoleSelector}`,
	);

	if (summaryNestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("SummaryNestedEditable's type is invalid.");
	}

	const bodyNestedEditable = accordionItem.$$querySelector(
		`details > ${nestedEditableRoleSelector}`,
	);

	if (bodyNestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("BodyNestedEditable's type is invalid.");
	}

	return { summaryNestedEditable, bodyNestedEditable };
};

/*
 * Builds an accordion item block component: a collapsible `details`/`summary` element with
 * a chevron icon, a single-line editable summary, and a multi-line editable body. `open` sets
 * the `details` element's initial expanded state.
 */
export const createAccordionItem = ({
	open = false,
	childNodes,
}: CreateAccordionItemParams): CreateAccordionItemResult => {
	const summaryNestedEditable = createNestedEditable({
		display: "block single-line",
		childNodes: [
			createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
		],
	});

	const bodyNestedEditable = createNestedEditable({
		display: "block multi-line",
		childNodes: childNodes ?? [
			createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
		],
	});

	const svg = createUploadSVG({ svgMarkup: CaretCircleLeft });
	svg.setAttribute("part", "chevron");

	const blockComponentLine = createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.accordionItem,
			content: { type: "custom" },
			customStorage: createAccordionItemStorage(),
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "details",
					domAttrs: { open: open ? "" : undefined },
					childNodes: [
						createHTMLLayout({
							localName: "summary",
							childNodes: [
								summaryNestedEditable,
								createDetachedContext({ localName: "span", shadowTree: [svg] }),
							],
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
