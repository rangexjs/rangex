import type { HTMLLayout } from "rich-text-area";

export type EmbedCaptionPosition = "above" | "below";

export interface EmbedCaptionState {
	enabled: boolean;
	position: EmbedCaptionPosition;
}

export interface GetEmbedCaptionParams {
	figure: HTMLLayout;
}

export type GetEmbedCaptionResult = EmbedCaptionState;

export interface SetEmbedCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetEmbedCaptionPositionParams {
	figure: HTMLLayout;
	position: EmbedCaptionPosition;
}
