import { componentsName } from "#ports";
import { getClosestScopedEditable } from "../../../NodeQuery";
import type {
	CanInsertMentionParams,
	GetMentionQueryParams,
	GetMentionQueryResult,
} from "./Utilities-types";

/**
 * Returns true if the closest ScopedEditable from startText allows the mention component.
 */
export const canInsertMention = ({
	fromText,
}: CanInsertMentionParams): boolean => {
	const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

	if (!scopedEditable) {
		throw new Error("ScopedEditable can't be null.");
	}

	const { $$allowedComponents } = scopedEditable;

	const isAllowed =
		$$allowedComponents === null ||
		$$allowedComponents.includes(componentsName.mention);

	return isAllowed;
};

/**
 * Scans backward from the cursor to find an @-triggered mention query.
 * Returns null if no @ is found within the char limit.
 */
export const getMentionQuery = ({
	editorAPI,
	fromText,
	fromOffset,
}: GetMentionQueryParams): GetMentionQueryResult => {
	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset: fromOffset,
		direction: "backward",
	});

	// If the @ was not found in the first hundred chars, we stop scanning
	const charLimit = 100;

	let i = 0;

	for (const { toText, toOffset, data } of plainTextScanner) {
		if (i++ >= charLimit) {
			return null;
		}

		if (!data.startsWith("@")) {
			continue;
		}

		const query = data.slice(1);

		return { toText, toOffset, query };
	}

	return null;
};
