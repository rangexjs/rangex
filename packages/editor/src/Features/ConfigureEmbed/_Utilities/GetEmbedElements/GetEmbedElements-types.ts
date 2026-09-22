import type { BlockComponent, HTMLLayout } from "rich-text-area";

export interface GetEmbedFigureParams {
	blockComponent: BlockComponent;
}

export type GetEmbedFigureResult = HTMLLayout;

export interface GetEmbedElementParams {
	figure: HTMLLayout;
}

export type GetEmbedElementResult = HTMLLayout;
