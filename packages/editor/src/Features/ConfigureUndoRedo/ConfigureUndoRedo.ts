import type { ConfigureUndoRedoParams } from "./ConfigureUndoRedo-types";
import { handleUndoRedoButtonState } from "./HandleUndoRedoButtonState";
import { handleUndoRedoNavigation } from "./HandleUndoRedoNavigation";

export const configureUndoRedo = ({
	configPort,
	editorAPI,
}: ConfigureUndoRedoParams) => {
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
