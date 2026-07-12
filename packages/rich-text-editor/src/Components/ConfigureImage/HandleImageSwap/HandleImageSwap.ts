import { assertNever } from "../../../ErrorHandling";
import { applyImageSrc, readFileAsDataURL } from "../_Utilities";
import type { HandleImageSwapParams } from "./HandleImageSwap-types";

/**
 * Wires the shared swap popover's Update action to the engine. Fills the empty
 * placeholder on first use, or just updates `src` on an already-filled image — both
 * driven by `internals.currentImageFigure`, set whenever the popover was opened
 * (dropzone click or the edit popover's Swap button).
 */
export const handleImageSwap = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleImageSwapParams) => {
	const { imageSwapPopover } = richTextEditorUI;

	const unsubscribeSwap = imageSwapPopover.onSwap((params) => {
		const { currentImageFigure } = internals;

		if (!currentImageFigure) {
			console.warn("Figure should have been assigned.");
			return;
		}

		if (params.source === "url") {
			applyImageSrc({ figure: currentImageFigure, src: params.url, editorAPI });
			return;
		}

		if (params.source === "file-upload") {
			const [file] = params.files;

			if (!file) {
				return;
			}

			readFileAsDataURL(file).then((src) => {
				applyImageSrc({ figure: currentImageFigure, src, editorAPI });
			});
			return;
		}

		assertNever(params);
	});

	return () => {
		unsubscribeSwap();
	};
};
