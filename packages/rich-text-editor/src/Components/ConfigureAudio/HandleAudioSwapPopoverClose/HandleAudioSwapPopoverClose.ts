import type { HandleAudioSwapPopoverCloseParams } from "./HandleAudioSwapPopoverClose-types";

/**
 * Clears `internals.currentAudioFigure` whenever the swap popover closes, regardless of
 * how it was dismissed (Update, outside click, Escape) — keeps internals consistent for
 * the next time it's opened.
 */
export const handleAudioSwapPopoverClose = ({
	richTextEditorUI,
	internals,
}: HandleAudioSwapPopoverCloseParams) => {
	const { popover } = richTextEditorUI.audioSwapPopover;

	const listener = (event: ToggleEvent) => {
		if (event.newState === "open") {
			return;
		}

		internals.currentAudioFigure = null;
	};

	popover.addEventListener("toggle", listener);

	return () => popover.removeEventListener("toggle", listener);
};
