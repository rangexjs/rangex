import { getImageFigure } from "../_Utilities";
import type { HandleImageSwapCardOverlayToggleParams } from "./HandleImageSwapCardOverlayToggle-types";

/**
 * Wires the quick-actions' Swap button to the engine. The UI emits a plain toggle signal on
 * click; this decides whether that means open or close, since only the Editor side knows
 * which image is currently under the cursor (via `getCurrentBlock`).
 *
 * `internals.currentImageFigure` is set on open and cleared on close, since the swap overlay
 * — despite being nested in the quick-actions markup — isn't reachable through
 * {@link OverlayAppearanceHandler}'s hover-driven current-block tracking.
 */
export const handleImageSwapCardOverlayToggle = ({
	editorPort,
	getCurrentBlock,
	internals,
	swapAnchorController,
}: HandleImageSwapCardOverlayToggleParams) => {
	const unsubscribe = editorPort.onToggleSwap(() => {
		if (swapAnchorController.isOpen) {
			swapAnchorController.hide();
			return;
		}

		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getImageFigure({ blockComponent: currentBlock });

		internals.currentImageFigure = figure;

		swapAnchorController.show(figure, {
			clear: true,
			position: "absolute",
			"position-area": "center",
		});
	});

	return () => {
		unsubscribe();
	};
};
