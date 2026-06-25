import type { ConfigureTemplateVariableParams } from "./ConfigureTemplateVariable-types";
import { handleTemplateVariableInsertion } from "./HandleTemplateVariableInsertion";

export const configureTemplateVariable = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureTemplateVariableParams) => {
	const insertionCleanup = handleTemplateVariableInsertion({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		insertionCleanup();
	};
};
