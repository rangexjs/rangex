import type { HandleReadOnlyToggleParams } from "./HandleReadOnlyToggle-types";

export const handleReadOnlyToggle = ({
	editorPort,
	editorAPI,
}: HandleReadOnlyToggleParams) => {
	const isTextAreaEditable = editorAPI.getIsTextAreaEditable();

	editorPort.updateState({
		toolbarButton: { checked: !isTextAreaEditable },
	});

	const unsubscribe = editorPort.onToggle(({ newState }) => {
		editorAPI.setIsTextAreaEditable(!newState);

		const readOnly = !editorAPI.getIsTextAreaEditable();

		editorPort.updateState({ toolbarButton: { checked: readOnly } });
	});

	return () => {
		unsubscribe();
	};
};
