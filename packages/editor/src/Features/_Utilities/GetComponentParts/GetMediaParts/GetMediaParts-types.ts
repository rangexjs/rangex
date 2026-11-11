import type {
	BlockComponent,
	BlockComponentLine,
	HTMLLayout,
} from "@rangex/core";

export interface GetMediaPartsParams {
	blockComponent: BlockComponent;
	mediaLocalName: string;
}

export interface GetMediaPartsResult {
	line: BlockComponentLine;
	block: BlockComponent;
	media: HTMLLayout;
}
