import type { EditorAPI } from "rich-text-area";
import type { AccordionItemConfigPort } from "#adapters";

export interface ConfigureAccordionItemParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
}
