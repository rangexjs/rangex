import type { EditorAPI, EditorText } from "rich-text-area";

export interface GetEmojiQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export interface EmojiQuery {
	toText: EditorText;
	toOffset: number;
	query: string;
}

export type GetEmojiQueryResult = EmojiQuery | null;

export interface GetEmojiAutoCompleteParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export interface EmojiAutoComplete {
	name: string;
	toText: EditorText;
	toOffset: number;
}

export type GetEmojiAutoCompleteResult = EmojiAutoComplete | null;
