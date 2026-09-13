import {
	createAnchoredOverlayController,
	createOverlayAppearanceHandler,
} from "#engine-links";
import type { HandleQuickActionsOverlayAppearanceParams } from "./HandleQuickActionsOverlayAppearance-types";

/*
 * Wires a block component's quick-actions overlay appearance to the engine, anchoring it to
 * the current block on hover and tracking that block as the port's current component while
 * open. `beforeOpen` runs before each show, so the caller can push any extra state it needs.
 */
export const handleQuickActionsOverlayAppearance = ({
	port,
	editorAPI,
	componentName,
	beforeOpen,
}: HandleQuickActionsOverlayAppearanceParams) => {
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	const anchorController = createAnchoredOverlayController({
		element: port.quickActionsEl,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
			onToggle: (open) => port.setQuickActions({ open }),
		},
	});

	const { getCurrentBlock, cleanup: registrationCleanup } =
		overlayAppearanceHandler.registerComponent({
			popover: anchorController.element,
			shouldShow({ blockComponent }) {
				return blockComponent.$$componentName === componentName;
			},
			onShow({ blockComponent }) {
				anchorController.hide({});

				port.setCurrentComponent(blockComponent);

				beforeOpen({ blockComponent });

				anchorController.show(blockComponent, {
					clear: true,
					position: "absolute",
					top: "calc(anchor(top) + 4px)",
					right: "calc(anchor(right) + 4px)",
				});
			},
			onClose() {
				anchorController.hide({});

				port.setCurrentComponent(null);
			},
		});

	return {
		getCurrentBlock,
		cleanup: () => {
			overlayAppearanceHandler.cleanup();
			registrationCleanup();
		},
	};
};
