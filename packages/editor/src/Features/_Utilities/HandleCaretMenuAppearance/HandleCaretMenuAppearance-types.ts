import type { EditorAPI, EditorText } from "rich-text-area";
import type { CaretMenuConfigPort } from "#adapters";

export interface GetCaretMenuQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export type GetCaretMenuQueryResult = {
	toText: EditorText;
	toOffset: number;
	query: string;
} | null;

export type GetCaretMenuQueryFn = (
	params: GetCaretMenuQueryParams,
) => GetCaretMenuQueryResult;

export interface HandleCaretMenuAppearanceParams {
	port: CaretMenuConfigPort;
	editorAPI: EditorAPI;
	getQuery: GetCaretMenuQueryFn;
}
