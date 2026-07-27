import type { EditorAPI } from "rich-text-area";
import type { AccordionItemEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleAccordionItemToolbarButtonStateParams {
	editorPort: AccordionItemEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
