import {
	createBeamText,
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createContentLine,
	createDetachedContext,
	createHTMLLayout,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "#ports";
import { blockAlignAttr } from "../../../Constants";
import { createAccordionItemStorage } from "../../../Storage";
import { CaretCircleLeft } from "../../../SVGs";
import { createUploadSVG } from "../../_Utilities";
import type {
	CreateAccordionItemLineResult,
	HandleAccordionItemInsertionParams,
} from "./HandleAccordionItemInsertion-types";

const createAccordionItemLine = (): CreateAccordionItemLineResult => {
	const summaryNestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block single-line",
		childNodes: [
			createContentLine({ localName: "p", childNodes: [createBeamText()] }),
		],
	});

	const bodyNestedEditable = createNestedEditable({
		content: { type: "default" },
		display: "block multi-line",
		childNodes: [
			createContentLine({ localName: "p", childNodes: [createBeamText()] }),
		],
	});

	const svg = createUploadSVG({ svgMarkup: CaretCircleLeft });
	svg.setAttribute("part", "chevron");

	const blockNestedContextLine = createBlockNestedContextLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.accordionItem,
			content: { type: "custom" },
			customStorage: createAccordionItemStorage(),
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
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return { blockNestedContextLine, summaryNestedEditable };
};

export const handleAccordionItemInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(() => {
		const { blockNestedContextLine, summaryNestedEditable } =
			createAccordionItemLine();

		const trailingLine = createContentLine({
			localName: "p",
			childNodes: [createBeamText()],
		});

		blockComponentPlacement.insertBySelection({
			lines: [blockNestedContextLine, trailingLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: summaryNestedEditable,
			fromOffset: 0,
			toNode: summaryNestedEditable,
			toOffset: 0,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
