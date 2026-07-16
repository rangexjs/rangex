import type { ShowImageSwapPopoverParams } from "./ShowImageSwapPopover-types";

/**
 * Opens the shared swap popover anchored to the given image's figure, and records it
 * on `internals` so the popover's Update action knows which block to apply to —
 * required since, unlike the edit popover, the swap popover isn't tied to
 * {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking.
 */
export const showImageSwapPopover = ({
	richTextEditorUI,
	internals,
	figure,
}: ShowImageSwapPopoverParams) => {
	const { imageSwapPopover } = richTextEditorUI;
	const { popover } = imageSwapPopover;

	internals.currentImageFigure = figure;

	popover.hidePopover();

	popover.style.cssText = "";
	popover.style.positionArea = "center";

	popover.showPopover({ source: figure });
};
