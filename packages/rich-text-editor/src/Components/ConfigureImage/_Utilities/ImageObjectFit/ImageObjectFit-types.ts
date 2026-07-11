import type { HTMLLayout } from "rich-text-area";
import type { imageObjectFitAttr } from "../../../../Constants";

export type ImageObjectFitValue = keyof typeof imageObjectFitAttr.value;

export interface GetImageObjectFitParams {
	img: HTMLLayout;
}

export type GetImageObjectFitResult = ImageObjectFitValue;

export interface SetImageObjectFitParams {
	img: HTMLLayout;
	objectFit: ImageObjectFitValue;
}
