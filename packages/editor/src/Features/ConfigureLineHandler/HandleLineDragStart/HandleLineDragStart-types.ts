import type { EditorAPI, Line } from "@rangex/core";

import type { LineHandlerConfigPort } from "#adapters/LineHandler";

export type GetCurrentLineFn = () => Line | null;

export interface HandleLineDragStartParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
