import { createFormattableTexts } from "rich-text-area";
import { componentsName } from "../../../Constants";
import type { HandleReplacementParams } from "./HandleReplacement-types";

/** Performs single or bulk text replacement in response to replace actions. */
export const handleReplacement = ({
	richTextEditorUI,
	editorAPI,
}: HandleReplacementParams) => {
	const findReplace = editorAPI.getFindReplace();

	const retainedComponents = [componentsName.link];

	richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const { action, replaceText } = params;

		const content = replaceText
			? createFormattableTexts({ data: replaceText })
			: [];

		if (action === "replace") {
			findReplace.replace({ content, retainedComponents });
		}

		if (action === "replace-all") {
			findReplace.replaceAll({ content, retainedComponents });
		}
	});
};
