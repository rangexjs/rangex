import type { HTMLLayout } from "rich-text-area";
import type { imageAspectRatioAttr } from "../../../../Constants";

export type ImageAspectRatioValue = keyof typeof imageAspectRatioAttr.value;

export interface GetImageAspectRatioParams {
	img: HTMLLayout;
}

export type GetImageAspectRatioResult = ImageAspectRatioValue;

export interface SetImageAspectRatioParams {
	img: HTMLLayout;
	aspectRatio: ImageAspectRatioValue;
}
