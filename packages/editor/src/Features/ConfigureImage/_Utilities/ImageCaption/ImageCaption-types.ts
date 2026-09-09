import type { HTMLLayout } from "rich-text-area";
import type { CaptionPosition, CaptionState } from "#adapters";

export interface GetImageCaptionParams {
	figure: HTMLLayout;
}

export type GetImageCaptionResult = CaptionState;

export interface SetImageCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetImageCaptionPositionParams {
	figure: HTMLLayout;
	position: CaptionPosition;
}
