import type {
	GetAudioLoopParams,
	GetAudioLoopResult,
	SetAudioLoopParams,
} from "./AudioLoop-types";

/**
 * `loop` is a native HTML boolean attribute on `<audio>` — presence means true,
 * absence means false, the attribute value itself is meaningless.
 */
export const getAudioLoop = ({
	audio,
}: GetAudioLoopParams): GetAudioLoopResult => audio.hasAttribute("loop");

export const setAudioLoop = ({ audio, loop }: SetAudioLoopParams) => {
	if (loop) {
		audio.setAttribute("loop", "");
		return;
	}

	audio.removeAttribute("loop");
};
