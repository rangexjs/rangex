import { getCommandMenuQuery } from "../_Utilities";
import type {
	HandleBeforeSelectParams,
	RemoveCommandMenuQueryTextParams,
	RemoveCommandMenuQueryTextResult,
} from "./HandleBeforeSelect-types";

/**
 * Removes the /query text (e.g. "/quote") that triggered the menu, before the selected item's
 * own action runs — the item's action reads the selection fresh, so it sees the cursor already
 * sitting where the `/` used to be.
 */
const removeCommandMenuQueryText = ({
	editorAPI,
}: RemoveCommandMenuQueryTextParams): RemoveCommandMenuQueryTextResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	const commandMenuQuery = getCommandMenuQuery({
		editorAPI,
		fromText,
		fromOffset,
	});

	if (!commandMenuQuery) {
		return { queryFound: false };
	}

	const { toText, toOffset } = commandMenuQuery;

	editorAPI.removeNodesInRange({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	return { queryFound: true };
};

/**
 * Subscribes to the popover's before-select event and strips the /query text first, so whichever
 * extension's action runs next inserts at the position the `/` used to be.
 */
export const handleBeforeSelect = ({
	editorPort,
	editorAPI,
}: HandleBeforeSelectParams) => {
	const unsubscribe = editorPort.onBeforeSelect(() => {
		const { queryFound } = removeCommandMenuQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleBeforeSelect: no /query found at cursor — an item was selected but the trigger text could not be located.",
			);
		}
	});

	return () => {
		unsubscribe();
	};
};
