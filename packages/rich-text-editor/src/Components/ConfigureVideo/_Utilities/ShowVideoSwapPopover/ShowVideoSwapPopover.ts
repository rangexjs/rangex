import type { ShowVideoSwapPopoverParams } from "./ShowVideoSwapPopover-types";

/**
 * Opens the shared swap popover anchored to the given video's figure, and records it
 * on `internals` so the popover's Update action knows which block to apply to —
 * required since, unlike the edit popover, the swap popover isn't tied to
 * {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking.
 */
export const showVideoSwapPopover = ({
	richTextEditorUI,
	internals,
	figure,
}: ShowVideoSwapPopoverParams) => {
	const { videoSwapPopover } = richTextEditorUI;
	const { popover } = videoSwapPopover;

	internals.currentVideoFigure = figure;

	popover.hidePopover();

	popover.style.cssText = "";
	popover.style.positionArea = "center";

	popover.showPopover({ source: figure });
};
