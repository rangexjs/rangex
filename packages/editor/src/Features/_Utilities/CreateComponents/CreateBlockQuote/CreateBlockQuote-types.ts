import type { BlockComponentLine, Line } from "@rangex/core";

export interface CreateBlockQuoteParams {
	childNodes?: Line[];
}

export interface CreateBlockQuoteResult extends BlockComponentLine {}
