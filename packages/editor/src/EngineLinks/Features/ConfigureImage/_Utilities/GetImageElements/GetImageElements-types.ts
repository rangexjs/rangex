import type { BlockComponent, HTMLLayout } from "rich-text-area";

export interface GetImageFigureParams {
	blockComponent: BlockComponent;
}

export type GetImageFigureResult = HTMLLayout;

export interface GetImageImgParams {
	figure: HTMLLayout;
}

export type GetImageImgResult = HTMLLayout;
