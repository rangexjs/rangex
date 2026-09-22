import type { EditorAPI, Line } from "rich-text-area";
import type { InsertRootLineConfigPort } from "#adapters";

export type GetCurrentLineFn = () => Line | null;

export interface HandleInsertRootLineParams {
	port: InsertRootLineConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
