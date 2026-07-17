import type { ShowEmbedSwapPopoverParams } from "./ShowEmbedSwapPopover-types";

/**
 * Opens the shared swap popover anchored to the given embed's figure, and records it
 * on `internals` so the popover's Update action knows which block to apply to —
 * required since, unlike the edit popover, the swap popover isn't tied to
 * {@link BlockPopoverAppearanceHandler}'s hover-driven current-block tracking.
 */
export const showEmbedSwapPopover = ({
	richTextEditorUI,
	internals,
	figure,
}: ShowEmbedSwapPopoverParams) => {
	const { embedSwapPopover } = richTextEditorUI;
	const { popover } = embedSwapPopover;

	internals.currentEmbedFigure = figure;

	popover.hidePopover();

	popover.style.cssText = "";
	popover.style.positionArea = "center";

	popover.showPopover({ source: figure });
};
