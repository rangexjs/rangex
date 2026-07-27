import type {
	BlockNestedContextLine,
	EditorAPI,
	NestedEditable,
} from "rich-text-area";
import type { AccordionItemEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateAccordionItemLineResult {
	blockNestedContextLine: BlockNestedContextLine;
	summaryNestedEditable: NestedEditable;
}

export interface HandleAccordionItemInsertionParams {
	editorPort: AccordionItemEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
