import { createFormattableTexts } from "rich-text-area";
import { componentsName } from "#ports";
import type { HandleReplacementParams } from "./HandleReplacement-types";

/** Performs single or bulk text replacement in response to replace actions. */
export const handleReplacement = ({
	editorPort,
	editorAPI,
}: HandleReplacementParams) => {
	const findReplace = editorAPI.getFindReplace();

	const retainedComponents = [componentsName.link];

	const replaceCleanup = editorPort.onReplace(({ replaceText }) => {
		const content = replaceText
			? createFormattableTexts({ data: replaceText })
			: [];

		findReplace.replace({ content, retainedComponents });
	});

	const replaceAllCleanup = editorPort.onReplaceAll(({ replaceText }) => {
		const content = replaceText
			? createFormattableTexts({ data: replaceText })
			: [];

		findReplace.replaceAll({ content, retainedComponents });
	});

	return () => {
		replaceCleanup();
		replaceAllCleanup();
	};
};
