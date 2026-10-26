import type { BlockComponent, HTMLLayout } from "@rangex/core";

export interface GetImagePartsParams {
	image: BlockComponent;
}

export interface GetImagePartsResult {
	block: BlockComponent;
	img: HTMLLayout;
}
