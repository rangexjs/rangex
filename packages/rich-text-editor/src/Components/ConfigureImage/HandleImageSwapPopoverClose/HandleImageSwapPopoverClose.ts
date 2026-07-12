import type { HandleImageSwapPopoverCloseParams } from "./HandleImageSwapPopoverClose-types";

/**
 * Clears `internals.currentImageFigure` whenever the swap popover closes, regardless of
 * how it was dismissed (Update, outside click, Escape) — keeps internals consistent for
 * the next time it's opened.
 */
export const handleImageSwapPopoverClose = ({
	richTextEditorUI,
	internals,
}: HandleImageSwapPopoverCloseParams) => {
	const { popover } = richTextEditorUI.imageSwapPopover;

	const listener = (event: ToggleEvent) => {
		if (event.newState === "open") {
			return;
		}

		internals.currentImageFigure = null;
	};

	popover.addEventListener("toggle", listener);

	return () => popover.removeEventListener("toggle", listener);
};
