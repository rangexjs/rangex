import type { HTMLLayout } from "@rangex/core";
import type { CaptionPosition, CaptionState } from "#adapters";

export interface GetVideoCaptionParams {
	figure: HTMLLayout;
}

export type GetVideoCaptionResult = CaptionState;

export interface SetVideoCaptionEnabledParams {
	figure: HTMLLayout;
	enabled: boolean;
	position: CaptionPosition;
}

export interface SetVideoCaptionPositionParams {
	figure: HTMLLayout;
	position: CaptionPosition;
}
