import type { HTMLLayout } from "rich-text-area";
import type { CaptionPosition, CaptionState } from "#adapters";

export interface GetAudioCaptionParams {
	figure: HTMLLayout;
}

export type GetAudioCaptionResult = CaptionState;

export interface SetAudioCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetAudioCaptionPositionParams {
	figure: HTMLLayout;
	position: CaptionPosition;
}
