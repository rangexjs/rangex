import type { HTMLLayout } from "rich-text-area";

export interface GetVideoControlsParams {
	video: HTMLLayout;
}

export type GetVideoControlsResult = boolean;

export interface SetVideoControlsParams {
	video: HTMLLayout;
	controls: boolean;
}
