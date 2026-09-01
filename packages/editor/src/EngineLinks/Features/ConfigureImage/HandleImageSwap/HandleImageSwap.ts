import { assertNever } from "#ports";
import { isWellFormedUrl, probeMediaSrc } from "../../../_Utilities";
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
	editorPort,
	isStillCurrent,
}: ResolveSwapSrcParams): Promise<ResolveSwapSrcResult> => {
	if (emitSwapParams.source === "url") {
		if (!isWellFormedUrl(emitSwapParams.url)) {
			editorPort.updateState({
				swapCheckState: { status: "error", message: "Enter a valid URL." },
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

		editorPort.updateState({
			swapCheckState: { status: "uploading", progress: 0 },
		});

		const src = await editorPort.uploadFile({
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

	return assertNever(emitSwapParams);
};

/**
 * Wires the edit popover's Swap action to the engine. Fills the empty placeholder on first
 * use, or just updates `src` on an already-filled image — both driven by
 * `internals.currentImageFigure`, set whenever the swap popover was opened. `src` is never
 * applied until `probeMediaSrc` confirms it actually loads, so a bad swap leaves the current
 * image untouched instead of needing to be rolled back.
 */
export const handleImageSwap = ({
	editorPort,
	editorAPI,
	internals,
	swapAnchorController,
}: HandleImageSwapParams) => {
	const unsubscribeSwap = editorPort.onSwap(async (params) => {
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

		const loaded = await probeMediaSrc({ type: "image", src });

		if (!isStillCurrent()) {
			return;
		}

		if (!loaded) {
			editorPort.updateState({
				swapCheckState: {
					status: "error",
					message: "Couldn't load that image. Check the link and try again.",
				},
			});
			return;
		}

		applyImageSrc({ figure: currentImageFigure, src, editorAPI });
		editorPort.updateState({ swapCheckState: { status: "idle" } });
		swapAnchorController.hide();
	});

	return () => {
		unsubscribeSwap();
	};
};
