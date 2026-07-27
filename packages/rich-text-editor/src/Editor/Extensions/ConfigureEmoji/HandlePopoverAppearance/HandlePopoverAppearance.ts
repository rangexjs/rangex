import {
	EditorRange,
	type EditorSelectionChangeCallbackFn,
	editorSelectionChangeEventType,
} from "rich-text-area";
import { positionPopoverToSelection } from "../../../_Utilities";
import { getEmojiQuery } from "../_Utilities";
import type { HandlePopoverAppearanceParams } from "./HandlePopoverAppearance-types";

/**
 * Subscribes to selection changes and shows the popover whenever a :query is detected at the cursor.
 * Does not hide — hiding is handled by handlePopoverClose, which must be subscribed first.
 */
export const handlePopoverAppearance = ({
	editorPort,
	editorAPI,
}: HandlePopoverAppearanceParams) => {
	const selection = editorAPI.getEditorSelection();

	const editorSelectionChangeCallback: EditorSelectionChangeCallbackFn = () => {
		const { fromText, fromOffset, toText, toOffset } =
			selection.getBoundaryPoints();

		const range = new EditorRange({
			fromNode: fromText,
			fromOffset,
			toNode: toText,
			toOffset,
		});

		// Emoji trigger only works from a collapsed cursor, not a range selection
		if (!range.isSinglePoint) {
			return;
		}

		const { startText, startOffset } = range;

		const emojiQuery = getEmojiQuery({
			editorAPI,
			fromText: startText,
			fromOffset: startOffset,
		});

		if (!emojiQuery) {
			return;
		}

		const { query } = emojiQuery;

		editorPort.updateState({ query });

		if (!editorPort.filteredItems.length) {
			return;
		}

		editorPort.popover.mount();

		positionPopoverToSelection({
			editorAPI,
			popover: editorPort.popover.element,
			topMargin: 8,
		});
	};

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: editorSelectionChangeCallback,
	});

	return () => {
		unsubscribe();
	};
};
