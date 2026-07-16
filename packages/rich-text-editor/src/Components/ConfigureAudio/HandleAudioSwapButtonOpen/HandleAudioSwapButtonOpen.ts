import { getAudioFigure, showAudioSwapPopover } from "../_Utilities";
import type { HandleAudioSwapButtonOpenParams } from "./HandleAudioSwapButtonOpen-types";

/**
 * Wires the edit popover's Swap button to the shared swap popover, anchoring it to the
 * currently-hovered audio block.
 */
export const handleAudioSwapButtonOpen = ({
	richTextEditorUI,
	getCurrentBlock,
	internals,
}: HandleAudioSwapButtonOpenParams) => {
	const { audioEditPopover } = richTextEditorUI;

	const unsubscribe = audioEditPopover.onSwapPopoverOpen(() => {
		const currentBlock = getCurrentBlock();

		if (!currentBlock) {
			return;
		}

		const figure = getAudioFigure({ blockNestedContext: currentBlock });

		showAudioSwapPopover({ richTextEditorUI, internals, figure });
	});

	return () => {
		unsubscribe();
	};
};
