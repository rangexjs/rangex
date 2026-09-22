import type { EditorAPI, EditorText } from "rich-text-area";
import type { CaretMenuConfigPort } from "#adapters";

export interface CaretMenuQuery {
	toText: EditorText;
	toOffset: number;
	query: string;
}

export interface GetCaretMenuQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export type GetCaretMenuQueryFn = (
	params: GetCaretMenuQueryParams,
) => CaretMenuQuery | null;

export type OnCaretMenuQueryFn = (query: string) => boolean;

export interface HandleCaretMenuAppearanceParams {
	port: CaretMenuConfigPort;
	editorAPI: EditorAPI;
	getQuery: GetCaretMenuQueryFn;
	onQuery: OnCaretMenuQueryFn;
}
