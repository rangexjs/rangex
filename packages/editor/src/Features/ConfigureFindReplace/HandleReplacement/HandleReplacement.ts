import { createFormattableTexts } from "@rangex/core";

import { componentsName } from "#constants";

import type { HandleReplacementParams } from "./HandleReplacement-types";

/*
 * Performs single or bulk text replacement in response to replace actions.
 */
export const handleReplacement = ({ configPort, editorAPI }: HandleReplacementParams) => {
	const findReplace = editorAPI.getFindReplace();

	const retainedComponents = [componentsName.link];

	const replaceCleanup = configPort.onReplace(({ replaceText }) => {
		const content = replaceText ? createFormattableTexts({ data: replaceText }) : [];

		findReplace.replace({ content, retainedComponents });
	});

	const replaceAllCleanup = configPort.onReplaceAll(({ replaceText }) => {
		const content = replaceText ? createFormattableTexts({ data: replaceText }) : [];

		findReplace.replaceAll({ content, retainedComponents });
	});

	return () => {
		replaceCleanup();
		replaceAllCleanup();
	};
};
