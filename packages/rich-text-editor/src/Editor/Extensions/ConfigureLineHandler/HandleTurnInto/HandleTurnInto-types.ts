import type { BlockComponentLine, EditorAPI, Line } from "rich-text-area";
import type { LineHandlerEditorPort, TurnableComponentName } from "#adapters";
import type { GetCurrentLineFn } from "../../_Utilities";

export interface CreateBlockComponentParams {
	name: TurnableComponentName;
	childNodes: Line[];
}

export type CreateBlockComponentResult = BlockComponentLine;

export interface HandleTurnIntoParams {
	editorPort: LineHandlerEditorPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
