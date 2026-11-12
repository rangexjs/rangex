import { caretAnchorRoleSelector, EditorRange } from "@rangex/core";

import type { PositionToSelectionParams } from "./PositionToSelection-types";

/**
 * Returns the bottom y-coordinate of the character.
 */
const getEndCharBottom = (node: Text, offset: number) => {
	const range = document.createRange();
	if (offset > 0) {
		range.setStart(node, offset - 1);
		range.setEnd(node, offset);
	} else {
		range.setStart(node, offset);
		range.setEnd(node, offset + 1);
	}

	const { bottom } = range.getBoundingClientRect();

	return bottom;
};

/**
 * Anchors the popover to rootEditable — CSS Anchor Positioning requires a DOM element.
 * Manually offsets it to center below the selection.
 */
export const positionToSelection = ({
	editorAPI,
	controller,
	topMargin,
}: PositionToSelectionParams) => {
	const { rootEditable } = editorAPI;

	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } = selection.getBoundaryPoints();

	const range = new EditorRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	if (range.isSinglePoint) {
		const caretAnchor = editorAPI.shadowRoot.querySelector<HTMLElement>(caretAnchorRoleSelector);

		if (!caretAnchor) {
			throw new Error("CaretAnchor can't be null.");
		}

		controller.show(caretAnchor, {
			clear: true,
			position: "fixed",
			margin: `${topMargin}px 0px 0px 0px`,
			"position-area": "center bottom",
		});
		return;
	}

	controller.show(rootEditable, { clear: true, position: "fixed" });

	const rootEditableRect = rootEditable.getBoundingClientRect();
	const rangeRect = range.getBoundingClientRect();

	const selectionBottom = getEndCharBottom(toText, toOffset);

	const topDistance = selectionBottom - rootEditableRect.top + topMargin;
	const leftDistance =
		rangeRect.left -
		rootEditableRect.left +
		rangeRect.width / 2 -
		controller.element.offsetWidth / 2;

	controller.show(rootEditable, {
		top: `calc(anchor(top) + ${topDistance}px)`,
		left: `calc(anchor(left) + ${leftDistance}px)`,
	});
};
