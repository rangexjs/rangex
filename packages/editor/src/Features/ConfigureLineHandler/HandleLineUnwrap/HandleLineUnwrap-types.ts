import type { EditorAPI, Line } from "rich-text-area";
import type { LineHandlerConfigPort } from "#adapters/LineHandler";

export type GetCurrentLineFn = () => Line | null;

export interface HandleLineUnwrapParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
