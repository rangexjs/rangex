import type { HTMLLayout } from "rich-text-area";
import type { objectFitAttr } from "../../../../Constants";

export type ImageObjectFitValue = keyof typeof objectFitAttr.value;

export interface GetImageObjectFitParams {
	img: HTMLLayout;
}

export type GetImageObjectFitResult = ImageObjectFitValue;

export interface SetImageObjectFitParams {
	img: HTMLLayout;
	objectFit: ImageObjectFitValue;
}
