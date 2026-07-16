import type { HTMLLayout } from "rich-text-area";

export interface GetAudioControlsParams {
	audio: HTMLLayout;
}

export type GetAudioControlsResult = boolean;

export interface SetAudioControlsParams {
	audio: HTMLLayout;
	controls: boolean;
}
