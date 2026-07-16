import {
	isWellFormedUrl,
	probeMediaSrc,
	uploadMediaFile,
} from "../../../_Utilities";
import { assertNever } from "../../../ErrorHandling";
import { applyVideoSrc } from "../_Utilities";
import type {
	HandleVideoSwapParams,
	ResolveSwapSrcParams,
	ResolveSwapSrcResult,
} from "./HandleVideoSwap-types";

/**
 * Resolves a swap submission down to a single `src`, or `null` if there's nothing usable
 * to apply. An invalid URL pushes an error back into the popover before returning `null`;
 * a missing file returns `null` silently — the popover already guards against submitting
 * without one, so that case is unreachable in practice.
 */
const resolveSwapSrc = async ({
	videoEmitSwapParams,
	videoSwapPopover,
	isStillCurrent,
}: ResolveSwapSrcParams): Promise<ResolveSwapSrcResult> => {
	if (videoEmitSwapParams.source === "url") {
		if (!isWellFormedUrl(videoEmitSwapParams.url)) {
			videoSwapPopover.updateCheckState({
				status: "error",
				message: "Enter a valid URL.",
			});
			return null;
		}

		return videoEmitSwapParams.url;
	}

	if (videoEmitSwapParams.source === "file-upload") {
		const [file] = videoEmitSwapParams.files;

		if (!file) {
			return null;
		}

		videoSwapPopover.updateCheckState({ status: "uploading", progress: 0 });

		const src = await uploadMediaFile({
			file,
			onProgress: (progress) => {
				if (!isStillCurrent()) {
					return;
				}

				videoSwapPopover.updateCheckState({ status: "uploading", progress });
			},
		});

		if (!src) {
			videoSwapPopover.updateCheckState({
				status: "error",
				message: "Couldn't read that file. Try a different one.",
			});
			return null;
		}

		return src;
	}

	return assertNever(videoEmitSwapParams);
};

/**
 * Wires the popover's Swap control to the engine. Only the `video`'s `src` changes —
 * object-fit, aspect ratio, playback, poster, and caption are left untouched. `src` is
 * never applied until `probeMediaSrc` confirms it actually loads, so a bad swap leaves
 * the current video untouched instead of needing to be rolled back.
 */
export const handleVideoSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleVideoSwapParams) => {
	const { videoSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = videoSwapPopover.onSwap(async (params) => {
		const { currentVideoFigure } = internals;

		if (!currentVideoFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		// The target video might not be available anymore by the time `src` is resolved.
		const isStillCurrent = () =>
			internals.currentVideoFigure === currentVideoFigure;

		const src = await resolveSwapSrc({
			videoEmitSwapParams: params,
			videoSwapPopover,
			isStillCurrent,
		});

		if (src === null) {
			return;
		}

		if (!isStillCurrent()) {
			return;
		}

		videoSwapPopover.updateCheckState({ status: "checking" });

		const loaded = await probeMediaSrc({ type: "video", src });

		if (!isStillCurrent()) {
			return;
		}

		if (!loaded) {
			videoSwapPopover.updateCheckState({
				status: "error",
				message: "Couldn't load that video. Check the link and try again.",
			});
			return;
		}

		applyVideoSrc({ figure: currentVideoFigure, src, editorAPI });
		videoSwapPopover.updateCheckState({ status: "idle" });
		videoSwapPopover.popover.hidePopover();
	});

	return () => {
		unsubscribeSwap();
	};
};
