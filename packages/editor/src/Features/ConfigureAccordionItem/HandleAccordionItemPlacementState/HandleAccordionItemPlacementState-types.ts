import type { EditorAPI } from "rich-text-area";
import type { AccordionItemConfigPort } from "#adapters/AccordionItem";
import type { BlockComponentPlacement, ComponentLookup } from "#engine-links";

export interface HandleAccordionItemPlacementStateParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
	componentLookup: ComponentLookup;
	blockComponentPlacement: BlockComponentPlacement;
}
