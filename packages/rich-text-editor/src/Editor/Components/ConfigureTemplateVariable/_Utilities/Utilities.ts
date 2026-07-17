import { componentsName } from "../../../Constants";
import { getClosestScopedEditable } from "../../../NodeQuery";
import type {
	CanInsertTemplateVariableParams,
	GetTemplateVariableQueryParams,
	GetTemplateVariableQueryResult,
} from "./Utilities-types";

/**
 * Returns true if the closest ScopedEditable from fromText allows the template-variable component.
 */
export const canInsertTemplateVariable = ({
	fromText,
}: CanInsertTemplateVariableParams): boolean => {
	const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

	if (!scopedEditable) {
		throw new Error("ScopedEditable can't be null.");
	}

	const { $$allowedComponents } = scopedEditable;

	const isAllowed =
		$$allowedComponents === null ||
		$$allowedComponents.includes(componentsName.templateVariable);

	return isAllowed;
};

/**
 * Scans backward from the cursor to find a {{-triggered template variable query.
 * Returns null if {{ is not found within the char limit.
 */
export const getTemplateVariableQuery = ({
	editorAPI,
	fromText,
	fromOffset,
}: GetTemplateVariableQueryParams): GetTemplateVariableQueryResult => {
	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset: fromOffset,
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
