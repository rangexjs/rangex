import type { EditorAPI } from "@rangex/core";

import type {
	AccordionItemConfigPort,
	AccordionItemPlacementOption,
} from "#adapters/AccordionItem";
import type { BlockComponentPlacement } from "#engine-links";

import type { GetAccordionItemPartsResult } from "../../_Utilities";

export interface HandleAccordionItemPlacementParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}

export interface CreateValidAccordionItemParams extends AccordionItemPlacementOption {
	configPort: AccordionItemConfigPort;
}

export type CreateValidAccordionItemResult = GetAccordionItemPartsResult | null;
