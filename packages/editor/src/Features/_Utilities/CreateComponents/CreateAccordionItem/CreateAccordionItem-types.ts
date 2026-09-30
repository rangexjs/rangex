import type {
	BlockComponent,
	BlockComponentLine,
	Line,
	NestedEditable,
} from "rich-text-area";

export interface GetAccordionItemPartsParams {
	accordionItem: BlockComponentLine | BlockComponent;
}

export interface GetAccordionItemPartsResult {
	summaryNestedEditable: NestedEditable;
	bodyNestedEditable: NestedEditable;
}

export interface CreateAccordionItemParams {
	open?: boolean;
	childNodes?: Line[];
}

export interface CreateAccordionItemResult extends BlockComponentLine {}
