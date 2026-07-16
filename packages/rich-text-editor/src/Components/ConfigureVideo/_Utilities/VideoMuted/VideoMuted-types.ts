import type { HTMLLayout } from "rich-text-area";

export interface GetVideoMutedParams {
	video: HTMLLayout;
}

export type GetVideoMutedResult = boolean;

export interface SetVideoMutedParams {
	video: HTMLLayout;
	muted: boolean;
}
