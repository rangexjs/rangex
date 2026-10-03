import type {
	BlockComponentLine,
	Line,
	ListLineType,
	ListLocalName,
} from "@rangex/core";

export interface CreateListParams {
	localName: ListLocalName;
	lineType: ListLineType;
	childNodes?: Line[];
}

export type CreateListResult = BlockComponentLine;
