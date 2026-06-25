import type { HandleNonCategorizedOperationParams } from "./HandleNonCategorizedOperation-types";

export const handleNonCategorizedOperation = ({
	richTextEditorUI,
	editorAPI,
}: HandleNonCategorizedOperationParams) => {
	const unsubscribe = richTextEditorUI.onNonCategorizedOperation((props) => {
		const { type } = props;

		if (type === "text-area-readability") {
			const { newState } = props;

			editorAPI.setIsTextAreaEditable(!newState);

			const checked = !editorAPI.getIsTextAreaEditable();

			richTextEditorUI.updateNonCategorizedButtonState({
				textAreaReadability: { checked },
			});
		}
	});

	return () => {
		unsubscribe();
	};
};
