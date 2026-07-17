import type { HTMLLayout } from "rich-text-area";

export type AudioCaptionPosition = "above" | "below";

export interface AudioCaptionState {
	enabled: boolean;
	position: AudioCaptionPosition;
}

export interface GetAudioCaptionParams {
	figure: HTMLLayout;
}

export type GetAudioCaptionResult = AudioCaptionState;

export interface SetAudioCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetAudioCaptionPositionParams {
	figure: HTMLLayout;
	position: AudioCaptionPosition;
}
