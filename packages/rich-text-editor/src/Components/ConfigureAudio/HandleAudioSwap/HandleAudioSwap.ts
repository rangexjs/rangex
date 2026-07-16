import {
	isWellFormedUrl,
	probeMediaSrc,
	uploadMediaFile,
} from "../../../_Utilities";
import { assertNever } from "../../../ErrorHandling";
import { applyAudioSrc } from "../_Utilities";
import type {
	HandleAudioSwapParams,
	ResolveSwapSrcParams,
	ResolveSwapSrcResult,
} from "./HandleAudioSwap-types";

/**
 * Resolves a swap submission down to a single `src`, or `null` if there's nothing usable
 * to apply. An invalid URL pushes an error back into the popover before returning `null`;
 * a missing file returns `null` silently — the popover already guards against submitting
 * without one, so that case is unreachable in practice.
 */
const resolveSwapSrc = async ({
	audioEmitSwapParams,
	audioSwapPopover,
	isStillCurrent,
}: ResolveSwapSrcParams): Promise<ResolveSwapSrcResult> => {
	if (audioEmitSwapParams.source === "url") {
		if (!isWellFormedUrl(audioEmitSwapParams.url)) {
			audioSwapPopover.updateCheckState({
				status: "error",
				message: "Enter a valid URL.",
			});
			return null;
		}

		return audioEmitSwapParams.url;
	}

	if (audioEmitSwapParams.source === "file-upload") {
		const [file] = audioEmitSwapParams.files;

		if (!file) {
			return null;
		}

		audioSwapPopover.updateCheckState({ status: "uploading", progress: 0 });

		const src = await uploadMediaFile({
			file,
			onProgress: (progress) => {
				if (!isStillCurrent()) {
					return;
				}

				audioSwapPopover.updateCheckState({ status: "uploading", progress });
			},
		});

		if (!src) {
			audioSwapPopover.updateCheckState({
				status: "error",
				message: "Couldn't read that file. Try a different one.",
			});
			return null;
		}

		return src;
	}

	return assertNever(audioEmitSwapParams);
};

/**
 * Wires the popover's Swap control to the engine. Only the `audio`'s `src` changes —
 * playback settings and caption are left untouched. `src` is never applied until
 * `probeMediaSrc` confirms it actually loads, so a bad swap leaves the current audio
 * untouched instead of needing to be rolled back.
 */
export const handleAudioSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleAudioSwapParams) => {
	const { audioSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = audioSwapPopover.onSwap(async (params) => {
		const { currentAudioFigure } = internals;

		if (!currentAudioFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		// The target audio might not be available anymore by the time `src` is resolved.
		const isStillCurrent = () =>
			internals.currentAudioFigure === currentAudioFigure;

		const src = await resolveSwapSrc({
			audioEmitSwapParams: params,
			audioSwapPopover,
			isStillCurrent,
		});

		if (src === null) {
			return;
		}

		if (!isStillCurrent()) {
			return;
		}

		audioSwapPopover.updateCheckState({ status: "checking" });

		const loaded = await probeMediaSrc({ type: "audio", src });

		if (!isStillCurrent()) {
			return;
		}

		if (!loaded) {
			audioSwapPopover.updateCheckState({
				status: "error",
				message: "Couldn't load that audio. Check the link and try again.",
			});
			return;
		}

		applyAudioSrc({ figure: currentAudioFigure, src, editorAPI });
		audioSwapPopover.updateCheckState({ status: "idle" });
		audioSwapPopover.popover.hidePopover();
	});

	return () => {
		unsubscribeSwap();
	};
};
