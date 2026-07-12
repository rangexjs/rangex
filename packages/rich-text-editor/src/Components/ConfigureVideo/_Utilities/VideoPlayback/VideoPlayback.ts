import type {
	GetVideoPlaybackParams,
	GetVideoPlaybackResult,
	SetVideoPlaybackParams,
} from "./VideoPlayback-types";

const playbackAttrNames = ["controls", "autoplay", "loop", "muted"] as const;

/**
 * `controls`/`autoplay`/`loop`/`muted` are native HTML boolean attributes on `<video>` —
 * presence means true, absence means false, the attribute value itself is meaningless.
 */
export const getVideoPlayback = ({
	video,
}: GetVideoPlaybackParams): GetVideoPlaybackResult => ({
	controls: video.hasAttribute("controls"),
	autoplay: video.hasAttribute("autoplay"),
	loop: video.hasAttribute("loop"),
	muted: video.hasAttribute("muted"),
});

export const setVideoPlayback = ({
	video,
	playback,
}: SetVideoPlaybackParams) => {
	for (const attrName of playbackAttrNames) {
		if (playback[attrName]) {
			video.setAttribute(attrName, "");
			continue;
		}

		video.removeAttribute(attrName);
	}
};
