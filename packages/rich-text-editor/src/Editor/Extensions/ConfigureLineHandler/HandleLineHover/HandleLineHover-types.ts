import type { EditorAPI, Line } from "rich-text-area";
import type { LineHandlerEditorPort } from "#adapters";
import type { GetCurrentLineFn } from "../../_Utilities";

export type OnLineChangeFn = (line: Line | null) => void;

export interface HandleLineHoverParams {
	editorPort: LineHandlerEditorPort;
	editorAPI: EditorAPI;
	onLineChange: OnLineChangeFn;
}

export interface HandleLineHoverResult {
	getCurrentLine: GetCurrentLineFn;
	cleanup: () => void;
}
