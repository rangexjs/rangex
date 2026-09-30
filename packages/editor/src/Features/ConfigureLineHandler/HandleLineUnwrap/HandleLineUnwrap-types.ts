import type { EditorAPI, Line } from "@rangex/core";
import type { LineHandlerConfigPort } from "#adapters/LineHandler";

export type GetCurrentLineFn = () => Line | null;

export interface HandleLineUnwrapParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
