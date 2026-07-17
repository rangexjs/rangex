import type {
	GetAudioMutedParams,
	GetAudioMutedResult,
	SetAudioMutedParams,
} from "./AudioMuted-types";

/**
 * `muted` is a native HTML boolean attribute on `<audio>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getAudioMuted = ({
	audio,
}: GetAudioMutedParams): GetAudioMutedResult => audio.hasAttribute("muted");

export const setAudioMuted = ({ audio, muted }: SetAudioMutedParams) => {
	if (muted) {
		audio.setAttribute("muted", "");
		return;
	}

	audio.removeAttribute("muted");
};
