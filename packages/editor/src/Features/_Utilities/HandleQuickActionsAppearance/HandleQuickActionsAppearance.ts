import {
	createAnchoredOverlayController,
	createOverlayAppearanceHandler,
} from "#engine-links";
import type { HandleQuickActionsAppearanceParams } from "./HandleQuickActionsAppearance-types";

/*
 * Wires a block component's quick-actions overlay appearance to the engine, anchoring it to
 * the current block on hover and tracking that block as the port's current component while
 * open. `beforeOpen` runs before each show, so the caller can push any extra state it needs.
 */
export const handleQuickActionsAppearance = ({
	port,
	quickActionsPort,
	editorAPI,
	componentName,
	beforeOpen,
}: HandleQuickActionsAppearanceParams) => {
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	const anchorController = createAnchoredOverlayController({
		element: quickActionsPort.element,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
			onToggle: (isOpen) => quickActionsPort.updateQuickActions({ isOpen }),
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

				port.updateCurrentComponent({ currentComponent: blockComponent });

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

				port.updateCurrentComponent({ currentComponent: null });
			},
		});

	return {
		getCurrentBlock,
		cleanup: () => {
			overlayAppearanceHandler.cleanup();
			registrationCleanup();
			anchorController.cleanup();
		},
	};
};
