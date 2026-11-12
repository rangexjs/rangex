import type { HTMLLayout } from "@rangex/core";

import type { CaptionPosition, CaptionState } from "#adapters";

export interface GetImageCaptionParams {
	figure: HTMLLayout;
}

export type GetImageCaptionResult = CaptionState;

export interface SetImageCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
	position: CaptionPosition;
}

export interface SetImageCaptionPositionParams {
	figure: HTMLLayout;
	position: CaptionPosition;
}
