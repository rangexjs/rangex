import { getEmbedFigure, showEmbedSwapPopover } from "../_Utilities";
import type { HandleEmbedSwapButtonOpenParams } from "./HandleEmbedSwapButtonOpen-types";

/**
 * Wires the edit popover's Swap button to the shared swap popover, anchoring it to the
 * currently-hovered embed block.
 */
export const handleEmbedSwapButtonOpen = ({
	richTextEditorUI,
	getCurrentBlock,
	internals,
}: HandleEmbedSwapButtonOpenParams) => {
	const { embedEditPopover } = richTextEditorUI;

	const unsubscribe = embedEditPopover.onSwapPopoverOpen(() => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getEmbedFigure({ blockNestedContext: currentBlock });

		showEmbedSwapPopover({ richTextEditorUI, internals, figure });
	});

	return () => {
		unsubscribe();
	};
};
