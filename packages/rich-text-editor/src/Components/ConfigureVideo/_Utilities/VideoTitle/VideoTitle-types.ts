import type { HTMLLayout } from "rich-text-area";

export interface GetVideoTitleParams {
	video: HTMLLayout;
}

export type GetVideoTitleResult = string;

export interface SetVideoTitleParams {
	video: HTMLLayout;
	title: string;
}
