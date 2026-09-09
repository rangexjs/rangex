import type { BlockComponent, HTMLLayout } from "rich-text-area";

export interface GetAudioFigureParams {
	blockComponent: BlockComponent;
}

export type GetAudioFigureResult = HTMLLayout;

export interface GetAudioElementParams {
	figure: HTMLLayout;
}

export type GetAudioElementResult = HTMLLayout;
