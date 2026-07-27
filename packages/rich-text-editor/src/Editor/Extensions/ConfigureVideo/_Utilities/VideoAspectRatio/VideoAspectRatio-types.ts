import type { HTMLLayout } from "rich-text-area";
import type { aspectRatioAttr } from "../../../../Constants";

export type VideoAspectRatioValue = keyof typeof aspectRatioAttr.value;

export interface GetVideoAspectRatioParams {
	video: HTMLLayout;
}

export type GetVideoAspectRatioResult = VideoAspectRatioValue;

export interface SetVideoAspectRatioParams {
	video: HTMLLayout;
	aspectRatio: VideoAspectRatioValue;
}
