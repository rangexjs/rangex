import type { ConfigureUndoRedoParams } from "./ConfigureUndoRedo-types";
import { handleUndoRedoButtonState } from "./HandleUndoRedoButtonState";
import { handleUndoRedoNavigation } from "./HandleUndoRedoNavigation";

/*
 * Wires up undo/redo button state and step navigation handling, returning a cleanup function.
 */
export const configureUndoRedo = ({ configPort, editorAPI }: ConfigureUndoRedoParams) => {
	const buttonStateCleanup = handleUndoRedoButtonState({
		configPort,
		editorAPI,
	});

	const navigationCleanup = handleUndoRedoNavigation({
		configPort,
		editorAPI,
	});

	return () => {
		buttonStateCleanup();
		navigationCleanup();
	};
};
