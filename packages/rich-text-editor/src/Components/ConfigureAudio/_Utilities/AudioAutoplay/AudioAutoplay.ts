import type {
	GetAudioAutoplayParams,
	GetAudioAutoplayResult,
	SetAudioAutoplayParams,
} from "./AudioAutoplay-types";

/**
 * `autoplay` is a native HTML boolean attribute on `<audio>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getAudioAutoplay = ({
	audio,
}: GetAudioAutoplayParams): GetAudioAutoplayResult =>
	audio.hasAttribute("autoplay");

export const setAudioAutoplay = ({
	audio,
	autoplay,
}: SetAudioAutoplayParams) => {
	if (autoplay) {
		audio.setAttribute("autoplay", "");
		return;
	}

	audio.removeAttribute("autoplay");
};
