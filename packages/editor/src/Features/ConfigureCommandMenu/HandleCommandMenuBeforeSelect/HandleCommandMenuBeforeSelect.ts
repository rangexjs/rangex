import { getCommandMenuQuery } from "../_Utilities";
import type {
	HandleCommandMenuBeforeSelectParams,
	RemoveCommandMenuQueryTextParams,
	RemoveCommandMenuQueryTextResult,
} from "./HandleCommandMenuBeforeSelect-types";

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

/*
 * Strips the triggering /query text before a command menu item is selected, so the selected
 * item's action inserts at the position the `/` used to be. Returns a cleanup function.
 */
export const handleCommandMenuBeforeSelect = ({
	configPort,
	editorAPI,
}: HandleCommandMenuBeforeSelectParams) => {
	const unsubscribe = configPort.onBeforeSelect(() => {
		const { queryFound } = removeCommandMenuQueryText({ editorAPI });

		if (!queryFound) {
			console.warn(
				"handleCommandMenuBeforeSelect: no /query found at cursor — an item was selected but the trigger text could not be located.",
			);
		}
	});

	return () => {
		unsubscribe();
	};
};
