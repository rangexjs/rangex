import type { HTMLLayout } from "rich-text-area";
import type { CaptionPosition, CaptionState } from "#adapters";

export interface GetEmbedCaptionParams {
	figure: HTMLLayout;
}

export type GetEmbedCaptionResult = CaptionState;

export interface SetEmbedCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetEmbedCaptionPositionParams {
	figure: HTMLLayout;
	position: CaptionPosition;
}
