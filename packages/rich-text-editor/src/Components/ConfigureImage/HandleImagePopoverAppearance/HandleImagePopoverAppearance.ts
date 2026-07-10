import { componentsName } from "../../../Constants";
import type { HandleImagePopoverAppearanceParams } from "./HandleImagePopoverAppearance-types";

/**
 * Registers the image popover with the shared {@link BlockPopoverAppearanceHandler}.
 * Content is a placeholder for now — no per-block state to push yet, so no `onShow`.
 */
export const handleImagePopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleImagePopoverAppearanceParams) => {
	const { imagePopover } = richTextEditorUI;

	blockPopoverAppearanceHandler.registerComponent({
		componentName: componentsName.image,
		popover: imagePopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
	});

	return () => {
		blockPopoverAppearanceHandler.unregisterComponent({
			componentName: componentsName.image,
		});
	};
};
