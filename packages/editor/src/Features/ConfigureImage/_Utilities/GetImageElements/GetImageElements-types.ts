import type { BlockComponent, HTMLLayout } from "@rangex/core";

export interface GetImageFigureParams {
	blockComponent: BlockComponent;
}

export type GetImageFigureResult = HTMLLayout;

export interface GetImageImgParams {
	figure: HTMLLayout;
}

export type GetImageImgResult = HTMLLayout;
