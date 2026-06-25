import type {
	GetEmojiAutoCompleteParams,
	GetEmojiAutoCompleteResult,
	GetEmojiQueryParams,
	GetEmojiQueryResult,
} from "./Utilities-types";

/**
 * Scans backward from the cursor to find a :-triggered emoji query.
 * Stops early if whitespace is encountered before reaching the colon.
 * Returns null if no : is found, if the query is empty, or if the char limit is reached.
 */
export const getEmojiQuery = ({
	editorAPI,
	fromText,
	fromOffset,
}: GetEmojiQueryParams): GetEmojiQueryResult => {
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

		// Stop if the leftmost accumulated character is whitespace — no valid emoji
		// query can span whitespace, so the : must appear before the space.
		if (/\s/.test(data[0])) {
			return null;
		}

		if (!data.startsWith(":")) {
			continue;
		}

		const query = data.slice(1);

		// Require at least one character after : before showing the popover
		if (!query.length) {
			return null;
		}

		return { toText, toOffset, query };
	}

	return null;
};

/**
 * Scans backward from the cursor to detect a completed :<name>: shortcode.
 * Requires the char immediately before the cursor to be ':' (the closing colon).
 * Stops if whitespace is encountered before the opening colon is found.
 * Returns the matched name and the position of the opening colon, or null.
 */
export const getEmojiAutoComplete = ({
	editorAPI,
	fromText,
	fromOffset,
}: GetEmojiAutoCompleteParams): GetEmojiAutoCompleteResult => {
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

		if (/\s/.test(data[0])) {
			return null;
		}

		// data[data.length - 1] is always the char right before the cursor (the first
		// character accumulated). If it isn't ':', the closing colon is missing.
		if (data[data.length - 1] !== ":") {
			return null;
		}

		// Opening colon not yet reached, or still at the closing colon itself (length 1)
		if (data[0] !== ":" || data.length === 1) {
			continue;
		}

		// data = ":<name>:" — but "::" has an empty name
		if (data.length < 3) {
			return null;
		}

		const name = data.slice(1, -1);

		return { name, toText, toOffset };
	}

	return null;
};
