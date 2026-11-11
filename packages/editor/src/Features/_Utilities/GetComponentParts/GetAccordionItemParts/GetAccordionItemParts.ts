import {
	blockComponentLineRole,
	htmlLayoutRole,
	nestedEditableRole,
} from "@rangex/core";
import type {
	GetAccordionItemPartsParams,
	GetAccordionItemPartsResult,
} from "./GetAccordionItemParts-types";

/*
 * Returns the AccordionItem's parts: its line, the BlockComponentLine it's in, its block, the BlockComponent itself, its
 * details, the `details` HTMLLayout that must be its first child, and its editables: the single-line summary editable
 * (the first child of `summary`, the first child of `details`) and the multi-line body editable (the second child of
 * `details`).
 */
export const getAccordionItemParts = ({
	blockComponent,
}: GetAccordionItemPartsParams): GetAccordionItemPartsResult => {
	const line = blockComponent.$$parentElement;

	if (line?.$$editorRole !== blockComponentLineRole) {
		throw new Error("AccordionItem must be in a BlockComponentLine.");
	}

	const [details] = blockComponent.$$childNodes;

	if (
		!details ||
		details.$$editorRole !== htmlLayoutRole ||
		details.$$localName !== "details"
	) {
		throw new Error("AccordionItem's first child must be the details.");
	}

	const [summary, bodyNestedEditable] = details.$$childNodes;

	if (
		!summary ||
		summary.$$editorRole !== htmlLayoutRole ||
		summary.$$localName !== "summary"
	) {
		throw new Error("Details' first child must be the summary.");
	}

	if (bodyNestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("Details' second child must be the body NestedEditable.");
	}

	const [summaryNestedEditable] = summary.$$childNodes;

	if (summaryNestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error(
			"Summary's first child must be the summary NestedEditable.",
		);
	}

	return {
		line,
		block: blockComponent,
		details,
		summaryNestedEditable,
		bodyNestedEditable,
	};
};
