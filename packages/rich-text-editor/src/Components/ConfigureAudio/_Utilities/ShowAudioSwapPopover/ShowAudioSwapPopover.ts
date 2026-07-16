import type { ShowAudioSwapPopoverParams } from "./ShowAudioSwapPopover-types";

/**
 * Opens the shared swap popover anchored to the given audio's figure, and records it
 * on `internals` so the popover's Update action knows which block to apply to —
 * required since, unlike the edit popover, the swap popover isn't tied to
 * {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking.
 */
export const showAudioSwapPopover = ({
	richTextEditorUI,
	internals,
	figure,
}: ShowAudioSwapPopoverParams) => {
	const { audioSwapPopover } = richTextEditorUI;
	const { popover } = audioSwapPopover;

	internals.currentAudioFigure = figure;

	popover.hidePopover();

	popover.style.cssText = "";
	popover.style.positionArea = "center";

	popover.showPopover({ source: figure });
};
