import type {
	BlockComponentLine,
	ContentLine,
	EditorAPI,
	Line,
	List,
	NestedEditable,
} from "@rangex/core";
import type { AdapterBus } from "#adapters";
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
	childNodes?: Line[];
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

export interface ValidateTurnIntoPlacementParams {
	adapterBus: AdapterBus;
	turnIntoParams: TurnIntoPlacementOption;
}

export type ValidateTurnIntoPlacementResult = boolean;

export interface HandleTurnIntoParams {
	adapterBus: AdapterBus;
	configPort: LineHandlerConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
	getCurrentLine: GetCurrentLineFn;
}
