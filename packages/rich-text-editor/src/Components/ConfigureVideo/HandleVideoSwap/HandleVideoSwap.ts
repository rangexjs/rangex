import { assertNever } from "../../../ErrorHandling";
import { applyVideoSrc, readFileAsDataURL } from "../_Utilities";
import type { HandleVideoSwapParams } from "./HandleVideoSwap-types";

/**
 * Wires the popover's Swap control to the engine. Only the `video`'s `src` changes —
 * object-fit, aspect ratio, playback, poster, and caption are left untouched.
 */
export const handleVideoSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleVideoSwapParams) => {
	const { videoSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = videoSwapPopover.onSwap((params) => {
		const { currentVideoFigure } = internals;

		if (!currentVideoFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		if (params.source === "url") {
			applyVideoSrc({
				figure: currentVideoFigure,
				src: params.url,
				editorAPI,
			});
			return;
		}

		if (params.source === "file-upload") {
			const [file] = params.files;

			if (!file) {
				return;
			}

			readFileAsDataURL(file).then((src) => {
				applyVideoSrc({ figure: currentVideoFigure, src, editorAPI });
			});
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribeSwap();
	};
};
