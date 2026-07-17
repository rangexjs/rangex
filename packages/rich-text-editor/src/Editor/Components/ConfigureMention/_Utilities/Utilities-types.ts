import type { EditorAPI, EditorText } from "rich-text-area";

export interface CanInsertMentionParams {
	fromText: EditorText;
}

export interface GetMentionQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export interface MentionQuery {
	toText: EditorText;
	toOffset: number;
	query: string;
}

export type GetMentionQueryResult = MentionQuery | null;
