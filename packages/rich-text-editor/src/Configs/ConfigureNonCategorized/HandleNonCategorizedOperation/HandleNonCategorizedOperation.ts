import type {
	HandleNonCategorizedOperationParams,
	SetupInitialStatesParams,
} from "./HandleNonCategorizedOperation-types";

const setupInitialStates = ({
	richTextEditorUI,
	editorAPI,
}: SetupInitialStatesParams) => {
	const isTextAreaEditable = editorAPI.getIsTextAreaEditable();

	richTextEditorUI.updateNodeInsertionButtonState({
		symbols: { disabled: !isTextAreaEditable },
	});

	richTextEditorUI.updateNonCategorizedButtonState({
		textAreaReadability: { checked: !isTextAreaEditable },
	});
};

export const handleNonCategorizedOperation = ({
	richTextEditorUI,
	editorAPI,
}: HandleNonCategorizedOperationParams) => {
	setupInitialStates({ richTextEditorUI, editorAPI });

	const unsubscribe = richTextEditorUI.onNonCategorizedOperation((props) => {
		const { type } = props;

		if (type === "text-area-readability") {
			const { newState } = props;

			editorAPI.setIsTextAreaEditable(!newState);

			const textAreaReadonly = !editorAPI.getIsTextAreaEditable();

			richTextEditorUI.updateNodeInsertionButtonState({
				symbols: { disabled: textAreaReadonly },
			});

			richTextEditorUI.updateNonCategorizedButtonState({
				textAreaReadability: { checked: textAreaReadonly },
			});
		}
	});

	return () => {
		unsubscribe();
	};
};
