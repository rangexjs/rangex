import type {
	BlockNestedContextLine,
	Line,
	NestedEditable,
} from "rich-text-area";

export interface CreateAccordionItemParams {
	childNodes?: Line[];
}

export interface CreateAccordionItemResult {
	blockNestedContextLine: BlockNestedContextLine;
	summaryNestedEditable: NestedEditable;
}
