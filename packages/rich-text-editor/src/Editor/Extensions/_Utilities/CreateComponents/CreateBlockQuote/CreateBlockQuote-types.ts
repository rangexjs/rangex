import type { BlockNestedContextLine, Line } from "rich-text-area";

export interface CreateBlockQuoteParams {
	childNodes?: Line[];
}

export interface CreateBlockQuoteResult extends BlockNestedContextLine {}
