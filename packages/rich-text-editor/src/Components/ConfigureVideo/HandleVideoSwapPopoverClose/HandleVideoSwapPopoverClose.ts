import type { HandleVideoSwapPopoverCloseParams } from "./HandleVideoSwapPopoverClose-types";

/**
 * Clears `internals.currentVideoFigure` whenever the swap popover closes, regardless of
 * how it was dismissed (Update, outside click, Escape) — keeps internals consistent for
 * the next time it's opened.
 */
export const handleVideoSwapPopoverClose = ({
	richTextEditorUI,
	internals,
}: HandleVideoSwapPopoverCloseParams) => {
	const { popover } = richTextEditorUI.videoSwapPopover;

	const listener = (event: ToggleEvent) => {
		if (event.newState === "open") {
			return;
		}

		internals.currentVideoFigure = null;
	};

	popover.addEventListener("toggle", listener);

	return () => popover.removeEventListener("toggle", listener);
};
