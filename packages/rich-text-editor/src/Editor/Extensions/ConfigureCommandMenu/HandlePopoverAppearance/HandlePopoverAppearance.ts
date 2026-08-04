import {
	EditorRange,
	type EditorSelectionChangeCallbackFn,
	editorSelectionChangeEventType,
} from "rich-text-area";
import { positionToSelection } from "../../../_Utilities";
import { canInsertCommandMenu, getCommandMenuQuery } from "../_Utilities";
import type { HandlePopoverAppearanceParams } from "./HandlePopoverAppearance-types";

/**
 * Subscribes to selection changes and shows the popover whenever a /query is detected at the
 * cursor. Does not hide — hiding is handled by handlePopoverClose, which must be subscribed first.
 */
export const handlePopoverAppearance = ({
	editorPort,
	editorAPI,
	anchorController,
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

		// Slash commands only trigger from a collapsed cursor, not a range selection
		if (!range.isSinglePoint) {
			return;
		}

		const { startText, startOffset } = range;

		if (!canInsertCommandMenu({ fromText: startText })) {
			return;
		}

		const commandMenuQuery = getCommandMenuQuery({
			editorAPI,
			fromText: startText,
			fromOffset: startOffset,
		});

		if (!commandMenuQuery) {
			return;
		}

		const { query } = commandMenuQuery;

		editorPort.updateState({ query });

		if (!editorPort.filteredItems.size) {
			return;
		}

		positionToSelection({
			editorAPI,
			controller: anchorController,
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
