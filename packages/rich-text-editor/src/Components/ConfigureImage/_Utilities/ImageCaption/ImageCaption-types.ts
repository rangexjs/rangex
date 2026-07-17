import type { HTMLLayout } from "rich-text-area";

export type ImageCaptionPosition = "above" | "below";

export interface ImageCaptionState {
	enabled: boolean;
	position: ImageCaptionPosition;
}

export interface GetImageCaptionParams {
	figure: HTMLLayout;
}

export type GetImageCaptionResult = ImageCaptionState;

export interface SetImageCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetImageCaptionPositionParams {
	figure: HTMLLayout;
	position: ImageCaptionPosition;
}
