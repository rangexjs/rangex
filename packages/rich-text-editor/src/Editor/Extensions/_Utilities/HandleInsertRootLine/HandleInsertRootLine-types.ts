import type { EditorAPI, Line } from "rich-text-area";
import type { InsertRootLinePort } from "#adapters";

export type GetCurrentLineFn = () => Line | null;

export interface HandleInsertRootLineParams {
	port: InsertRootLinePort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
