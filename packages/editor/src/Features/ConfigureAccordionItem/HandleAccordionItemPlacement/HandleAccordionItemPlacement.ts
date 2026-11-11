import { blockComponentRole, blockComponentRoleSelector } from "@rangex/core";

import {
	createAccordionItem,
	getAccordionItemParts,
	validateAccordionItemPlacement,
} from "../../_Utilities";
import type {
	CreateValidAccordionItemParams,
	CreateValidAccordionItemResult,
	HandleAccordionItemPlacementParams,
} from "./HandleAccordionItemPlacement-types";

/*
 * Builds the AccordionItem with the given attributes and returns its parts, or null if the attributes are invalid.
 */
const createValidAccordionItem = ({
	configPort,
	attrs,
}: CreateValidAccordionItemParams): CreateValidAccordionItemResult => {
	const placementMismatch = validateAccordionItemPlacement({
		attrValidators: configPort.attrValidators,
		attrs,
	});

	if (placementMismatch) {
		console.warn(placementMismatch);
		return null;
	}

	const accordionItemLine = createAccordionItem({ attrs });
	const accordionItem = accordionItemLine.$$querySelector(blockComponentRoleSelector);

	if (accordionItem?.$$editorRole !== blockComponentRole) {
		throw new Error("AccordionItem's type is invalid.");
	}

	return getAccordionItemParts({ blockComponent: accordionItem });
};

/*
 * Handles inserting and wrapping accordion item components by selection, placing the caret
 * inside the newly created editable and registering a snapshot boundary. Returns a cleanup function.
 */
export const handleAccordionItemPlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemPlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribeInsert = configPort.onInsert(({ attrs }) => {
		const accordionItemParts = createValidAccordionItem({ configPort, attrs });

		if (!accordionItemParts) {
			return;
		}

		const { line: accordionItemLine, summaryNestedEditable } = accordionItemParts;

		blockComponentPlacement.insertBySelection({
			lines: [accordionItemLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: summaryNestedEditable,
			fromOffset: 0,
			toNode: summaryNestedEditable,
			toOffset: 0,
		});

		editorAPI.focus();
	});

	const unsubscribeWrap = configPort.onWrap(({ attrs }) => {
		const accordionItemParts = createValidAccordionItem({ configPort, attrs });

		if (!accordionItemParts) {
			return;
		}

		const { line: accordionItemLine, bodyNestedEditable } = accordionItemParts;

		blockComponentPlacement.wrapBySelection({
			blockComponentLine: accordionItemLine,
			target: bodyNestedEditable,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: bodyNestedEditable,
			fromOffset: bodyNestedEditable.$$childNodes.length,
			toNode: bodyNestedEditable,
			toOffset: bodyNestedEditable.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribeInsert();
		unsubscribeWrap();
	};
};
