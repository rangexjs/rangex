import type { HTMLLayout } from "rich-text-area";
import type { objectFitAttr } from "../../../../Constants";

export type VideoObjectFitValue = keyof typeof objectFitAttr.value;

export interface GetVideoObjectFitParams {
	video: HTMLLayout;
}

export type GetVideoObjectFitResult = VideoObjectFitValue;

export interface SetVideoObjectFitParams {
	video: HTMLLayout;
	objectFit: VideoObjectFitValue;
}
