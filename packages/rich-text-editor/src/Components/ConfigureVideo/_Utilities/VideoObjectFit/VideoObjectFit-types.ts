import type { HTMLLayout } from "rich-text-area";
import type { imageObjectFitAttr } from "../../../../Constants";

export type VideoObjectFitValue = keyof typeof imageObjectFitAttr.value;

export interface GetVideoObjectFitParams {
	video: HTMLLayout;
}

export type GetVideoObjectFitResult = VideoObjectFitValue;

export interface SetVideoObjectFitParams {
	video: HTMLLayout;
	objectFit: VideoObjectFitValue;
}
