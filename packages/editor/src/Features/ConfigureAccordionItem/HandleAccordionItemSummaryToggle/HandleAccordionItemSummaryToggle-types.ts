import type { EditorAPI, EditorElement } from "@rangex/core";

export interface ToggleDetailsParams {
	editorAPI: EditorAPI;
	summary: EditorElement;
}

export interface HandleAccordionItemSummaryToggleParams {
	editorAPI: EditorAPI;
}
