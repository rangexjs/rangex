import type { BlockNestedContext, HTMLLayout } from "rich-text-area";

export interface GetAudioFigureParams {
	blockNestedContext: BlockNestedContext;
}

export type GetAudioFigureResult = HTMLLayout;

export interface GetAudioElementParams {
	figure: HTMLLayout;
}

export type GetAudioElementResult = HTMLLayout;
