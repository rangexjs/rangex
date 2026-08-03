import type { EditorAPI, Line } from "rich-text-area";
import type { DeletePort } from "#adapters";

export type GetCurrentLineFn = () => Line | null;

export interface HandleLineDeleteParams {
	port: DeletePort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
