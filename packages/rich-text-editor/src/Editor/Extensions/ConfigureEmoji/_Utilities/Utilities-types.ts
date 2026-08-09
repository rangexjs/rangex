import type { EditorAPI, EditorText } from "rich-text-area";

export interface GetEmojiQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
	/**
	 * Set when `fromOffset` sits right after the shortcode's own closing ':' (e.g.
	 * scanning is resumed after that ':' was already inserted). The first ':'
	 * reached is then treated as the closing tag and skipped, and the query is
	 * read from between it and the next ':' found further back.
	 */
	hasClosingColon: boolean;
}

export interface EmojiQuery {
	toText: EditorText;
	toOffset: number;
	query: string;
}

export type GetEmojiQueryResult = EmojiQuery | null;
