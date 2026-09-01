import type { EditorAPI } from "rich-text-area";
import type { AccordionItemConfigPort } from "#adapters/AccordionItem";

export interface ConfigureAccordionItemParams {
	configPort: AccordionItemConfigPort;
	editorAPI: EditorAPI;
}
