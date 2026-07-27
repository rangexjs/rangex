import type { EditorAPI } from "rich-text-area";
import type { AccordionItemEditorPort } from "#adapters";

export interface ConfigureAccordionItemParams {
	editorPort: AccordionItemEditorPort;
	editorAPI: EditorAPI;
}
