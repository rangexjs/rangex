import type {
	GetEmojiQueryParams,
	GetEmojiQueryResult,
} from "./GetEmojiQuery-types";

/*
 * Scans backward from the cursor to find a :-triggered emoji query, stopping early on whitespace
 * or once a character limit is reached. When `hasClosingColon` is set, skips the shortcode's own
 * closing ':' first and keeps scanning for the query's opening ':'. Returns null if none is found.
 */
export const getEmojiQuery = ({
	editorAPI,
	fromText,
	fromOffset,
	hasClosingColon,
}: GetEmojiQueryParams): GetEmojiQueryResult => {
	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
		direction: "backward",
	});

	const charLimit = 50;

	let i = 0;
	let skippedClosingColon = false;

	for (const { toText, toOffset, data } of plainTextScanner) {
		if (i++ >= charLimit) {
			return null;
		}

		// Stop if the leftmost accumulated character is whitespace — no valid emoji
		// query can span whitespace, so the : must appear before the space.
		if (/\s/.test(data[0])) {
			return null;
		}

		if (!data.startsWith(":")) {
			continue;
		}

		if (hasClosingColon && !skippedClosingColon) {
			skippedClosingColon = true;
			continue;
		}

		const query = hasClosingColon ? data.slice(1, -1) : data.slice(1);

		// Require at least one character between the colons before showing the popover
		if (!query.length) {
			return null;
		}

		return { toText, toOffset, query };
	}

	return null;
};
