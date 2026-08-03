import type { BlockComponent, HTMLLayout } from "rich-text-area";

export interface GetEmbedFigureParams {
	blockComponent: BlockComponent;
}

export type GetEmbedFigureResult = HTMLLayout;

export interface GetEmbedIframeParams {
	figure: HTMLLayout;
}

export type GetEmbedIframeResult = HTMLLayout;
