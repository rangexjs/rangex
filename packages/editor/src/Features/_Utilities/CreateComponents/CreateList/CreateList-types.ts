import type { BlockComponentLine, Line, ListLocalName } from "@rangex/core";

export interface CreateListParams {
	localName: ListLocalName;
	childNodes?: Line[];
}

export type CreateListResult = BlockComponentLine;
