import type { BlockNestedContext, HTMLLayout } from "rich-text-area";

export interface GetImageFigureParams {
	blockNestedContext: BlockNestedContext;
}

export type GetImageFigureResult = HTMLLayout;

export interface GetImageImgParams {
	figure: HTMLLayout;
}

export type GetImageImgResult = HTMLLayout;
