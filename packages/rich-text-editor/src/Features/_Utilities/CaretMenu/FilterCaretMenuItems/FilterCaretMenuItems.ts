import type {
	FilterCaretMenuItemsParams,
	KeyMatch,
	MatchTier,
	RankedItem,
} from "./FilterCaretMenuItems-types";

const matchTier = {
	exact: 0,
	prefix: 1,
	wordStart: 2,
	substring: 3,
	subsequence: 4,
} as const satisfies Record<string, MatchTier>;

/*
 * Returns true if `index` starts a word in `key`: right after whitespace, `-` or `_`, or at a camelCase boundary.
 * - "lo rem", 3 -> previous char matches the separator regex (whitespace)
 * - "code-block", 5 -> previous char matches the separator regex (`-`)
 * - "todo_list", 5 -> previous char matches the separator regex (`_`)
 * - "JohnDoe", 4 -> previous char is lowercase, current is uppercase
 * - "isEmpty", 2 -> previous char is lowercase, current is uppercase
 */
const isWordStart = (key: string, index: number) => {
	const prevChar = key[index - 1];
	const char = key[index];

	if (/[\s\-_]/.test(prevChar)) {
		return true;
	}

	const isPrevLower = prevChar === prevChar.toLowerCase();
	const isUpper = char !== char.toLowerCase();

	return isPrevLower && isUpper;
};

/*
 * Returns the position of the first occurrence of `query` in `key` that starts a word, or -1.
 */
const findWordStartMatch = (key: string, lowerKey: string, query: string) => {
	// indexOf("", n) never advances past the key's end, so the loop below would never exit
	if (!query) {
		console.warn("Query can't be empty.");
		return -1;
	}

	// 0 is a prefix match (handled earlier) and has no previous char to check
	let index = lowerKey.indexOf(query, 1);

	while (index !== -1) {
		if (isWordStart(key, index)) {
			return index;
		}

		index = lowerKey.indexOf(query, index + 1);
	}

	return -1;
};

/*
 * Returns the position of the first character when every character of `query` appears in `lowerKey` in order, or -1.
 */
const findSubsequenceMatch = (lowerKey: string, query: string) => {
	let queryIndex = 0;
	let position = -1;

	for (let keyIndex = 0; keyIndex < lowerKey.length; keyIndex++) {
		if (lowerKey[keyIndex] !== query[queryIndex]) {
			continue;
		}

		if (queryIndex === 0) {
			position = keyIndex;
		}

		queryIndex++;

		if (queryIndex === query.length) {
			return position;
		}
	}

	return -1;
};

/*
 * Classifies how `key` matches the lowercased `query` into a tier (exact, prefix, word start, substring,
 * subsequence), or returns null if it doesn't match at all.
 */
const matchKey = (key: string, query: string): KeyMatch | null => {
	const lowerKey = key.toLowerCase();
	const keyLength = key.length;

	if (lowerKey === query) {
		return { tier: matchTier.exact, position: 0, keyLength };
	}

	if (lowerKey.startsWith(query)) {
		return { tier: matchTier.prefix, position: 0, keyLength };
	}

	const wordStartPosition = findWordStartMatch(key, lowerKey, query);

	if (wordStartPosition !== -1) {
		return {
			tier: matchTier.wordStart,
			position: wordStartPosition,
			keyLength,
		};
	}

	const substringPosition = lowerKey.indexOf(query);

	if (substringPosition !== -1) {
		return {
			tier: matchTier.substring,
			position: substringPosition,
			keyLength,
		};
	}

	const subsequencePosition = findSubsequenceMatch(lowerKey, query);

	if (subsequencePosition !== -1) {
		return {
			tier: matchTier.subsequence,
			position: subsequencePosition,
			keyLength,
		};
	}

	return null;
};

/*
 * Orders matches by tier, then match position, then key length.
 */
const compareMatches = (a: KeyMatch, b: KeyMatch) =>
	a.tier - b.tier || a.position - b.position || a.keyLength - b.keyLength;

/*
 * Filters and ranks caret menu items against a query. Each item is matched on the keys `getKeys` returns and ranked by
 * its best key: exact, prefix, word start, substring, then subsequence. Ties keep the items' original order. A null
 * query returns nothing, an empty one every item in its original order. `limit` caps the result length.
 */
export const filterCaretMenuItems = <T>({
	items,
	query,
	getKeys,
	limit,
}: FilterCaretMenuItemsParams<T>): T[] => {
	if (query === null) {
		return [];
	}

	const lowerQuery = query.toLowerCase();

	if (!lowerQuery) {
		return items.slice(0, limit);
	}

	const rankedItems: RankedItem<T>[] = [];

	for (const [index, item] of items.entries()) {
		let bestMatch: KeyMatch | null = null;

		for (const key of getKeys(item)) {
			const match = matchKey(key, lowerQuery);

			if (!match) {
				continue;
			}

			if (!bestMatch || compareMatches(match, bestMatch) < 0) {
				bestMatch = match;
			}
		}

		if (bestMatch) {
			rankedItems.push({ item, index, match: bestMatch });
		}
	}

	rankedItems.sort(
		(a, b) => compareMatches(a.match, b.match) || a.index - b.index,
	);

	const sortedItems = rankedItems.map(({ item }) => item);

	return sortedItems.slice(0, limit);
};
