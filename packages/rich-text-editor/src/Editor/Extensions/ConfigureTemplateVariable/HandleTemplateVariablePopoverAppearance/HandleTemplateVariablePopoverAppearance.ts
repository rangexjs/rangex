import {
	EditorRange,
	type EditorSelectionChangeCallbackFn,
	editorSelectionChangeEventType,
} from "rich-text-area";
import { positionPopoverToSelection } from "../../../_Utilities";
import {
	canInsertTemplateVariable,
	getTemplateVariableQuery,
} from "../_Utilities";
import type { HandleTemplateVariablePopoverAppearanceParams } from "./HandleTemplateVariablePopoverAppearance-types";

/**
 * Subscribes to selection changes and shows the popover whenever a {{query is detected at the cursor.
 * Does not hide — hiding is handled by handleTemplateVariablePopoverClose, which must be subscribed first.
 */
export const handleTemplateVariablePopoverAppearance = ({
	editorPort,
	editorAPI,
}: HandleTemplateVariablePopoverAppearanceParams) => {
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

		// Template variables only trigger from a collapsed cursor, not a range selection
		if (!range.isSinglePoint) {
			return;
		}

		const { startText, startOffset } = range;

		if (!canInsertTemplateVariable({ fromText: startText })) {
			return;
		}

		const templateVariableQuery = getTemplateVariableQuery({
			editorAPI,
			fromText: startText,
			fromOffset: startOffset,
		});

		if (!templateVariableQuery) {
			return;
		}

		const { query } = templateVariableQuery;

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
