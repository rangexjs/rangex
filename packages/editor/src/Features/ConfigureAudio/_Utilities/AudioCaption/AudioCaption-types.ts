import type { HTMLLayout } from "@rangex/core";

import type { CaptionPosition, CaptionState } from "#adapters";

export interface GetAudioCaptionParams {
	figure: HTMLLayout;
}

export type GetAudioCaptionResult = CaptionState;

export interface SetAudioCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
	position: CaptionPosition;
}

export interface SetAudioCaptionPositionParams {
	figure: HTMLLayout;
	position: CaptionPosition;
}
