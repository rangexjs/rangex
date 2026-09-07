import type { EditorAPI } from "rich-text-area";
import type { AccordionItemConfigPort } from "#adapters/AccordionItem";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleAccordionItemToolbarButtonStateParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
