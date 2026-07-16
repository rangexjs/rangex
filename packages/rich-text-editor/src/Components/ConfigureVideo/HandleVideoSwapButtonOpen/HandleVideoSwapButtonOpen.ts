import { getVideoFigure, showVideoSwapPopover } from "../_Utilities";
import type { HandleVideoSwapButtonOpenParams } from "./HandleVideoSwapButtonOpen-types";

/**
 * Wires the edit popover's Swap button to the shared swap popover, anchoring it to the
 * currently-hovered video block.
 */
export const handleVideoSwapButtonOpen = ({
	richTextEditorUI,
	getCurrentBlock,
	internals,
}: HandleVideoSwapButtonOpenParams) => {
	const { videoEditPopover } = richTextEditorUI;

	const unsubscribe = videoEditPopover.onSwapPopoverOpen(() => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getVideoFigure({ blockNestedContext: currentBlock });

		showVideoSwapPopover({ richTextEditorUI, internals, figure });
	});

	return () => {
		unsubscribe();
	};
};
