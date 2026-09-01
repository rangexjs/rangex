import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createDetachedContext,
	createHTMLLayout,
	createNestedEditable,
} from "rich-text-area";
import { blockAlignAttr, componentsName } from "../../../../Constants";
import { createAccordionItemStorage } from "../../../../Storage";
import { CaretCircleLeft } from "../../../../SVGs";
import { createUploadSVG } from "../../CreateUploadSVG";
import type {
	CreateAccordionItemParams,
	CreateAccordionItemResult,
} from "./CreateAccordionItem-types";

export const createAccordionItem = ({
	childNodes,
}: CreateAccordionItemParams): CreateAccordionItemResult => {
	const summaryNestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block single-line",
		childNodes: [
			createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
		],
	});

	const bodyNestedEditable = createNestedEditable({
		content: { type: "default" },
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
			componentName: componentsName.accordionItem,
			content: { type: "custom" },
			customStorage: createAccordionItemStorage(),
			shouldSelectBeforeRemove: true,
			childNodes: [
				createHTMLLayout({
					localName: "details",
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

	return { blockComponentLine, summaryNestedEditable };
};
