import type { EditorAPI, EditorText } from "rich-text-area";

export interface CanInsertTemplateVariableParams {
	fromText: EditorText;
}

export interface GetTemplateVariableQueryParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export interface TemplateVariableQuery {
	toText: EditorText;
	toOffset: number;
	query: string;
}

export type GetTemplateVariableQueryResult = TemplateVariableQuery | null;
