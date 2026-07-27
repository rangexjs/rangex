import { assertNever } from "#ports";
import {
	isWellFormedUrl,
	probeMediaSrc,
	uploadMediaFile,
} from "../../../_Utilities";
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
	editorPort,
	isStillCurrent,
}: ResolveSwapSrcParams): Promise<ResolveSwapSrcResult> => {
	if (audioEmitSwapParams.source === "url") {
		if (!isWellFormedUrl(audioEmitSwapParams.url)) {
			editorPort.updateState({
				swapCheckState: { status: "error", message: "Enter a valid URL." },
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

		editorPort.updateState({
			swapCheckState: { status: "uploading", progress: 0 },
		});

		const src = await uploadMediaFile({
			file,
			onProgress: (progress) => {
				if (!isStillCurrent()) {
					return;
				}

				editorPort.updateState({
					swapCheckState: { status: "uploading", progress },
				});
			},
		});

		if (!src) {
			editorPort.updateState({
				swapCheckState: {
					status: "error",
					message: "Couldn't read that file. Try a different one.",
				},
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
	editorPort,
	editorAPI,
	internals,
}: HandleAudioSwapParams) => {
	const unsubscribeSwap = editorPort.onSwap(async (params) => {
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
			editorPort,
			isStillCurrent,
		});

		if (src === null) {
			return;
		}

		if (!isStillCurrent()) {
			return;
		}

		editorPort.updateState({ swapCheckState: { status: "checking" } });

		const loaded = await probeMediaSrc({ type: "audio", src });

		if (!isStillCurrent()) {
			return;
		}

		if (!loaded) {
			editorPort.updateState({
				swapCheckState: {
					status: "error",
					message: "Couldn't load that audio. Check the link and try again.",
				},
			});
			return;
		}

		applyAudioSrc({ figure: currentAudioFigure, src, editorAPI });
		editorPort.updateState({ swapCheckState: { status: "idle" } });
		editorPort.swapPopover.element.hidePopover();
	});

	return () => {
		unsubscribeSwap();
	};
};
