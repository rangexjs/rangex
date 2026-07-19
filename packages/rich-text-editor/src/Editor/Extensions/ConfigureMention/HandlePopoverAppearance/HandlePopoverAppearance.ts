import {
	EditorRange,
	type EditorSelectionChangeCallbackFn,
	editorSelectionChangeEventType,
} from "rich-text-area";
import { positionPopoverToSelection } from "../../../_Utilities";
import { canInsertMention, getMentionQuery } from "../_Utilities";
import type { HandlePopoverAppearanceParams } from "./HandlePopoverAppearance-types";

/**
 * Subscribes to selection changes and shows the popover whenever an @query is detected at the cursor.
 * Does not hide — hiding is handled by handlePopoverClose, which must be subscribed first.
 */
export const handlePopoverAppearance = ({
	editorPort,
	editorAPI,
}: HandlePopoverAppearanceParams) => {
	const { popover } = editorPort;

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

		// Mentions only trigger from a collapsed cursor, not a range selection
		if (!range.isSinglePoint) {
			return;
		}

		const { startText, startOffset } = range;

		if (!canInsertMention({ fromText: startText })) {
			return;
		}

		const mentionQuery = getMentionQuery({
			editorAPI,
			fromText: startText,
			fromOffset: startOffset,
		});

		if (!mentionQuery) {
			return;
		}

		const { query } = mentionQuery;

		editorPort.updateState({ query });

		if (!editorPort.filteredItems.length) {
			return;
		}

		positionPopoverToSelection({ editorAPI, popover, topMargin: 8 });

		popover.showPopover();
	};

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: editorSelectionChangeCallback,
	});

	return () => {
		unsubscribe();
	};
};
