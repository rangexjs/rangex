import {
	isWellFormedUrl,
	probeMediaSrc,
	uploadMediaFile,
} from "../../../_Utilities";
import { assertNever } from "../../../ErrorHandling";
import { applyImageSrc } from "../_Utilities";
import type {
	HandleImageSwapParams,
	ResolveSwapSrcParams,
	ResolveSwapSrcResult,
} from "./HandleImageSwap-types";

/**
 * Resolves a swap submission down to a single `src`, or `null` if there's nothing usable
 * to apply. An invalid URL pushes an error back into the popover before returning `null`;
 * a missing file returns `null` silently — the popover already guards against submitting
 * without one, so that case is unreachable in practice.
 */
const resolveSwapSrc = async ({
	emitSwapParams,
	imageSwapPopover,
	isStillCurrent,
}: ResolveSwapSrcParams): Promise<ResolveSwapSrcResult> => {
	if (emitSwapParams.source === "url") {
		if (!isWellFormedUrl(emitSwapParams.url)) {
			imageSwapPopover.updateCheckState({
				status: "error",
				message: "Enter a valid URL.",
			});
			return null;
		}

		return emitSwapParams.url;
	}

	if (emitSwapParams.source === "file-upload") {
		const [file] = emitSwapParams.files;

		if (!file) {
			return null;
		}

		imageSwapPopover.updateCheckState({ status: "uploading", progress: 0 });

		const src = await uploadMediaFile({
			file,
			onProgress: (progress) => {
				if (!isStillCurrent()) {
					return;
				}

				imageSwapPopover.updateCheckState({ status: "uploading", progress });
			},
		});

		if (!src) {
			imageSwapPopover.updateCheckState({
				status: "error",
				message: "Couldn't read that file. Try a different one.",
			});
			return null;
		}

		return src;
	}

	return assertNever(emitSwapParams);
};

/**
 * Wires the shared swap popover's Update action to the engine. Fills the empty
 * placeholder on first use, or just updates `src` on an already-filled image — both
 * driven by `internals.currentImageFigure`, set whenever the popover was opened
 * (dropzone click or the edit popover's Swap button). `src` is never applied until
 * `probeMediaSrc` confirms it actually loads, so a bad swap leaves the current image
 * untouched instead of needing to be rolled back.
 */
export const handleImageSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleImageSwapParams) => {
	const { imageSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = imageSwapPopover.onSwap(async (params) => {
		const { currentImageFigure } = internals;

		if (!currentImageFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		// The target image might not be available anymore by the time `src` is resolved.
		const isStillCurrent = () =>
			internals.currentImageFigure === currentImageFigure;

		const src = await resolveSwapSrc({
			emitSwapParams: params,
			imageSwapPopover,
			isStillCurrent,
		});

		if (src === null) {
			return;
		}

		if (!isStillCurrent()) {
			return;
		}

		imageSwapPopover.updateCheckState({ status: "checking" });

		const loaded = await probeMediaSrc({ type: "image", src });

		if (!isStillCurrent()) {
			return;
		}

		if (!loaded) {
			imageSwapPopover.updateCheckState({
				status: "error",
				message: "Couldn't load that image. Check the link and try again.",
			});
			return;
		}

		applyImageSrc({ figure: currentImageFigure, src, editorAPI });
		imageSwapPopover.updateCheckState({ status: "idle" });
		imageSwapPopover.popover.hidePopover();
	});

	return () => {
		unsubscribeSwap();
	};
};
