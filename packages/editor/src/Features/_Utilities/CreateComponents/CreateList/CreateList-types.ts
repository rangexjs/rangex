import type {
	BlockComponentLine,
	Line,
	ListLineType,
	ListLocalName,
} from "rich-text-area";

export interface CreateListParams {
	localName: ListLocalName;
	lineType: ListLineType;
	childNodes?: Line[];
}

export type CreateListResult = BlockComponentLine;
