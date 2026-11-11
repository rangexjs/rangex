import type { EditorAPI } from "@rangex/core";

import type { AccordionItemConfigPort } from "#adapters/AccordionItem";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleAccordionItemPlacementStateParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
