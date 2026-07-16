import type { HTMLLayout } from "rich-text-area";
import type { aspectRatioAttr } from "../../../../Constants";

export type ImageAspectRatioValue = keyof typeof aspectRatioAttr.value;

export interface GetImageAspectRatioParams {
	img: HTMLLayout;
}

export type GetImageAspectRatioResult = ImageAspectRatioValue;

export interface SetImageAspectRatioParams {
	img: HTMLLayout;
	aspectRatio: ImageAspectRatioValue;
}
