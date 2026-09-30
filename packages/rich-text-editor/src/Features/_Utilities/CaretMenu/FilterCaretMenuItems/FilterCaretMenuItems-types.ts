import type { CaretMenuQuery } from "@rangex/editor";

export type GetFilterKeysFn<T> = (item: T) => string[];

export interface FilterCaretMenuItemsParams<T> {
	items: T[];
	query: CaretMenuQuery;
	getKeys: GetFilterKeysFn<T>;
	limit?: number;
}

// 0 exact, 1 prefix, 2 word start, 3 substring, 4 subsequence — lower is better
export type MatchTier = 0 | 1 | 2 | 3 | 4;

/**
 * How one key matched the query:
 * - `tier` — the match type (see `MatchTier`)
 * - `position` — the index in the key where the match starts
 * - `keyLength` — the length of the whole key, used as the last tie-break so shorter keys rank first
 */
export interface KeyMatch {
	tier: MatchTier;
	position: number;
	keyLength: number;
}

export interface RankedItem<T> {
	item: T;
	index: number;
	match: KeyMatch;
}
