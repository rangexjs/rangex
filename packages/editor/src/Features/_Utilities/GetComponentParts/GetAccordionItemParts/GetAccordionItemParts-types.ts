import type { BlockComponent, BlockComponentLine, HTMLLayout, NestedEditable } from "@rangex/core";

export interface GetAccordionItemPartsParams {
	blockComponent: BlockComponent;
}

export interface GetAccordionItemPartsResult {
	line: BlockComponentLine;
	block: BlockComponent;
	details: HTMLLayout;
	summaryNestedEditable: NestedEditable;
	bodyNestedEditable: NestedEditable;
}
