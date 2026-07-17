import type { BlockNestedContext, HTMLLayout } from "rich-text-area";

export interface GetVideoFigureParams {
	blockNestedContext: BlockNestedContext;
}

export type GetVideoFigureResult = HTMLLayout;

export interface GetVideoElementParams {
	figure: HTMLLayout;
}

export type GetVideoElementResult = HTMLLayout;
