import { caretAnchorName, EditorRange } from "rich-text-area";
import type { PositionPopoverToSelectionParams } from "./PositionPopoverToSelection-types";

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
export const positionPopoverToSelection = ({
	editorAPI,
	popover,
	topMargin,
}: PositionPopoverToSelectionParams) => {
	const { rootEditable } = editorAPI;

	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const range = new EditorRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	if (range.isSinglePoint) {
		const caretAnchor =
			editorAPI.shadowRoot.querySelector<HTMLElement>(caretAnchorName);

		if (!caretAnchor) {
			throw new Error("CaretAnchor can't be null.");
		}

		popover.showPopover({ source: caretAnchor });

		popover.style.cssText = "";
		popover.style.positionArea = "center bottom";
		return;
	}

	popover.showPopover({ source: rootEditable });

	const rootEditableRect = rootEditable.getBoundingClientRect();
	const popoverRect = popover.getBoundingClientRect();
	const rangeRect = range.getBoundingClientRect();

	const selectionBottom = getEndCharBottom(toText, toOffset);

	const topDistance = selectionBottom - rootEditableRect.top + topMargin;
	const leftDistance =
		rangeRect.left -
		rootEditableRect.left +
		rangeRect.width / 2 -
		popoverRect.width / 2;

	popover.style.cssText = "";
	popover.style.top = `calc(anchor(top) + ${topDistance}px)`;
	popover.style.left = `calc(anchor(left) + ${leftDistance}px)`;
};
