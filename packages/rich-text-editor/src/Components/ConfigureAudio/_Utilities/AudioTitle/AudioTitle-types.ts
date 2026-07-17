import type { HTMLLayout } from "rich-text-area";

export interface GetAudioTitleParams {
	audio: HTMLLayout;
}

export type GetAudioTitleResult = string;

export interface SetAudioTitleParams {
	audio: HTMLLayout;
	title: string;
}
