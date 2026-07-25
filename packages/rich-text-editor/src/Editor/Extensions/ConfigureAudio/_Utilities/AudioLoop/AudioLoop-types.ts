import type { HTMLLayout } from "rich-text-area";

export interface GetAudioLoopParams {
	audio: HTMLLayout;
}

export type GetAudioLoopResult = boolean;

export interface SetAudioLoopParams {
	audio: HTMLLayout;
	loop: boolean;
}
