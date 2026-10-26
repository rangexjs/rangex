import type {
	BlockComponent,
	BlockComponentLine,
	HTMLLayout,
} from "@rangex/core";

export interface GetImagePartsParams {
	image: BlockComponent;
}

export interface GetImagePartsResult {
	line: BlockComponentLine;
	block: BlockComponent;
	img: HTMLLayout;
}
