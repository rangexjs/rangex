import type { HTMLLayout } from "rich-text-area";

export interface GetAudioAutoplayParams {
	audio: HTMLLayout;
}

export type GetAudioAutoplayResult = boolean;

export interface SetAudioAutoplayParams {
	audio: HTMLLayout;
	autoplay: boolean;
}
