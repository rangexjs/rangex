import type { EditorAPI, Line } from "@rangex/core";

import type { RemoveConfigPort } from "#adapters";

export type GetCurrentLineFn = () => Line | null;

export interface HandleLineRemoveParams {
	port: RemoveConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
