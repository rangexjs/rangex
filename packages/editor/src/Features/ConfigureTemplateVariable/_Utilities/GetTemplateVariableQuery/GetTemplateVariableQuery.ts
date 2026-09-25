import { componentsName, getClosestScopedEditable } from "#engine-links";
import type { GetCaretMenuQueryFn } from "../../../_Utilities";
import type { CanInsertTemplateVariableParams } from "./GetTemplateVariableQuery-types";

/*
 * Returns true if the closest ScopedEditable from fromText allows the template-variable
 * component.
 */
export const canInsertTemplateVariable = ({
	fromText,
}: CanInsertTemplateVariableParams): boolean => {
	const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

	if (!scopedEditable) {
		throw new Error("ScopedEditable can't be null.");
	}

	const { $$allowedComponents } = scopedEditable;

	return (
		$$allowedComponents === null ||
		$$allowedComponents.includes(componentsName.templateVariable)
	);
};

/*
 * Scans backward from the cursor to find a {{-triggered template variable query. Returns null
 * if the surrounding ScopedEditable doesn't allow template variables, or {{ isn't found within
 * the char limit.
 */
export const getTemplateVariableQuery: GetCaretMenuQueryFn = ({
	editorAPI,
	fromText,
	fromOffset,
}) => {
	if (!canInsertTemplateVariable({ fromText })) {
		return null;
	}

	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
		direction: "backward",
	});

	const charLimit = 50;

	let i = 0;

	for (const { toText, toOffset, data } of plainTextScanner) {
		if (i++ >= charLimit) {
			return null;
		}

		if (!data.startsWith("{{")) {
			continue;
		}

		const query = data.slice(2);

		return { toText, toOffset, query };
	}

	return null;
};
