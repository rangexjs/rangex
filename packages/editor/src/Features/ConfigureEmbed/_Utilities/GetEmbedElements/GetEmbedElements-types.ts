import type { BlockComponent, HTMLLayout } from "@rangex/core";

export interface GetEmbedFigureParams {
	blockComponent: BlockComponent;
}

export type GetEmbedFigureResult = HTMLLayout;

export interface GetEmbedElementParams {
	figure: HTMLLayout;
}

export type GetEmbedElementResult = HTMLLayout;
