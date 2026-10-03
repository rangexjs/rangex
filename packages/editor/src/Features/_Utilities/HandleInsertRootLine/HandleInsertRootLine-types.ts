import type { EditorAPI, Line } from "@rangex/core";
import type { InsertRootLineConfigPort } from "#adapters";

export type GetCurrentLineFn = () => Line | null;

export interface HandleInsertRootLineParams {
	port: InsertRootLineConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
