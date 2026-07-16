import type {
	GetAudioTitleParams,
	GetAudioTitleResult,
	SetAudioTitleParams,
} from "./AudioTitle-types";

/**
 * The accessible description lives in `aria-label`, since `<audio>` has no dedicated
 * text-alternative attribute.
 */
export const getAudioTitle = ({
	audio,
}: GetAudioTitleParams): GetAudioTitleResult =>
	audio.getAttribute("aria-label") ?? "";

export const setAudioTitle = ({ audio, title }: SetAudioTitleParams) => {
	audio.setAttribute("aria-label", title);
};
