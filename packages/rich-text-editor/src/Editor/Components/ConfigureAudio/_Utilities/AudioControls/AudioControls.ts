import type {
	GetAudioControlsParams,
	GetAudioControlsResult,
	SetAudioControlsParams,
} from "./AudioControls-types";

/**
 * `controls` is a native HTML boolean attribute on `<audio>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getAudioControls = ({
	audio,
}: GetAudioControlsParams): GetAudioControlsResult =>
	audio.hasAttribute("controls");

export const setAudioControls = ({
	audio,
	controls,
}: SetAudioControlsParams) => {
	if (controls) {
		audio.setAttribute("controls", "");
		return;
	}

	audio.removeAttribute("controls");
};
