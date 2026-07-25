import type { ConfigureUndoRedoParams } from "./ConfigureUndoRedo-types";
import { handleUndoRedoButtonState } from "./HandleUndoRedoButtonState";
import { handleUndoRedoNavigation } from "./HandleUndoRedoNavigation";

export const configureUndoRedo = ({
	editorPort,
	editorAPI,
}: ConfigureUndoRedoParams) => {
	const navigationCleanup = handleUndoRedoNavigation({
		editorPort,
		editorAPI,
	});

	const buttonStateCleanup = handleUndoRedoButtonState({
		editorPort,
		editorAPI,
	});

	return () => {
		navigationCleanup();
		buttonStateCleanup();
	};
};
