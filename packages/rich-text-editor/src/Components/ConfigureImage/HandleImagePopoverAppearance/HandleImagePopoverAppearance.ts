import { componentsName } from "../../../Constants";
import { getBlockAlign } from "../../_Utilities";
import type { HandleImagePopoverAppearanceParams } from "./HandleImagePopoverAppearance-types";

/**
 * Registers the image popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current alignment into the popover just before it appears.
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
		onShow({ blockNestedContext }) {
			const { $$parentElement } = blockNestedContext;

			if (!$$parentElement) {
				throw new Error("ParentElement not supposed to be null.");
			}

			const align = getBlockAlign({ blockNestedContextLine: $$parentElement });

			imagePopover.updateState({ align });
		},
	});

	return () => {
		blockPopoverAppearanceHandler.unregisterComponent({
			componentName: componentsName.image,
		});
	};
};
