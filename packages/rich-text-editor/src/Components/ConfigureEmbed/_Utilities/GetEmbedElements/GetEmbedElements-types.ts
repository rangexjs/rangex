import type { BlockNestedContext, HTMLLayout } from "rich-text-area";

export interface GetEmbedFigureParams {
	blockNestedContext: BlockNestedContext;
}

export type GetEmbedFigureResult = HTMLLayout;

export interface GetEmbedIframeParams {
	figure: HTMLLayout;
}

export type GetEmbedIframeResult = HTMLLayout;
