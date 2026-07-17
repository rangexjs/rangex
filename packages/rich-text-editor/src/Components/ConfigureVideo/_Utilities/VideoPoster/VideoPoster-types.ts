import type { HTMLLayout } from "rich-text-area";

export interface GetVideoPosterParams {
	video: HTMLLayout;
}

export type GetVideoPosterResult = string;

export interface SetVideoPosterParams {
	video: HTMLLayout;
	poster: string;
}
