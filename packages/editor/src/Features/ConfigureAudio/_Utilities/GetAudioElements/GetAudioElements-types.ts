import type { BlockComponent, HTMLLayout } from "@rangex/core";

export interface GetAudioFigureParams {
	blockComponent: BlockComponent;
}

export type GetAudioFigureResult = HTMLLayout;

export interface GetAudioElementParams {
	figure: HTMLLayout;
}

export type GetAudioElementResult = HTMLLayout;
