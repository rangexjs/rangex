import { getAudioFigure } from "../_Utilities";
import type { HandleAudioSwapCardOverlayToggleParams } from "./HandleAudioSwapCardOverlayToggle-types";

/**
 * Wires the quick-actions' Swap button to the engine. The UI emits a plain toggle signal on
 * click; this decides whether that means open or close, since only the Editor side knows
 * which audio is currently under the cursor (via `getCurrentBlock`).
 *
 * `internals.currentAudioFigure` is set on open and cleared on close, since the swap overlay
 * isn't reachable through {@link OverlayAppearanceHandler}'s hover-driven current-block
 * tracking.
 */
export const handleAudioSwapCardOverlayToggle = ({
	editorPort,
	getCurrentBlock,
	internals,
	swapAnchorController,
}: HandleAudioSwapCardOverlayToggleParams) => {
	const unsubscribe = editorPort.onToggleSwap(() => {
		if (swapAnchorController.isOpen) {
			swapAnchorController.hide();
			return;
		}

		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getAudioFigure({ blockComponent: currentBlock });

		internals.currentAudioFigure = figure;

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
