import { componentsName } from "../../../Constants";
import { getBlockAlign } from "../../_Utilities";
import {
	getEmbedAspectRatio,
	getEmbedCaption,
	getEmbedFigure,
	getEmbedIframe,
	getEmbedTitle,
} from "../_Utilities";
import type { HandleEmbedPopoverAppearanceParams } from "./HandleEmbedPopoverAppearance-types";

/**
 * Registers the embed popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears. Returns
 * the registration's `getCurrentBlock`, threaded to every other embed handler that needs
 * to know which embed block the popover is currently open over.
 */
export const handleEmbedPopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleEmbedPopoverAppearanceParams) => {
	const { embedPopover } = richTextEditorUI;

	return blockPopoverAppearanceHandler.registerComponent({
		popover: embedPopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.embed;
		},
		onShow({ blockNestedContext }) {
			const { $$parentElement } = blockNestedContext;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockNestedContextLine: $$parentElement });

			const figure = getEmbedFigure({ blockNestedContext });
			const iframe = getEmbedIframe({ figure });

			const aspectRatio = getEmbedAspectRatio({ iframe });
			const caption = getEmbedCaption({ figure });
			const title = getEmbedTitle({ iframe });

			embedPopover.updateState({
				align,
				aspectRatio,
				caption,
				title,
			});
		},
	});
};
