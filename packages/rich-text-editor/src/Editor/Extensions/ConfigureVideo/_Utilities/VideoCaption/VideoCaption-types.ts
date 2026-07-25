import type { HTMLLayout } from "rich-text-area";

export type VideoCaptionPosition = "above" | "below";

export interface VideoCaptionState {
	enabled: boolean;
	position: VideoCaptionPosition;
}

export interface GetVideoCaptionParams {
	figure: HTMLLayout;
}

export type GetVideoCaptionResult = VideoCaptionState;

export interface SetVideoCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
}

export interface SetVideoCaptionPositionParams {
	figure: HTMLLayout;
	position: VideoCaptionPosition;
}
