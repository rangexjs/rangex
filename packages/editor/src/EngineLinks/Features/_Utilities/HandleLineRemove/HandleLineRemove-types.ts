import type { EditorAPI, Line } from "rich-text-area";
import type { RemovePort } from "#adapters";

export type GetCurrentLineFn = () => Line | null;

export interface HandleLineRemoveParams {
	port: RemovePort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
