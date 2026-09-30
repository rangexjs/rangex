import type {
	BlockComponentLine,
	ContentLine,
	EditorAPI,
	Line,
	List,
	NestedEditable,
} from "rich-text-area";
import type {
	LineHandlerConfigPort,
	TurnIntoPlacementOption,
} from "#adapters/LineHandler";
import type { BlockComponentPlacement } from "#engine-links";

export type GetCurrentLineFn = () => Line | null;

export interface GetNestedEditableTargetParams {
	blockComponentLine: BlockComponentLine;
}

export type GetNestedEditableTargetResult = NestedEditable;

export interface GetListTargetParams {
	blockComponentLine: BlockComponentLine;
}

export type GetListTargetResult = List;

export type CreateBlockComponentParams = TurnIntoPlacementOption & {
	childNodes: Line[];
};

export interface CreateBlockComponentResult {
	blockComponentLine: BlockComponentLine;
	wrapTarget: NestedEditable | List;
}

export interface WrapContentLineParams {
	blockComponentPlacement: BlockComponentPlacement;
	contentLine: ContentLine;
	turnIntoParams: TurnIntoPlacementOption;
}

export interface ShouldSkipFirstLineParams {
	componentName: string;
	extractedLines: Line[];
}

export type ShouldSkipFirstLineResult = boolean;

export interface ReplaceBlockComponentLineParams {
	editorAPI: EditorAPI;
	blockComponentLine: BlockComponentLine;
	turnIntoParams: TurnIntoPlacementOption;
}

export interface TurnLineIntoParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	line: Line;
	turnIntoParams: TurnIntoPlacementOption;
}

export interface HandleTurnIntoParams {
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	getCurrentLine: GetCurrentLineFn;
}
