import { getImageFigure, showImageSwapPopover } from "../_Utilities";
import type { HandleImageSwapButtonOpenParams } from "./HandleImageSwapButtonOpen-types";

/**
 * Wires the edit popover's Swap button to the shared swap popover, anchoring it to the
 * currently-hovered image block.
 */
export const handleImageSwapButtonOpen = ({
	richTextEditorUI,
	getCurrentBlock,
	internals,
}: HandleImageSwapButtonOpenParams) => {
	const { imageEditPopover } = richTextEditorUI;

	const unsubscribe = imageEditPopover.onSwapPopoverOpen(() => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getImageFigure({ blockNestedContext: currentBlock });

		showImageSwapPopover({ richTextEditorUI, internals, figure });
	});

	return () => {
		unsubscribe();
	};
};
