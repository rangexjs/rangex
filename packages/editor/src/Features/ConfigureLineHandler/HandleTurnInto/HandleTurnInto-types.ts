import type { BlockComponentLine, EditorAPI, Line } from "rich-text-area";
import type {
	LineHandlerConfigPort,
	TurnIntoPlacementOption,
} from "#adapters/LineHandler";

export type GetCurrentLineFn = () => Line | null;

export type CreateBlockComponentParams = TurnIntoPlacementOption & {
	childNodes: Line[];
};

export type CreateBlockComponentResult = BlockComponentLine;

export interface HandleTurnIntoParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	getCurrentLine: GetCurrentLineFn;
}
