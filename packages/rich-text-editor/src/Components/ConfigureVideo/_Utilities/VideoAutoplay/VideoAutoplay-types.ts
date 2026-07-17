import type { HTMLLayout } from "rich-text-area";

export interface GetVideoAutoplayParams {
	video: HTMLLayout;
}

export type GetVideoAutoplayResult = boolean;

export interface SetVideoAutoplayParams {
	video: HTMLLayout;
	autoplay: boolean;
}
