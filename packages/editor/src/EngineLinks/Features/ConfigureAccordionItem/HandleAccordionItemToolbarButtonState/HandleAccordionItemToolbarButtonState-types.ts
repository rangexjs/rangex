import type { EditorAPI } from "rich-text-area";
import type { AccordionItemConfigPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleAccordionItemToolbarButtonStateParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
