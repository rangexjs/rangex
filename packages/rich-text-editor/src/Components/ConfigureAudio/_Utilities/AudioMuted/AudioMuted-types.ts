import type { HTMLLayout } from "rich-text-area";

export interface GetAudioMutedParams {
	audio: HTMLLayout;
}

export type GetAudioMutedResult = boolean;

export interface SetAudioMutedParams {
	audio: HTMLLayout;
	muted: boolean;
}
