import type { EditorAPI, EditorText } from "rich-text-area";

export interface CanInsertCommandMenuParams {
	fromText: EditorText;
}

export interface GetCommandMenuQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export interface CommandMenuQuery {
	toText: EditorText;
	toOffset: number;
	query: string;
}

export type GetCommandMenuQueryResult = CommandMenuQuery | null;
