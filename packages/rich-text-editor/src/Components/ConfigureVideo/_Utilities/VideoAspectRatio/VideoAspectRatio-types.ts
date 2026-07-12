import type { HTMLLayout } from "rich-text-area";
import type { imageAspectRatioAttr } from "../../../../Constants";

export type VideoAspectRatioValue = keyof typeof imageAspectRatioAttr.value;

export interface GetVideoAspectRatioParams {
	video: HTMLLayout;
}

export type GetVideoAspectRatioResult = VideoAspectRatioValue;

export interface SetVideoAspectRatioParams {
	video: HTMLLayout;
	aspectRatio: VideoAspectRatioValue;
}
