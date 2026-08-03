import type { BlockComponentLine, Line, NestedEditable } from "rich-text-area";

export interface CreateAccordionItemParams {
	childNodes?: Line[];
}

export interface CreateAccordionItemResult {
	blockComponentLine: BlockComponentLine;
	summaryNestedEditable: NestedEditable;
}
