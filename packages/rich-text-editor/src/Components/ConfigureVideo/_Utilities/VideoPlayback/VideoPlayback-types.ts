import type { HTMLLayout } from "rich-text-area";

export interface VideoPlaybackState {
	controls: boolean;
	autoplay: boolean;
	loop: boolean;
	muted: boolean;
}

export interface GetVideoPlaybackParams {
	video: HTMLLayout;
}

export type GetVideoPlaybackResult = VideoPlaybackState;

export interface SetVideoPlaybackParams {
	video: HTMLLayout;
	playback: VideoPlaybackState;
}
