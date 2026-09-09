import type {
	GetEmojiQueryParams,
	GetEmojiQueryResult,
} from "./GetEmojiQuery-types";

/**
 * Scans backward from the cursor to find a :-triggered emoji query.
 * Stops early if whitespace is encountered before reaching the colon.
 * Returns null if no : is found, if the query is empty, or if the char limit is reached.
 *
 * When `hasClosingColon` is set, the first ':' reached is the shortcode's own closing
 * ':' rather than the query's opening one — it is skipped, and the scan continues for
 * the real opening ':' further back.
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
