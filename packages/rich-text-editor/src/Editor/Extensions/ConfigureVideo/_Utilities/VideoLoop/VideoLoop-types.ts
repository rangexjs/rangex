import type { HTMLLayout } from "rich-text-area";

export interface GetVideoLoopParams {
	video: HTMLLayout;
}

export type GetVideoLoopResult = boolean;

export interface SetVideoLoopParams {
	video: HTMLLayout;
	loop: boolean;
}
