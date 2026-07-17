import type { HandleEmbedSwapPopoverCloseParams } from "./HandleEmbedSwapPopoverClose-types";

/**
 * Clears `internals.currentEmbedFigure` whenever the swap popover closes, regardless of
 * how it was dismissed (Update, outside click, Escape) — keeps internals consistent for
 * the next time it's opened.
 */
export const handleEmbedSwapPopoverClose = ({
	richTextEditorUI,
	internals,
}: HandleEmbedSwapPopoverCloseParams) => {
	const { popover } = richTextEditorUI.embedSwapPopover;

	const listener = (event: ToggleEvent) => {
		if (event.newState === "open") {
			return;
		}

		internals.currentEmbedFigure = null;
	};

	popover.addEventListener("toggle", listener);

	return () => popover.removeEventListener("toggle", listener);
};
