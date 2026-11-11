import { componentsName } from "#constants";
import { getClosestScopedEditable } from "#engine-links";

import type { GetCaretMenuQueryFn } from "../../../_Utilities";
import type { CanInsertMentionParams } from "./GetMentionQuery-types";

/*
 * Returns true if the closest ScopedEditable from fromText allows the mention component.
 */
export const canInsertMention = ({ fromText }: CanInsertMentionParams): boolean => {
	const scopedEditable = getClosestScopedEditable({ fromNode: fromText });

	if (!scopedEditable) {
		throw new Error("ScopedEditable can't be null.");
	}

	const { $$allowedComponents } = scopedEditable;

	return $$allowedComponents === null || $$allowedComponents.includes(componentsName.mention);
};

/*
 * Scans backward from the cursor to find an @-triggered mention query. Returns null if the
 * surrounding ScopedEditable doesn't allow mentions, or @ isn't found within the char limit.
 */
export const getMentionQuery: GetCaretMenuQueryFn = ({ editorAPI, fromText, fromOffset }) => {
	if (!canInsertMention({ fromText })) {
		return null;
	}

	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
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
