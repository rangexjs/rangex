import type { BlockComponentLine, EditorAPI, Line } from "rich-text-area";
import type {
	LineHandlerConfigPort,
	TurnableComponentName,
} from "#adapters/LineHandler";

export type GetCurrentLineFn = () => Line | null;

export interface CreateBlockComponentParams {
	name: TurnableComponentName;
	childNodes: Line[];
}

export type CreateBlockComponentResult = BlockComponentLine;

export interface HandleTurnIntoParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
