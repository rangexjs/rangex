import type { HTMLLayout } from "rich-text-area";

export interface GetImageAltParams {
	img: HTMLLayout;
}

export type GetImageAltResult = string;

export interface SetImageAltParams {
	img: HTMLLayout;
	alt: string;
}
