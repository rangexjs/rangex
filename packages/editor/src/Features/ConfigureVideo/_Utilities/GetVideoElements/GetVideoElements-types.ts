import type { BlockComponent, HTMLLayout } from "rich-text-area";

export interface GetVideoFigureParams {
	blockComponent: BlockComponent;
}

export type GetVideoFigureResult = HTMLLayout;

export interface GetVideoElementParams {
	figure: HTMLLayout;
}

export type GetVideoElementResult = HTMLLayout;
