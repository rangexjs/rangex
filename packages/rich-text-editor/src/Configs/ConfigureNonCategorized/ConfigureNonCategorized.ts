import type { ConfigureNonCategorizedParams } from "./ConfigureNonCategorized-types";

export const configureNonCategorized = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureNonCategorizedParams) => {
	return richTextEditorUI.onNonCategorizedOperation((props) => {
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
};
